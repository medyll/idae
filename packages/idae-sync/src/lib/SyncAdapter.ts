import { OutboxStore, OutboxEntry } from "./outbox/OutboxStore";

// Local minimal type to avoid tight coupling in this scaffold. Replace with the
// canonical type import from @medyll/idae-idbql once the package API is released.
export type IdbqlEventPayload = {
  collection: string;
  op: string;
  data?: any;
  keyPath?: string;
  silent?: boolean;
  source?: "local" | "remote" | "system";
};

export class SyncAdapter {
  constructor(private outbox: OutboxStore) {}

  applyEvent(event: IdbqlEventPayload) {
    // Ignore silent events and non-local sources
    if (event.silent) return;
    if (event.source && event.source !== "local") return;

    const entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: event.collection,
      op: event.op as any,
      key: (event as any).key,
      data: event.data,
      meta: { retryCount: 0, createdAt: new Date().toISOString() },
    };

    this.outbox.enqueue(entry);
    // TODO: attempt immediate delivery and implement retry/backoff
  }
}

export function createSyncAdapter(outbox?: OutboxStore) {
  return new SyncAdapter(outbox || new OutboxStore());
}
