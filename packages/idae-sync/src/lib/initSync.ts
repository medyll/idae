import { getIdbqlEvent } from '@medyll/idae-idbql';
import { OutboxStore } from './outbox/OutboxStore';
import { createIdaeApiDeliverer } from './deliverer';
import { createSyncAdapter } from './SyncAdapter';
import type { SyncMode, SyncEvent, SyncEventHandler } from './SyncMode';
import type { SyncHooks, DebugFn } from './SyncHooks';
import type { CanonicalApplyFn } from './ServerFirstHandler';
import type { CircuitBreakerOptions } from './CircuitBreaker';

export type InitSyncOptions<C extends string = string> = {
  dbName?: string;
  dbVersion?: number;
  delivererConfig?: Record<string, unknown>;
  intervalMs?: number;
  // Phase 2
  mode?: SyncMode;
  collectionModes?: Partial<Record<C, SyncMode>>;
  onSyncEvent?: SyncEventHandler;
  getDb?: () => Promise<IDBDatabase>;
  applyCanonical?: CanonicalApplyFn;
  // Phase 3
  maxRetries?: number;
  batchSize?: number;
  compact?: boolean;
  hooks?: SyncHooks;
  debug?: boolean | DebugFn;
  // Phase 4
  maxQueueSize?: number;
  queueFullStrategy?: 'reject' | 'drop-oldest';
  circuitBreaker?: CircuitBreakerOptions | false;
};

interface IdbqlEventBus {
  _adapters?: unknown[] | null;
  _adapter?: unknown | null;
  registerAdapters(adapters: unknown[]): void;
  registerAdapter(adapter: unknown): void;
}

export function initSync<C extends string = string>(opts?: InitSyncOptions<C>) {
  const dbName = opts?.dbName || 'idae-db';
  const dbVersion = opts?.dbVersion;
  const outbox = new OutboxStore(dbName, dbVersion);
  const deliverer = createIdaeApiDeliverer(opts?.delivererConfig);
  const syncAdapter = createSyncAdapter(outbox, deliverer, {
    intervalMs: opts?.intervalMs,
    mode: opts?.mode,
    collectionModes: opts?.collectionModes as Record<string, SyncMode> | undefined,
    getDb: opts?.getDb,
    applyCanonical: opts?.applyCanonical,
    maxRetries: opts?.maxRetries,
    batchSize: opts?.batchSize,
    compact: opts?.compact,
    hooks: opts?.hooks,
    debug: opts?.debug,
    maxQueueSize: opts?.maxQueueSize,
    queueFullStrategy: opts?.queueFullStrategy,
    circuitBreaker: opts?.circuitBreaker,
  });

  if (opts?.onSyncEvent) {
    syncAdapter.onSyncEvent(opts.onSyncEvent);
  }

  const ev = getIdbqlEvent() as unknown as IdbqlEventBus;

  const previousAdapters = ev._adapters || null;
  const previousAdapter = ev._adapter || null;

  const adapters: unknown[] = [];
  if (previousAdapters && Array.isArray(previousAdapters)) adapters.push(...previousAdapters);
  else if (previousAdapter) adapters.push(previousAdapter);

  adapters.push(syncAdapter);
  ev.registerAdapters(adapters);

  try {
    if (typeof syncAdapter.start === 'function') syncAdapter.start();
  } catch (e) {
    // ignore
  }

  return {
    stop() {
      try {
        if (typeof syncAdapter.stop === 'function') syncAdapter.stop();
      } catch (e) {}
      if (previousAdapters) ev.registerAdapters(previousAdapters);
      else ev.registerAdapter(previousAdapter);
    },
    outbox,
    syncAdapter,
    deliverer,
    // Mode management
    setMode(mode: SyncMode) { syncAdapter.setMode(mode); },
    setCollectionMode(collection: C, mode: SyncMode) { syncAdapter.setCollectionMode(collection, mode); },
    getMode() { return syncAdapter.getMode(); },
    getCollectionMode(collection: C) { return syncAdapter.getCollectionMode(collection); },
    onSyncEvent(handler: SyncEventHandler) { return syncAdapter.onSyncEvent(handler); },
    // Phase 4
    flush() { return syncAdapter.flush(); },
    getStatus() { return syncAdapter.getStatus(); },
    dlq: {
      list: () => (outbox as any).listDlq?.() as Promise<unknown[]>,
      replay: (id: string) => (outbox as any).replayDlq?.(id) as Promise<void>,
      clear: () => (outbox as any).clearDlq?.() as Promise<void>,
    },
  };
}
