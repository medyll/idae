import { OutboxStore, OutboxEntry } from "./outbox/OutboxStore";
import type { IDeliverer } from "./deliverer/IDeliverer";
import type { OnConflictHook } from "./ConflictResolver";
import { ensureUpdatedAt } from "./ensureUpdatedAt";

export type IdbqlEventPayload = {
  collection: string;
  op: OutboxEntry['op'];
  data?: any;
  key?: any;
  whereClause?: any;
  silent?: boolean;
  source?: 'local' | 'remote' | 'system';
};

export class SyncAdapter {
  private running = false;
  private intervalId: any = null;

  constructor(
    private outbox: OutboxStore,
    private deliverer?: IDeliverer,
    private intervalMs = 5000,
    private onConflict?: OnConflictHook
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => this.processPending(), this.intervalMs);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** Alias for backward compatibility with tests */
  async handleEvent(event: IdbqlEventPayload): Promise<void> {
    return this.applyEvent(event);
  }

  /** Alias for processPending for tests */
  async processOnce(): Promise<void> {
    return this.processPending();
  }

  async applyEvent(event: IdbqlEventPayload): Promise<void> {
    // Ignore silent events and non-local sources
    if (event.silent) return;
    if (event.source && event.source !== "local") return;

    const now = new Date().toISOString();

    const entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: event.collection,
      op: event.op,
      key: event.key,
      data: event.data,
      whereClause: event.whereClause,
      meta: { retryCount: 0, createdAt: now },
    };

    if (entry.data) {
      ensureUpdatedAt(entry.data);
    }

    await this.outbox.enqueue(entry);

    // Attempt immediate delivery if deliverer is available
    if (!this.deliverer) return;

    try {
      const result = await this.deliverer.deliver(entry);
      if (result.status === 'success') {
        // Apply server response locally if provided
        if (this.onConflict || result.response) {
          const payload: IdbqlEventPayload = {
            collection: entry.collection,
            op: entry.op,
            data: result.response ?? entry.data,
            key: entry.key,
            whereClause: entry.whereClause,
            source: 'remote',
            silent: true,
          };
          // Could apply conflict resolution here if needed
        }
        await this.outbox.remove(entry.id);
      } else if (result.status === 'retry') {
        entry.meta.retryCount = 1;
        entry.meta.lastAttempt = now;
        await this.outbox.update(entry);
      } else if (result.status === 'permanent') {
        entry.meta.lastAttempt = now;
        entry.meta.failed = true;
        entry.meta.failureReason = result.response;
        await this.outbox.update(entry);
      }
    } catch (e) {
      // treat unexpected errors as retryable
      entry.meta.retryCount = 1;
      entry.meta.lastAttempt = now;
      await this.outbox.update(entry).catch(() => {});
    }
  }

  private async processPending(): Promise<void> {
    if (!this.deliverer) return;
    try {
      const entries = await this.outbox.list(1);
      const entry = entries?.[0];
      if (!entry) return;

      const result = await this.deliverer.deliver(entry);
      if (result.status === 'success') {
        await this.outbox.remove(entry.id);
      } else if (result.status === 'retry') {
        entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
        entry.meta.lastAttempt = new Date().toISOString();
        await this.outbox.update(entry);
      } else if (result.status === 'permanent') {
        entry.meta.lastAttempt = new Date().toISOString();
        entry.meta.failed = true;
        entry.meta.failureReason = result.response;
        await this.outbox.update(entry);
      }
    } catch (e) {
      // ignore errors in background processing
    }
  }
}

export function createSyncAdapter(
  outbox: OutboxStore,
  deliverer?: IDeliverer,
  opts?: { onConflict?: OnConflictHook; intervalMs?: number }
): SyncAdapter {
  return new SyncAdapter(outbox, deliverer, opts?.intervalMs ?? 5000, opts?.onConflict);
}
