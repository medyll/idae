import { OutboxEntry } from './OutboxStore';

export class InMemoryOutboxStore {
  private entries: Map<string, OutboxEntry> = new Map();

  // For tests we expose a simple subscribe-like hook if needed in future
  async enqueue(entry: OutboxEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  /** Alias for backward compatibility */
  async append(entry: OutboxEntry): Promise<void> {
    return this.enqueue(entry);
  }

  async list(limit = 100): Promise<OutboxEntry[]> {
    return Array.from(this.entries.values()).slice(0, limit);
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
