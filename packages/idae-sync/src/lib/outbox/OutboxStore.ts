export type OutboxEntry = {
  id: string;
  collection: string;
  op: "add" | "put" | "update" | "delete" | "updateWhere" | "deleteWhere";
  key?: any;
  data?: any;
  whereClause?: any;
  meta?: { retryCount: number; lastAttempt?: string; createdAt: string };
};

// NOTE: This is an in-memory scaffold. Replace with IndexedDB-backed implementation.
export class OutboxStore {
  private entries = new Map<string, OutboxEntry>();

  enqueue(entry: OutboxEntry) {
    this.entries.set(entry.id, entry);
  }

  dequeue(id: string) {
    this.entries.delete(id);
  }

  list(): OutboxEntry[] {
    return Array.from(this.entries.values());
  }

  clear() {
    this.entries.clear();
  }
}
