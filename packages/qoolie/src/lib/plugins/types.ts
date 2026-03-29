/**
 * Plugin system types
 */

import type { ServerChange } from '../push/types.js';
import type { SyncEvent } from '../types.js';

/**
 * Custom deliverer interface
 */
export interface CustomDeliverer {
  /**
   * Deliver sync entries to server
   */
  deliver(entries: SyncEntry[]): Promise<DeliverResult>;
}

/**
 * Sync entry to be delivered
 */
export interface SyncEntry {
  id: string;
  collection: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

/**
 * Result of deliver operation
 */
export interface DeliverResult {
  success: boolean;
  deliveredCount: number;
  failedCount: number;
  errors?: Array<{ id: string; error: unknown }>;
}

/**
 * Plugin hooks
 */
export interface PluginHooks {
  /**
   * Called before sync operation
   */
  beforeSync?: (entry: SyncEntry) => SyncEntry | Promise<SyncEntry>;
  /**
   * Called after successful sync
   */
  afterSync?: (result: DeliverResult) => void | Promise<void>;
  /**
   * Called on sync error
   */
  onError?: (error: unknown, entry: SyncEntry) => void | Promise<void>;
  /**
   * Called on server change (push)
   */
  onServerChange?: (change: ServerChange) => void | Promise<void>;
  /**
   * Called on sync event
   */
  onSyncEvent?: (event: SyncEvent) => void | Promise<void>;
}

/**
 * Plugin definition
 */
export interface QooliePlugin {
  /** Plugin name (must be unique) */
  name: string;
  /** Plugin version */
  version?: string;
  /** Custom deliverer (optional, replaces default) */
  deliverer?: CustomDeliverer;
  /** Plugin hooks */
  hooks?: PluginHooks;
  /** Plugin initialization function */
  init?: (qoolie: any) => void | Promise<void>;
  /** Plugin cleanup function */
  destroy?: () => void | Promise<void>;
}

/**
 * Plugin manager interface
 */
export interface PluginManager {
  /** Register a plugin */
  register(plugin: QooliePlugin): void;
  /** Get registered plugin by name */
  get(name: string): QooliePlugin | undefined;
  /** Get all registered plugins */
  getAll(): QooliePlugin[];
  /** Unregister a plugin */
  unregister(name: string): void;
  /** Initialize all plugins */
  init(qoolie: any): Promise<void>;
  /** Destroy all plugins */
  destroy(): Promise<void>;
}
