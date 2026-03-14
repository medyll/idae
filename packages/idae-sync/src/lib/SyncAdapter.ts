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
  private intervalId: any = null;
  constructor(private outbox: OutboxStore, private deliverer?: Deliverer, private intervalMs = 5000) {}

  async applyEvent(event: IdbqlEventPayload) {
    // Ignore silent events and non-local sources
    if (event.silent) return;
    if (event.source && event.source !== "local") return;

    if (event.data) {
      ensureUpdatedAt(event.data);
    }

    const entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: event.collection,
      op: event.op as any,
      key: (event as any).key,
      data: event.data,
      whereClause: event.whereClause,
      meta: { retryCount: 0, createdAt: new Date().toISOString() },
    };

    if (entry.data) {
      ensureUpdatedAt(entry.data);
    }

    await this.outbox.enqueue(entry);

    // Attempt immediate delivery if deliverer provided
    if (this.deliverer) {
      try {
        const ok = await this.deliverer(entry);
        if (ok) {
          await this.outbox.remove(entry.id);
        } else {
          // increment retryCount and lastAttempt
          entry.meta = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
          entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
          entry.meta.lastAttempt = new Date().toISOString();
          await this.outbox.update(entry);
        }
      } catch (e) {
        // Will be retried later by background job
        entry.meta = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
        entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
        entry.meta.lastAttempt = new Date().toISOString();
        await this.outbox.update(entry).catch(()=>{});
      }
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => this.processOnce().catch(()=>{}), this.intervalMs);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  async processOnce() {
    if (!this.deliverer) return;
    const entries = await this.outbox.list();
    for (const entry of entries) {
      // simple backoff: skip if lastAttempt within (2^retryCount)*1s window
      const retryCount = (entry.meta?.retryCount) || 0;
      const lastAttempt = entry.meta?.lastAttempt ? new Date(entry.meta.lastAttempt).getTime() : 0;
      const waitMs = Math.pow(2, retryCount) * 1000;
      if (lastAttempt && Date.now() - lastAttempt < waitMs) continue;

      try {
        const ok = await this.deliverer(entry);
        if (ok) {
          await this.outbox.remove(entry.id);
        } else {
          entry.meta = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
          entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
          entry.meta.lastAttempt = new Date().toISOString();
          await this.outbox.update(entry);
        }
      } catch (e) {
        entry.meta = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
        entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
        entry.meta.lastAttempt = new Date().toISOString();
        await this.outbox.update(entry).catch(()=>{});
      }
    }
  }
}

export function createSyncAdapter(outbox: OutboxStore, deliverer?: Deliverer, intervalMs?: number) {
  return new SyncAdapter(outbox, deliverer, intervalMs);
}

/* export function createSyncAdapter(outbox: OutboxStore, deliverer?: Deliverer) {
  return new SyncAdapter(outbox, deliverer);
} */
