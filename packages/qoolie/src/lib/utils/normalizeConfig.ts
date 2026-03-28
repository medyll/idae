import type {
  QoolieOptions,
  CollectionConfigMap,
  CollectionConfig,
  SyncConfig,
} from '../types.js';

/**
 * Normalized collection config
 */
export interface NormalizedCollectionConfig {
  name: string;
  keyPath: string;
  syncEnabled: boolean;
  syncConfig: SyncConfig | null;
}

/**
 * Normalized qoolie config
 */
export interface NormalizedQoolieConfig<T extends CollectionConfigMap> {
  dbName: string;
  dbVersion: number;
  syncEnabled: boolean;
  syncConfig: SyncConfig | null;
  collections: NormalizedCollectionConfig[];
  stateEngine: 'svelte5' | 'stator';
  hooks?: QoolieOptions<T>['hooks'];
  originalOptions: QoolieOptions<T>;
}

/**
 * Merge two sync configs (base + override)
 */
function mergeSyncConfigs(
  base: SyncConfig | null,
  override: SyncConfig | boolean | undefined
): SyncConfig | null {
  if (override === false) {
    return null;
  }
  
  if (override === true || override === undefined) {
    return base;
  }
  
  // Merge override into base
  return {
    ...base,
    ...override,
  };
}

/**
 * Validate collection config
 */
function validateCollectionConfig(name: string, config: CollectionConfig): void {
  if (!config.keyPath || typeof config.keyPath !== 'string') {
    throw new Error(`Collection "${name}": keyPath must be a non-empty string`);
  }
}

/**
 * Normalize and validate qoolie configuration
 */
export function normalizeConfig<T extends CollectionConfigMap>(
  options: QoolieOptions<T>
): NormalizedQoolieConfig<T> {
  // Validate required fields
  if (!options.dbName || typeof options.dbName !== 'string') {
    throw new Error('dbName is required and must be a string');
  }
  
  if (!options.collections || typeof options.collections !== 'object') {
    throw new Error('collections is required and must be an object');
  }
  
  // Determine global sync enabled
  const globalSyncEnabled = options.sync !== false;
  
  // Build global sync config
  const syncOptions = options.sync as SyncConfig | undefined;
  const globalSyncConfig: SyncConfig | null = globalSyncEnabled && syncOptions
    ? {
        enabled: syncOptions?.enabled ?? true,
        databaseHost: syncOptions?.databaseHost,
        host: syncOptions?.host,
        port: syncOptions?.port,
        method: syncOptions?.method,
        defaultDb: syncOptions?.defaultDb,
        token: syncOptions?.token,
        tenantId: syncOptions?.tenantId,
        headers: syncOptions?.headers,
        mode: syncOptions?.mode ?? 'mobile-first',
        intervalMs: syncOptions?.intervalMs ?? 5000,
        maxRetries: syncOptions?.maxRetries ?? 10,
        circuitBreaker: syncOptions?.circuitBreaker ?? {
          failureThreshold: 5,
          resetTimeoutMs: 30000,
        },
      }
    : null;
  
  // Normalize collections
  const normalizedCollections: NormalizedCollectionConfig[] = [];
  
  for (const [name, config] of Object.entries(options.collections)) {
    validateCollectionConfig(name, config);
    
    // Determine if sync is enabled for this collection
    const collectionSyncEnabled = globalSyncEnabled && (config.sync !== false);
    
    // Merge global + per-collection sync config
    const collectionSyncConfig = collectionSyncEnabled
      ? mergeSyncConfigs(globalSyncConfig, config.sync)
      : null;
    
    normalizedCollections.push({
      name,
      keyPath: config.keyPath,
      syncEnabled: collectionSyncEnabled,
      syncConfig: collectionSyncConfig,
    });
  }
  
  if (normalizedCollections.length === 0) {
    throw new Error('At least one collection must be defined');
  }
  
  return {
    dbName: options.dbName,
    dbVersion: options.dbVersion ?? 1,
    syncEnabled: globalSyncEnabled,
    syncConfig: globalSyncConfig,
    collections: normalizedCollections,
    stateEngine: options.stateEngine ?? 'svelte5',
    hooks: options.hooks,
    originalOptions: options,
  };
}
