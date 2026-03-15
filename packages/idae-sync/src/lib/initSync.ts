import { getIdbqlEvent } from '@medyll/idae-idbql';
import { OutboxStore } from './outbox/OutboxStore';
import { createIdaeApiDeliverer } from './deliverer';
import { createSyncAdapter } from './SyncAdapter';

export type InitSyncOptions = {
  dbName?: string;
  dbVersion?: number;
  delivererConfig?: Record<string, unknown>;
  intervalMs?: number;
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
  const syncAdapter = createSyncAdapter(outbox, deliverer, { intervalMs: opts?.intervalMs });

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
      // Restore previous adapter(s)
      if (previousAdapters) ev.registerAdapters(previousAdapters);
      else ev.registerAdapter(previousAdapter);
    },
    outbox,
    syncAdapter,
    deliverer,
  };
}
