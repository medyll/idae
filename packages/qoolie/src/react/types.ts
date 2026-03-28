// SyncEvent from idae-sync - defined locally to avoid import issues
export interface SyncEvent {
  type: 'delivered' | 'fallback' | 'rejected' | 'rollback' | 'dead-letter' | 'network-online' | 'network-offline';
  collection?: string;
  entryId?: string;
  reason?: unknown;
  fallbackMode?: SyncMode;
}

/**
 * Sync mode: 'mobile-first' (optimistic) or 'server-first' (rollback on failure)
 */
export type SyncMode = 'mobile-first' | 'server-first';

/**
 * Configuration for a single collection
 */
export interface CollectionConfig {
  /** IndexedDB keyPath (e.g., 'id', '++id') */
  keyPath: string;
  /** Enable sync for this collection (inherits global config if true) */
  sync?: boolean | SyncConfig;
}

/**
 * Map of collection names to their configs
 */
export interface CollectionConfigMap {
  [name: string]: CollectionConfig;
}

/**
 * Sync configuration (global or per-collection)
 * Extends IdaeApiClientConfigCoreOptions for full API client control
 */
export interface SyncConfig {
  /** Enable sync (default: true) */
  enabled?: boolean;
  /** API base URL (auto-detected if omitted). If provided, overrides host/port/method */
  baseUrl?: string;
  /** API host (default: 'localhost'). Used if baseUrl not provided */
  host?: string;
  /** API port (default: 3000). Used if baseUrl not provided */
  port?: number;
  /** API protocol: 'http' or 'https' (default: 'https'). Used if baseUrl not provided */
  method?: 'http' | 'https';
  /** Default database name for API calls (default: 'app') */
  defaultDb?: string;
  /** JWT token for authentication */
  token?: string;
  /** Tenant ID for multi-tenancy (injected into JWT or headers) */
  tenantId?: string;
  /** Custom headers to send with all API requests */
  headers?: Record<string, string>;
  /** Sync mode (default: 'mobile-first') */
  mode?: SyncMode;
  /** Polling interval in ms (default: 5000) */
  intervalMs?: number;
  /** Max retries before moving to DLQ (default: 10) */
  maxRetries?: number;
  /** Circuit breaker config (false to disable) */
  circuitBreaker?: CircuitBreakerOptions | false;
}

/**
 * Circuit breaker options
 */
export interface CircuitBreakerOptions {
  /** Number of failures before opening circuit (default: 5) */
  failureThreshold?: number;
  /** Time in ms before attempting reset (default: 30000) */
  resetTimeoutMs?: number;
}

/**
 * Main options for createQoolie()
 */
export interface QoolieOptions<T extends CollectionConfigMap> {
  /** IndexedDB database name */
  dbName: string;
  /** Database version (default: 1) */
  dbVersion?: number;
  /** Global sync configuration (false to disable entirely) */
  sync?: SyncConfig | false;
  /** Collection definitions */
  collections: T;
  /** State engine: 'svelte5' (default) or 'stator' */
  stateEngine?: 'svelte5' | 'stator';
  /** Optional hooks */
  hooks?: {
    /** Called on sync events */
    onSyncEvent?: (event: SyncEvent) => void;
    /** Called on sync errors */
    onError?: (error: Error, context: SyncErrorContext) => void;
  };
}

/**
 * Error context for onError hook
 */
export interface SyncErrorContext {
  entryId: string;
  collection: string;
  operation: string;
  retryCount: number;
  isPermanent: boolean;
}

/**
 * Sync status snapshot
 */
export interface SyncStatus {
  /** Is sync running */
  running: boolean;
  /** Paused due to network offline */
  networkPaused: boolean;
  /** Number of pending operations */
  queueLength: number;
  /** Number of failed operations */
  dlqLength: number;
  /** Current sync mode */
  mode: SyncMode;
  /** Circuit breaker state (if enabled) */
  circuitBreaker?: 'closed' | 'open' | 'half-open';
}

/**
 * Qoolie instance returned by createQoolie()
 */
export interface QoolieInstance<T extends CollectionConfigMap> {
  /** Collection accessor */
  collection: {
    [K in keyof T]: QoolieCollection<T[K]>;
  };
  /** Sync controller */
  sync: SyncController;
  /** Cleanup all resources */
  destroy(): void;
}

/**
 * Collection wrapper with CRUD operations
 */
export interface QoolieCollection<T extends CollectionConfig> {
  /** Query with filters */
  where(query: any): any;
  /** Get by ID */
  get(id: any): Promise<any>;
  /** Create document */
  create(data: any): Promise<any>;
  /** Update by ID */
  update(id: any, data: any): Promise<any>;
  /** Delete by ID */
  delete(id: any): Promise<boolean>;
  /** Bulk update */
  updateWhere(query: any, data: any): Promise<boolean>;
  /** Bulk delete */
  deleteWhere(query: any): Promise<boolean>;
}

/**
 * Sync controller for pause/resume/status
 */
export interface SyncController {
  /** Set JWT token for authentication */
  setToken(token: string): void;
  /** Clear JWT token */
  clearToken(): void;
  /** Pause sync */
  pause(): void;
  /** Resume sync */
  resume(): void;
  /** Get sync status */
  getStatus(): Promise<SyncStatus>;
  /** Flush pending operations */
  flush(): Promise<void>;
  /** Listen to sync events (returns unsubscribe) */
  onEvent(handler: (event: SyncEvent) => void): () => void;
  /** Dead letter queue controller */
  dlq: DLQController;
}

/**
 * Dead letter queue controller
 */
export interface DLQController {
  /** List failed entries */
  list(): Promise<any[]>;
  /** Retry failed entry */
  replay(id: string): Promise<void>;
  /** Clear all failed entries */
  clear(): Promise<void>;
}

/**
 * Qoolie-specific error class
 */
export class QoolieError extends Error {
  constructor(
    message: string,
    public context: {
      operation: string;
      collection: string;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = 'QoolieError';
  }
}
