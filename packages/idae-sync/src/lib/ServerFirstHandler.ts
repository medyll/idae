import type { IDeliverer } from './deliverer/IDeliverer';
import type { OutboxEntry, OutboxStore } from './outbox/OutboxStore';
import type { RollbackManager } from './RollbackManager';
import type { SyncEvent, SyncEventHandler } from './SyncMode';

export class ServerFirstHandler {
  constructor(
    private outbox: OutboxStore,
    private deliverer: IDeliverer,
    private rollbackManager: RollbackManager,
    private emit: (event: SyncEvent) => void
  ) {}

  async handle(entry: OutboxEntry): Promise<void> {
    // 1. Snapshot current state for potential rollback
    const snapshotId = await this.rollbackManager.snapshot(entry.collection, entry.key ?? entry.id);

    // 2. Enqueue locally (optimistic — already written by caller)
    // Entry is already in outbox at this point

    // 3. Attempt server delivery
    try {
      const result = await this.deliverer.deliver(entry);

      if (result.status === 'success') {
        // Remove from outbox, discard snapshot
        await this.outbox.remove(entry.id);
        this.rollbackManager.discard(snapshotId);
        this.emit({ type: 'delivered', collection: entry.collection, entryId: entry.id });

      } else if (result.status === 'permanent') {
        // Server rejected → rollback local write
        await this.rollbackManager.rollback(snapshotId);
        await this.outbox.remove(entry.id);
        this.emit({
          type: 'rollback',
          collection: entry.collection,
          entryId: entry.id,
          reason: result.response,
        });

      } else if (result.status === 'retry') {
        // Transient failure → fallback to mobile-first (stay in outbox)
        this.rollbackManager.discard(snapshotId);
        entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
        entry.meta.lastAttempt = new Date().toISOString();
        await this.outbox.update(entry);
        this.emit({
          type: 'fallback',
          collection: entry.collection,
          entryId: entry.id,
          reason: 'transient',
          fallbackMode: 'mobile-first',
        });
      }
    } catch (e) {
      // Network error → fallback to mobile-first (stay in outbox for retry)
      this.rollbackManager.discard(snapshotId);
      entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
      entry.meta.lastAttempt = new Date().toISOString();
      await this.outbox.update(entry);
      this.emit({
        type: 'fallback',
        collection: entry.collection,
        entryId: entry.id,
        reason: e,
        fallbackMode: 'mobile-first',
      });
    }
  }
}
