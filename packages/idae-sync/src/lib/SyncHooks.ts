import type { OutboxEntry } from './outbox/OutboxStore.js';
import type { DeliverResult } from './deliverer/IDeliverer.js';

export type SyncHooks = {
  onBeforeDeliver?: (entry: OutboxEntry) => Promise<OutboxEntry> | OutboxEntry;
  onAfterDeliver?: (entry: OutboxEntry, result: DeliverResult) => Promise<void> | void;
  onEnqueue?: (entry: OutboxEntry) => Promise<OutboxEntry> | OutboxEntry;
};

export type DebugFn = (msg: string, data?: unknown) => void;
