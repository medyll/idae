import type { OutboxStore } from './outbox/OutboxStore';

export type Snapshot = {
  id: string;
  collection: string;
  key: unknown;
  data: unknown;
};

export class RollbackManager {
  private snapshots = new Map<string, Snapshot>();

  constructor(private getDb: () => Promise<IDBDatabase>) {}

  async snapshot(collection: string, key: unknown): Promise<string> {
    const snapshotId = `${collection}:${String(key)}:${Date.now()}`;
    const data = await this.readCurrent(collection, key);
    this.snapshots.set(snapshotId, { id: snapshotId, collection, key, data });
    return snapshotId;
  }

  async rollback(snapshotId: string): Promise<void> {
    const snap = this.snapshots.get(snapshotId);
    if (!snap) return;
    await this.restoreData(snap.collection, snap.key, snap.data);
    this.snapshots.delete(snapshotId);
  }

  discard(snapshotId: string): void {
    this.snapshots.delete(snapshotId);
  }

  private async readCurrent(collection: string, key: unknown): Promise<unknown> {
    try {
      const db = await this.getDb();
      if (!db.objectStoreNames.contains(collection)) return undefined;
      const tx = db.transaction(collection, 'readonly');
      const store = tx.objectStore(collection);
      return new Promise((resolve, reject) => {
        const req = store.get(key as IDBValidKey);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return undefined;
    }
  }

  private async restoreData(collection: string, key: unknown, data: unknown): Promise<void> {
    const db = await this.getDb();
    if (!db.objectStoreNames.contains(collection)) return;
    const tx = db.transaction(collection, 'readwrite');
    const store = tx.objectStore(collection);
    await new Promise<void>((resolve, reject) => {
      if (data === undefined || data === null) {
        // Original didn't exist — delete the optimistic write
        const req = store.delete(key as IDBValidKey);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } else {
        // Restore previous state
        const req = store.put(data);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      }
    });
  }
}
