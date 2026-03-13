import { OutboxStore, OutboxEntry } from "./outbox/OutboxStore";

// Local minimal type to avoid tight coupling in this scaffold. Replace with the
// canonical type import from @medyll/idae-idbql once the package API is released.
export type IdbqlEventPayload = {
  collection: string;
  op: string;
  data?: any;
  keyPath?: string;
  whereClause?: any;
  silent?: boolean;
  source?: "local" | "remote" | "system";
};

export type Deliverer = (entry: OutboxEntry) => Promise<boolean>;

export class SyncAdapter {
  private running = false;
  constructor(private outbox: OutboxStore, private deliverer?: Deliverer) {}

  async applyEvent(event: IdbqlEventPayload) {
    // Ignore silent events and non-local sources
    if (event.silent) return;
    if (event.source && event.source !== "local") return;

    const entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: event.collection,
      op: event.op as any,
      key: (event as any).key,
      data: event.data,
      whereClause: event.whereClause,
      meta: { retryCount: 0, createdAt: new Date().toISOString() },
    };

    await this.outbox.enqueue(entry);

    // Attempt immediate delivery if deliverer provided
    if (this.deliverer) {
      try {
        const ok = await this.deliverer(entry);
        if (ok) {
          await this.outbox.remove(entry.id);
        }
      } catch (e) {
        // Will be retried later by background job (not implemented here)
      }
    }
  }
}

export function createSyncAdapter(outbox: OutboxStore, deliverer?: Deliverer) {
  return new SyncAdapter(outbox, deliverer);
}
