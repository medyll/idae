import { OutboxStore, OutboxEntry } from "./outbox/OutboxStore";

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

  async function handleEvent(payload: IdbqlEventPayload): Promise<void> {
    if (payload.source !== 'local') return;
    if (payload.silent) return;

    const now = new Date().toISOString();
    const entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: payload.collection,
      op: payload.op,
      key: payload.key,
      data: payload.data,
      whereClause: payload.whereClause,
      meta: { retryCount: 0, createdAt: now },
    };

    await outbox.enqueue(entry);
  }

  async function processOnce(): Promise<void> {
    const entries = await outbox.list(1);
    if (!entries || entries.length === 0) return;
    const entry = entries[0];

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

  return { handleEvent, processOnce };
}
