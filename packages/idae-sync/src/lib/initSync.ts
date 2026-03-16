import { getIdbqlEvent } from '@medyll/idae-idbql';
import { OutboxStore } from './outbox/OutboxStore';
import { createIdaeApiDeliverer } from './deliverer';
import { createSyncAdapter } from './SyncAdapter';
import type { SyncMode, SyncEvent, SyncEventHandler } from './SyncMode';

export type InitSyncOptions = {
  dbName?: string;
  dbVersion?: number;
  delivererConfig?: Record<string, unknown>;
  intervalMs?: number;
  // Phase 2
  mode?: SyncMode;
  collectionModes?: Record<string, SyncMode>;
  onSyncEvent?: SyncEventHandler;
};

interface IdbqlEventBus {
  _adapters?: unknown[] | null;
  _adapter?: unknown | null;
  registerAdapters(adapters: unknown[]): void;
  registerAdapter(adapter: unknown): void;
}

export function initSync(opts?: InitSyncOptions) {
  const dbName = opts?.dbName || 'idae-db';
  const dbVersion = opts?.dbVersion;
  const outbox = new OutboxStore(dbName, dbVersion);
  const deliverer = createIdaeApiDeliverer(opts?.delivererConfig);
  const syncAdapter = createSyncAdapter(outbox, deliverer, {
    intervalMs: opts?.intervalMs,
    mode: opts?.mode,
    collectionModes: opts?.collectionModes,
  });

  // Register initial sync event handler if provided
  if (opts?.onSyncEvent) {
    syncAdapter.onSyncEvent(opts.onSyncEvent);
  }

  const ev = getIdbqlEvent() as unknown as IdbqlEventBus;

  // Save previous adapters to restore on stop
  const previousAdapters = ev._adapters || null;
  const previousAdapter = ev._adapter || null;

  // Build new adapter list preserving existing adapters
  const adapters: unknown[] = [];
  if (previousAdapters && Array.isArray(previousAdapters)) adapters.push(...previousAdapters);
  else if (previousAdapter) adapters.push(previousAdapter);

  adapters.push(syncAdapter);

  ev.registerAdapters(adapters);

  // Start background processing
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
    // Phase 2 — mode management shortcuts
    setMode(mode: SyncMode) { syncAdapter.setMode(mode); },
    setCollectionMode(collection: string, mode: SyncMode) { syncAdapter.setCollectionMode(collection, mode); },
    getMode() { return syncAdapter.getMode(); },
    getCollectionMode(collection: string) { return syncAdapter.getCollectionMode(collection); },
    onSyncEvent(handler: SyncEventHandler) { return syncAdapter.onSyncEvent(handler); },
  };
}
