import { OutboxEntry } from './OutboxStore';

export class InMemoryOutboxStore {
  private entries: Map<string, OutboxEntry> = new Map();
  private dlq: Map<string, OutboxEntry> = new Map();

  async enqueue(entry: OutboxEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  /** Alias for backward compatibility */
  async append(entry: OutboxEntry): Promise<void> {
    return this.enqueue(entry);
  }

  async list(limit = 100): Promise<OutboxEntry[]> {
    return Array.from(this.entries.values())
      .sort((a, b) => (b.meta.priority ?? 0) - (a.meta.priority ?? 0))
      .slice(0, limit);
  }

  async size(): Promise<number> {
    return this.entries.size;
  }

  async peek(): Promise<OutboxEntry | undefined> {
    return Array.from(this.entries.values())[0];
  }

  async remove(id: string): Promise<void> {
    this.entries.delete(id);
  }

  async update(entry: OutboxEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  async findPending(collection: string, key: unknown): Promise<OutboxEntry | undefined> {
    return Array.from(this.entries.values()).find(
      e => e.collection === collection && e.key === key && !e.meta.failed
    );
  }

  async moveToDlq(entryId: string, reason?: unknown): Promise<void> {
    const entry = this.entries.get(entryId);
    if (!entry) return;
    const dlqEntry = { ...entry, meta: { ...entry.meta, failed: true, failureReason: reason ?? 'max-retries' } };
    this.entries.delete(entryId);
    this.dlq.set(entryId, dlqEntry);
  }

  async listDlq(limit = 100): Promise<OutboxEntry[]> {
    return Array.from(this.dlq.values()).slice(0, limit);
  }

  async replayDlq(entryId: string): Promise<void> {
    const entry = this.dlq.get(entryId);
    if (!entry) return;
    const replayEntry: OutboxEntry = {
      ...entry,
      meta: { ...entry.meta, failed: false, failureReason: undefined, retryCount: 0, lastAttempt: undefined },
    };
    this.dlq.delete(entryId);
    this.entries.set(entryId, replayEntry);
  }

  async clearDlq(): Promise<void> {
    this.dlq.clear();
  }

  // transactionalAppend records the entry to tx.staged only. It will be applied when tx.commit() is called.
  async transactionalAppend(tx: Tx, entry: OutboxEntry): Promise<void> {
    tx.staged.push(entry);
  }

  // internal: apply entry directly to store (used by Tx.commit)
  _applyEntry(entry: OutboxEntry) {
    this.entries.set(entry.id, entry);
  }
}

// Small Tx class for tests
export class Tx {
  staged: OutboxEntry[] = [];
  private committed = false;
  constructor(private store: InMemoryOutboxStore) {}

  async commit(): Promise<void> {
    if (this.committed) return;
    for (const e of this.staged) {
      this.store._applyEntry(e);
    }
    this.committed = true;
    this.staged = [];
  }

  async rollback(): Promise<void> {
    this.staged = [];
  }
}
