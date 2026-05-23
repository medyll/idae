/**
 * reactiveStore.svelte.ts
 * Svelte 5 reactive wrapper around qoolie collections.
 * Subscribes to qoolie's IdbEventBus and bumps a $state version per collection;
 * read methods (getAll/where/get) touch the version to register a tracking dep,
 * so $derived in components re-runs on any mutation or initial feed load.
 */
import { idbEventBus, type QoolieCollection, type CollectionConfig } from '@medyll/qoolie';

type Doc = CollectionConfig;
type AnyCollection = QoolieCollection<Doc>;

interface CollectionWrapper {
	getAll(): Doc[];
	where(query: Record<string, unknown>): Doc[];
	get(id: string | number): Promise<Doc | undefined>;
	create(data: Doc): Promise<Doc>;
	update(id: string | number, data: Doc): Promise<Doc>;
	delete(id: string | number): Promise<boolean>;
	updateWhere(query: Record<string, unknown>, data: Doc): Promise<boolean>;
	deleteWhere(query: Record<string, unknown>): Promise<boolean>;
	count(query?: Record<string, unknown>): Promise<number>;
	isSyncEnabled(): boolean;
	readonly collectionName: string;
}

function createWrapper(name: string, raw: AnyCollection): CollectionWrapper {
	let version = $state(0);

	const handler = (e: Event) => {
		const detail = (e as CustomEvent).detail;
		if (detail?.collection === name) version++;
	};
	idbEventBus.addEventListener('change', handler as EventListener);

	return {
		getAll() {
			void version;
			// Spread into new array so Svelte detects reference change on each mutation
			const data = raw.getAll();
			return Array.isArray(data) ? [...data] : data;
		},
		where(query: Record<string, unknown>) {
			void version;
			const data = raw.where(query);
			return Array.isArray(data) ? [...data] : data;
		},
		get(id: string | number) {
			void version;
			return raw.get(id);
		},
		create:       raw.create.bind(raw),
		update:       raw.update.bind(raw),
		delete:       raw.delete.bind(raw),
		updateWhere:  raw.updateWhere.bind(raw),
		deleteWhere:  raw.deleteWhere.bind(raw),
		count:        raw.count.bind(raw),
		isSyncEnabled: raw.isSyncEnabled.bind(raw),
		get collectionName() { return raw.collectionName; },
	};
}

export function createReactiveStore(
	rawStore: Record<string, AnyCollection>
): Record<string, AnyCollection> {
	const wrappers = new Map<string, CollectionWrapper>();

	return new Proxy({} as Record<string, AnyCollection>, {
		get(_, prop: string) {
			if (typeof prop !== 'string') return undefined;
			let w = wrappers.get(prop);
			if (!w) {
				const raw = rawStore[prop];
				if (!raw) return undefined;
				w = createWrapper(prop, raw);
				wrappers.set(prop, w);
			}
			return w as unknown as AnyCollection;
		},
	});
}
