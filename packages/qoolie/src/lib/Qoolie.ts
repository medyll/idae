import { createDb, type SimpleModel } from './engine/IdbEngine.js';
import { createIdbState, type CollectionState } from './engine/IdbState.js';
import { IdbCollection } from './engine/IdbCollection.js';
import { idbEventBus } from './engine/IdbEventBus.js';
import { initSync, type SyncAdapter, type OutboxStore, type IdaeApiDeliverer } from '@medyll/idae-sync';

import type {
	QoolieOptions,
	QoolieInstance,
	CollectionConfigMap,
	SyncConfig,
} from './types.js';

import { normalizeConfig } from './utils/normalizeConfig.js';
import { autoDetectBaseUrl } from './utils/autoDetectBaseUrl.js';
import { QoolieCollection } from './QoolieCollection.js';
import { SyncController } from './SyncController.js';
import { HydrationController, type HydrationHooks } from './HydrationController.js';

/**
 * Main Qoolie class - orchestrates internal engine and optional sync
 */
export class Qoolie<T extends CollectionConfigMap> implements QoolieInstance<T> {
	private db: ReturnType<ReturnType<typeof createDb>['create']>['idbDatabase'];
	private idbql: ReturnType<ReturnType<typeof createDb>['create']>['idbql'];
	private collectionStates: Record<string, CollectionState<any>>;
	private syncAdapter?: SyncAdapter;
	private outbox?: OutboxStore;
	private deliverer?: IdaeApiDeliverer;
	private collectionMap: Map<string, QoolieCollection<any>>;
	private engineCollections: Map<string, any>;
	private syncController?: SyncController;
	private hydrationController?: HydrationController;
	private normalizedConfig: ReturnType<typeof normalizeConfig<T>>;
	private destroyed = false;
	private _readyPromise!: Promise<void>;

