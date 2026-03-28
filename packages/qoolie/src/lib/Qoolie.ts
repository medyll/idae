import type { IdbqModel } from '@medyll/idae-idbql';
import { createDb } from '@medyll/idae-idbql';
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

/**
 * Convert CollectionConfigMap to IdbqModel format
 */
function toIdbqModel<T extends CollectionConfigMap>(collections: T): IdbqModel {
  const model: Record<string, any> = {};
  for (const [name, config] of Object.entries(collections)) {
    model[name] = {
      keyPath: config.keyPath,
      ts: {},
    };
  }
  return model;
}

/**
 * Main Qoolie class - orchestrates idae-idbql and optional sync
 */
export class Qoolie<T extends CollectionConfigMap> implements QoolieInstance<T> {
  private db: ReturnType<ReturnType<typeof createDb>['create']>['idbDatabase'];
  private idbql: ReturnType<ReturnType<typeof createDb>['create']>['idbql'];
  private syncAdapter?: SyncAdapter;
  private outbox?: OutboxStore;
  private deliverer?: IdaeApiDeliverer;
  private collectionMap: Map<string, QoolieCollection<any>>;
  private syncController?: SyncController;
  private normalizedConfig: ReturnType<typeof normalizeConfig<T>>;
  private destroyed = false;

  constructor(options: QoolieOptions<T>) {
    try {
      // 1. Normalize configuration
      this.normalizedConfig = normalizeConfig(options);

      // 2. Auto-detect base URL if not provided
      if (this.normalizedConfig.syncConfig && !this.normalizedConfig.syncConfig.baseUrl) {
        const detectedUrl = autoDetectBaseUrl();
        if (detectedUrl) {
          this.normalizedConfig.syncConfig.baseUrl = detectedUrl;
        }
      }

      // 3. Initialize idae-idbql
      const idbqModel = toIdbqModel(this.normalizedConfig.originalOptions.collections);
      const dbResult = createDb(idbqModel, this.normalizedConfig.dbVersion)
        .create(this.normalizedConfig.dbName);

      this.db = dbResult.idbDatabase;
      this.idbql = dbResult.idbql;
      this.collectionMap = new Map();

      // 4. Initialize sync if enabled
      if (this.normalizedConfig.syncEnabled && this.normalizedConfig.syncConfig) {
        this.initializeSync();
      }

      // 5. Create collection wrappers
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

    // Build deliverer config
    const delivererConfig: Record<string, unknown> = {
      baseUrl: syncConfig.baseUrl,
    };

    // Add token if provided
    if (syncConfig.token) {
      delivererConfig.token = syncConfig.token;
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
      const collection = new QoolieCollection(
        collectionConfig.name,
        collectionConfig.keyPath,
        this.idbql,
        collectionConfig.syncEnabled,
        this.normalizedConfig.stateEngine
      );
      this.collectionMap.set(collectionConfig.name, collection);
    }
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
        this.normalizedConfig.syncConfig
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
