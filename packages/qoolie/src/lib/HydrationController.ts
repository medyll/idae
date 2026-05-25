import type { IdaeApiDeliverer } from '@medyll/idae-sync';
import type { IdbCollection } from './engine/IdbCollection.js';

/**
 * Lifecycle hooks for hydration events.
 */
export interface HydrationHooks {
	/** Called when a collection is read for the first time (cold read) */
	onColdRead?(collection: string): void;
	/** Called after a collection is successfully hydrated */
	onHydrated?(collection: string, count: number): void;
	/** Called when hydration fails */
	onHydrateError?(collection: string, err: Error): void;
}

/**
 * HydrationController — owns per-session hydrated Set + pull(name) + ensure(name).
 * Only active when syncConfig.databaseHost is set.
 */
export class HydrationController {
	private hydrated: Set<string> = new Set();
	private inFlight: Map<string, Promise<void>> = new Map();
	private deliverer: IdaeApiDeliverer;
	private collections: Map<string, IdbCollection<any>>;
	private hooks?: HydrationHooks;
	private enabled: boolean;

	constructor(
		deliverer: IdaeApiDeliverer,
		collections: Map<string, IdbCollection<any>>,
		hooks?: HydrationHooks,
		enabled = true
	) {
		this.deliverer = deliverer;
		this.collections = collections;
		this.hooks = hooks;
		this.enabled = enabled;
	}

	/**
	 * Pull records from server for a collection and silently upsert them into IDB.
	 * Fires no outbox events. Emits idbEventBus 'change' via bulkUpsertSilent.
	 */
	async pull(collectionName: string): Promise<void> {
		if (!this.enabled) return;

		const idbCollection = this.collections.get(collectionName);
		if (!idbCollection) return;

		try {
			this.hooks?.onColdRead?.(collectionName);
			const records = await this.deliverer.fetchAll(collectionName);
			if (records.length > 0) {
				await idbCollection.bulkUpsertSilent(records);
			}
			this.hooks?.onHydrated?.(collectionName, records.length);
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			this.hooks?.onHydrateError?.(collectionName, error);
			throw error; // propagate so ensure() does not mark as hydrated on failure
		}
	}

	/**
	 * Ensure a collection has been hydrated this session.
	 * - If already hydrated → no-op.
	 * - If pull in-flight → return the same promise (dedup).
	 * - Otherwise → fire pull() as background (void). Never blocks the caller.
	 */
	ensure(collectionName: string): void {
		if (!this.enabled) return;
		if (this.hydrated.has(collectionName)) return;

		const existing = this.inFlight.get(collectionName);
		if (existing) return;

		const promise = this.pull(collectionName)
			.then(() => {
				this.hydrated.add(collectionName);
				this.inFlight.delete(collectionName);
			})
			.catch(() => {
				// pull failed — clean up inFlight so next ensure() can retry
				this.inFlight.delete(collectionName);
			});

		this.inFlight.set(collectionName, promise);
	}

	/**
	 * Explicit revalidation — bypasses session dedup and awaits the pull.
	 * Use case: refresh button, window focus revalidation, post-login reset.
	 */
	async revalidate(collectionName: string): Promise<void> {
		this.hydrated.delete(collectionName);
		await this.pull(collectionName);
		this.hydrated.add(collectionName);
	}

	/**
	 * Pull all registered collections in parallel and await completion.
	 * Use case: warmup after IDB reset — block UI until data is available.
	 */
	async hydrateAll(names?: string[]): Promise<void> {
		const targets = names ?? [...this.collections.keys()];
		await Promise.allSettled(targets.map((name) => this.revalidate(name)));
	}
}
