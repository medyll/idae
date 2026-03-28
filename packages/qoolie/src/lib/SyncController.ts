import type { OutboxStore, IdaeApiDeliverer, SyncEvent } from '@medyll/idae-sync';
import type { SyncAdapter } from '@medyll/idae-sync';
import type { SyncConfig, SyncStatus } from './types.js';
import { DLQController } from './DLQController.js';

/**
 * SyncController - Facade for sync operations
 */
export class SyncController {
  private syncAdapter: SyncAdapter;
  private outbox: OutboxStore;
  private deliverer: IdaeApiDeliverer;
  private syncConfig: SyncConfig | null;
  private dlqController: DLQController;
  private eventHandlers: Set<(event: SyncEvent) => void> = new Set();

  constructor(
    syncAdapter: SyncAdapter,
    outbox: OutboxStore,
    deliverer: IdaeApiDeliverer,
    syncConfig: SyncConfig | null
  ) {
    this.syncAdapter = syncAdapter;
    this.outbox = outbox;
    this.deliverer = deliverer;
    this.syncConfig = syncConfig;
    this.dlqController = new DLQController(outbox);
  }

  /**
   * Pause sync
   */
  pause(): void {
    this.syncAdapter.stop();
  }

  /**
   * Resume sync
   */
  resume(): void {
    this.syncAdapter.start();
  }

  /**
   * Get sync status
   */
  async getStatus(): Promise<SyncStatus> {
    const status = await this.syncAdapter.getStatus();
    const dlqLength = await this.outbox.size(); // DLQ size may need separate call

    return {
      running: status.running ?? false,
      networkPaused: status.networkPaused ?? false,
      queueLength: status.queueLength ?? 0,
      dlqLength: dlqLength,
      mode: status.mode as SyncStatus['mode'],
      circuitBreaker: status.circuitBreaker as SyncStatus['circuitBreaker'],
    };
  }

  /**
   * Flush pending operations
   */
  async flush(): Promise<void> {
    await this.syncAdapter.flush();
  }

  /**
   * Listen to sync events
   * Returns unsubscribe function
   */
  onEvent(handler: (event: SyncEvent) => void): () => void {
    this.eventHandlers.add(handler);

    // Subscribe to sync adapter events
    const unsubscribe = this.syncAdapter.onSyncEvent((event: SyncEvent) => {
      // Notify all handlers
      this.eventHandlers.forEach(h => {
        try {
          h(event);
        } catch (e) {
          console.error('[Qoolie] Sync event handler error:', e);
        }
      });
    });

    // Return unsubscribe function
    return () => {
      this.eventHandlers.delete(handler);
      unsubscribe();
    };
  }

  /**
   * Dead letter queue controller
   */
  get dlq(): DLQController {
    return this.dlqController;
  }
}
