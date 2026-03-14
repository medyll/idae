import { OutboxStore, OutboxEntry } from "./outbox/OutboxStore";
import type { OnConflictHook } from "./ConflictResolver";

export type IdbqlEventPayload = {
  collection: string;
  op: OutboxEntry['op'];
  data?: any;
  key?: any;
  whereClause?: any;
  silent?: boolean;
  source?: 'local' | 'remote' | 'system';
};

export function createSyncAdapter(
  outbox: OutboxStore,
  deliverer: { deliver(entry: OutboxEntry): Promise<{ status: 'success' | 'retry' | 'permanent'; response?: any; conflict?: { local: any; remote: any } }> },
  opts?: { maxRetries?: number; backoffBaseMs?: number; applyRemote?: (payload: IdbqlEventPayload) => Promise<void> }
) {
  const maxRetries = opts?.maxRetries ?? 5;
  const backoffBaseMs = opts?.backoffBaseMs ?? 1000;

export class SyncAdapter {
  private running = false;
  private intervalId: any = null;
  constructor(private outbox: OutboxStore, private deliverer?: Deliverer, private intervalMs = 5000, private onConflict?: OnConflictHook) {}

  async applyEvent(event: IdbqlEventPayload) {
    // Ignore silent events and non-local sources
    if (event.silent) return;
    if (event.source && event.source !== "local") return;

    if (event.data) {
      ensureUpdatedAt(event.data);
    }

    const entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: payload.collection,
      op: payload.op,
      key: payload.key,
      data: payload.data,
      whereClause: payload.whereClause,
      meta: { retryCount: 0, createdAt: now },
    };

    if (entry.data) {
      ensureUpdatedAt(entry.data);
    }

    await this.outbox.enqueue(entry);

    try {
      const result = await deliverer.deliver(entry);
      if (result.status === 'success') {
        // Apply server response locally if provided
        if (opts?.applyRemote) {
          const payload: IdbqlEventPayload = {
            collection: entry.collection,
            op: entry.op,
            data: result.response ?? entry.data,
            key: entry.key,
            whereClause: entry.whereClause,
            source: 'remote',
            silent: true,
          };
          try {
            await opts.applyRemote(payload);
          } catch (e) {
            // swallow apply errors but still remove entry to avoid duplicate application
          }
        }
        await outbox.remove(entry.id);
      } else if (result.status === 'retry') {
        entry.meta = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
        entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
        entry.meta.lastAttempt = new Date().toISOString();
        // optionally cap retries
        if (entry.meta.retryCount > maxRetries) {
          entry.meta.failed = true as any;
        }
        await outbox.update(entry);
      } else if (result.status === 'permanent') {
        entry.meta = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
        entry.meta.lastAttempt = new Date().toISOString();
        (entry.meta as any).failed = true;
        await outbox.update(entry);
      }
    } catch (e) {
      // treat unexpected errors as retryable
      entry.meta = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
      entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
      entry.meta.lastAttempt = new Date().toISOString();
      await outbox.update(entry).catch(() => {});
    }
  }

export function createSyncAdapter(outbox: OutboxStore, deliverer?: Deliverer, opts?: { onConflict?: OnConflictHook; intervalMs?: number }) {
  return new SyncAdapter(outbox, deliverer, opts?.intervalMs ?? 5000, opts?.onConflict);
}