	constructor(options: QoolieOptions<T>) {
		try {
			// 1. Normalize configuration
			this.normalizedConfig = normalizeConfig(options);

			// 2. Auto-detect database host if not provided
			if (this.normalizedConfig.syncConfig && !this.normalizedConfig.syncConfig.databaseHost) {
				const detectedUrl = autoDetectBaseUrl();
				if (detectedUrl) {
					this.normalizedConfig.syncConfig.databaseHost = detectedUrl;
				}
			}

			// 3. Build simple model from collections
			const model: SimpleModel = {};
			for (const [name, config] of Object.entries(this.normalizedConfig.originalOptions.collections)) {
				model[name] = { keyPath: config.keyPath };
			}

			// 4. Initialize internal engine
			const dbResult = createDb(model, this.normalizedConfig.dbVersion)
				.create(this.normalizedConfig.dbName);

			this.db = dbResult.idbDatabase;
			this.idbql = dbResult.idbql;
			this.collectionMap = new Map();

			// 5. Open the database — store promise so callers can await readiness
			this._readyPromise = this.db.open().catch((err: unknown) => {
				const msg = String(err).toLowerCase();
				// Swallow expected non-fatal conditions; surface real failures
				if (msg.includes('already') || msg.includes('not available')) return;
				throw err;
			});

		// 6. Create engine collections and state
		const engineCollections: Record<string, IdbCollection<any>> = {};
		for (const [name, config] of Object.entries(model)) {
			engineCollections[name] = new IdbCollection(name, config.keyPath, {
				dbName: this.normalizedConfig.dbName,
				version: this.normalizedConfig.dbVersion
			}, idbEventBus);
		}
		this.engineCollections = new Map(Object.entries(engineCollections));

		const stateResult = createIdbState(engineCollections, idbEventBus);
		this.collectionStates = stateResult.collectionState;

			// 7. Initialize sync if enabled
			if (this.normalizedConfig.syncEnabled && this.normalizedConfig.syncConfig) {
				this.initializeSync();
			}

		// 8. Initialize hydration controller when sync + databaseHost are set
		if (this.normalizedConfig.syncEnabled && this.normalizedConfig.syncConfig?.databaseHost && this.deliverer) {
			const hooks = this.normalizedConfig.hooks as { onColdRead?: any; onHydrated?: any; onHydrateError?: any } | undefined;
			this.hydrationController = new HydrationController(
				this.deliverer,
				this.engineCollections,
				hooks,
				true
			);
		}

		// 9. Create collection wrappers
		this.createCollections();
		} catch (error) {
			throw new Error(`Failed to initialize Qoolie: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Initialize sync adapter and deliverer
	 */
	private initializeSync(): void {
		const syncConfig = this.normalizedConfig.syncConfig!;

		// Build deliverer config - pass all IdaeApiClient options
		const delivererConfig: Record<string, unknown> = {};

		// URL configuration
		if (syncConfig.databaseHost) {
			delivererConfig.baseUrl = syncConfig.databaseHost;
		}
		if (syncConfig.host) {
			delivererConfig.host = syncConfig.host;
		}
		if (syncConfig.port) {
			delivererConfig.port = syncConfig.port;
		}
		if (syncConfig.method) {
			delivererConfig.method = syncConfig.method;
		}
		if (syncConfig.defaultDb) {
			delivererConfig.defaultDb = syncConfig.defaultDb;
		}

		// Authentication & multi-tenancy
		if (syncConfig.token) {
			delivererConfig.token = syncConfig.token;
		}
		if (syncConfig.tenantId) {
			delivererConfig.tenantId = syncConfig.tenantId;
		}

		// Custom headers
		if (syncConfig.headers && Object.keys(syncConfig.headers).length > 0) {
			delivererConfig.headers = syncConfig.headers;
		}

		// Initialize sync via initSync
		const syncResult = initSync({
			dbName: this.normalizedConfig.dbName,
			dbVersion: this.normalizedConfig.dbVersion,
			delivererConfig,
			intervalMs: syncConfig.intervalMs,
			mode: syncConfig.mode,
			maxRetries: syncConfig.maxRetries,
			circuitBreaker: syncConfig.circuitBreaker === false ? false : syncConfig.circuitBreaker,
			hooks: this.normalizedConfig.hooks ? {
				onAfterDeliver: this.normalizedConfig.hooks.onSyncEvent,
			} : undefined,
		});

		this.syncAdapter = syncResult.syncAdapter;
		this.outbox = syncResult.outbox;
		this.deliverer = syncResult.deliverer;

		// Start sync adapter
		this.syncAdapter.start();
	}

	/**
	 * Create collection wrappers
	 */
	private createCollections(): void {
		for (const collectionConfig of this.normalizedConfig.collections) {
			const colState = this.collectionStates[collectionConfig.name];
			const collection = new QoolieCollection(
				collectionConfig.name,
				collectionConfig.keyPath,
				this.idbql,
				collectionConfig.syncEnabled,
				this.normalizedConfig.stateEngine,
				undefined,
				colState,
				this.hydrationController,
				collectionConfig.autoHydrate !== false
			);
			this.collectionMap.set(collectionConfig.name, collection);
		}
	}

	/** Resolves once the IDB database is open and ready for operations. */
	ready(): Promise<void> {
		return this._readyPromise;
	}

	/**
	 * Pull all (or named) collections from server in parallel and await completion.
	 * Use after IDB reset to block UI until data is available.
	 */
	async hydrateAll(names?: string[]): Promise<void> {
		if (!this.hydrationController) return;
		await this.hydrationController.hydrateAll(names);
	}

	/**
	 * Collection accessor - dynamic proxy
	 */
	get collection(): { [K in keyof T]: QoolieCollection<T[K]> } {
		return new Proxy({} as any, {
			get: (_, prop: string) => {
				if (this.destroyed) {
					throw new Error('Qoolie instance has been destroyed');
				}
				const collection = this.collectionMap.get(prop);
				if (!collection) {
					throw new Error(`Collection "${prop}" not found. Available collections: ${Array.from(this.collectionMap.keys()).join(', ')}`);
				}
				return collection;
			},
		});
	}

	/**
	 * Sync controller
	 */
	get sync(): SyncController {
		if (this.destroyed) {
			throw new Error('Qoolie instance has been destroyed');
		}
		if (!this.syncController) {
			if (!this.syncAdapter || !this.outbox || !this.deliverer) {
				throw new Error('Sync is not enabled. Initialize Qoolie with sync: { enabled: true }');
			}
			this.syncController = new SyncController(
				this.syncAdapter,
				this.outbox,
				this.deliverer,
				this.normalizedConfig.syncConfig,
				this.normalizedConfig.syncConfig?.push
			);
		}
		return this.syncController;
	}

	/**
	 * Cleanup all resources
	 */
	destroy(): void {
		if (this.destroyed) {
			return;
		}

		// Stop sync adapter
		this.syncAdapter?.stop();

		// Close database
		this.db.close();

		// Clear references
		this.collectionMap.clear();
		this.syncController = undefined;

		this.destroyed = true;
	}

	/**
	 * Check if instance is destroyed
	 */
	isDestroyed(): boolean {
		return this.destroyed;
	}
}

/**
 * Factory function to create Qoolie instance
 */
export function createQoolie<T extends CollectionConfigMap>(
	options: QoolieOptions<T>
): QoolieInstance<T> {
	return new Qoolie(options);
}
