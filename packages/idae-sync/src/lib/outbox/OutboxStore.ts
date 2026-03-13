export type OutboxEntry = {
  id: string;
  collection: string;
  op: "add" | "put" | "update" | "delete" | "updateWhere" | "deleteWhere";
  key?: any;
  data?: any;
  whereClause?: any;
  meta?: { retryCount: number; lastAttempt?: string; createdAt: string };
};

export class OutboxStore {
  private dbName: string;
  private dbVersion?: number;

  constructor(dbName: string, dbVersion?: number) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  private async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.dbVersion);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async enqueue(entry: OutboxEntry): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["__outbox__"], "readwrite");
      const store = tx.objectStore("__outbox__");
      const r = store.add(entry as any);
      r.onsuccess = () => resolve();
      r.onerror = () => reject(r.error);
    });
  }

  async list(limit = 100): Promise<OutboxEntry[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["__outbox__"], "readonly");
      const store = tx.objectStore("__outbox__");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as OutboxEntry[]);
      req.onerror = () => reject(req.error);
    });
  }

  async remove(id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["__outbox__"], "readwrite");
      const store = tx.objectStore("__outbox__");
      const r = store.delete(id);
      r.onsuccess = () => resolve();
      r.onerror = () => reject(r.error);
    });
  }
}
