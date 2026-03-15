export type OutboxEntry = {
  id: string;
  collection: string;
  op: "add" | "put" | "update" | "delete" | "updateWhere" | "deleteWhere";
  key?: any;
  data?: any;
  whereClause?: any;
  meta: { retryCount: number; createdAt: string; lastAttempt?: string; nextAttempt?: string; failed?: boolean; failureReason?: unknown };
};

export type OutboxMetrics = {
  queueLength: number;
  oldestEntryAgeMs?: number | null;
  oldestCreatedAt?: string | null;
  lastAttemptAt?: string | null;
  maxRetry: number;
  retryHistogram: Record<string, number>;
};

export class OutboxStore {
  private dbName: string;
  private dbVersion?: number;
  private subscribers: Set<(m: OutboxMetrics) => void> = new Set();

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

  private async notifySubscribers() {
    if (this.subscribers.size === 0) return;
    try {
      const metrics = await this.getMetrics();
      for (const s of Array.from(this.subscribers)) {
        try {
          s(metrics);
        } catch (e) {
          // swallow subscriber errors
        }
      }
    } catch (e) {
      // ignore
    }
  }

  subscribe(cb: (metrics: OutboxMetrics) => void) {
    this.subscribers.add(cb);
    // Immediately call with current metrics asynchronously
    setTimeout(() => this.getMetrics().then(cb).catch(() => {}), 0);
    return () => this.subscribers.delete(cb);
  }

  async getMetrics(): Promise<OutboxMetrics> {
    const entries = await this.list();
    const queueLength = entries.length;
    const now = Date.now();

    let oldestCreatedAt: string | null = null;
    let oldestEntryAgeMs: number | null = null;
    let lastAttemptAt: string | null = null;
    let maxRetry = 0;
    const retryHistogram: Record<string, number> = {};

    for (const e of entries) {
      const created = e.meta?.createdAt ? new Date(e.meta.createdAt).getTime() : null;
      if (created) {
        if (!oldestCreatedAt || created < new Date(oldestCreatedAt).getTime()) {
          oldestCreatedAt = new Date(created).toISOString();
        }
      }
      const lastAttempt = e.meta?.lastAttempt ? new Date(e.meta.lastAttempt).getTime() : null;
      if (lastAttempt) {
        if (!lastAttemptAt || lastAttempt > new Date(lastAttemptAt).getTime()) {
          lastAttemptAt = new Date(lastAttempt).toISOString();
        }
      }
      const rc = e.meta?.retryCount ?? 0;
      maxRetry = Math.max(maxRetry, rc);
      retryHistogram[String(rc)] = (retryHistogram[String(rc)] || 0) + 1;
    }

    if (oldestCreatedAt) {
      const oldestTs = new Date(oldestCreatedAt).getTime();
      oldestEntryAgeMs = now - oldestTs;
    }

    return {
      queueLength,
      oldestEntryAgeMs,
      oldestCreatedAt,
      lastAttemptAt,
      maxRetry,
      retryHistogram,
    };
  }

  async enqueue(entry: OutboxEntry): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["__outbox__"], "readwrite");
      const store = tx.objectStore("__outbox__");
      const r = store.add(entry as any);
      r.onsuccess = async () => {
        resolve();
        await this.notifySubscribers();
      };
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
      r.onsuccess = async () => {
        resolve();
        await this.notifySubscribers();
      };
      r.onerror = () => reject(r.error);
    });
  }

  async update(entry: OutboxEntry): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["__outbox__"], "readwrite");
      const store = tx.objectStore("__outbox__");
      const r = store.put(entry as any);
      r.onsuccess = async () => {
        resolve();
        await this.notifySubscribers();
      };
      r.onerror = () => reject(r.error);
    });
  }
}
