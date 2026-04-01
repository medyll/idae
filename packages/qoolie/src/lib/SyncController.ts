import type { OutboxStore, IdaeApiDeliverer, SyncEvent } from '@medyll/idae-sync';
import type { SyncAdapter } from '@medyll/idae-sync';
import type { SyncConfig, SyncStatus, PushConfig } from './types.js';
import { DLQController } from './DLQController.js';
import { ServerPushListener } from './push/ServerPushListener.js';
import type { ServerChange } from './push/types.js';

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
  private pushListener?: ServerPushListener;
  private serverChangeHandlers: Set<(change: ServerChange) => void> = new Set();

  constructor(
    syncAdapter: SyncAdapter,
    outbox: OutboxStore,
    deliverer: IdaeApiDeliverer,
    syncConfig: SyncConfig | null,
    pushConfig?: PushConfig
  ) {
    this.syncAdapter = syncAdapter;
    this.outbox = outbox;
    this.deliverer = deliverer;
    this.syncConfig = syncConfig;
    this.dlqController = new DLQController(outbox);

    // Initialize server push listener if configured
    if (pushConfig?.enabled && pushConfig.url) {
      this.pushListener = new ServerPushListener({
        ...pushConfig,
        token: syncConfig?.token,
      });
      this.pushListener.onChange((change) => this.handleServerChange(change));
    }
  }

  /**
   * Update JWT token
   */
  setToken(token: string): void {
    (this.deliverer as any).client?.config?.setOptions?.({ token });
  }

  /**
   * Clear JWT token
   */
  clearToken(): void {
    (this.deliverer as any).client?.config?.setOptions?.({ token: undefined });
  }

  /**
   * Update tenant ID for multi-tenancy
   */
  setTenantId(tenantId: string): void {
    (this.deliverer as any).client?.config?.setOptions?.({ tenantId });
  }

  /**
   * Update custom headers
   */
  setHeaders(headers: Record<string, string>): void {
    (this.deliverer as any).client?.config?.setOptions?.({ headers });
  }

  /**
   * Update any client configuration option
   */
  configure(options: Record<string, unknown>): void {
    (this.deliverer as any).client?.config?.setOptions?.(options);
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

  /**
   * Start server push listener
   */
  startPush(): void {
    this.pushListener?.start();
  }

  /**
   * Stop server push listener
   */
  stopPush(): void {
    this.pushListener?.stop();
  }

  /**
   * Check if server push is connected
   */
  isPushConnected(): boolean {
    return this.pushListener?.isConnected() ?? false;
  }

  /**
   * Listen to server changes
   */
  onServerChange(handler: (change: ServerChange) => void): () => void {
    this.serverChangeHandlers.add(handler);
    return () => {
      this.serverChangeHandlers.delete(handler);
    };
  }

  /**
   * Handle incoming server change
   */
  private async handleServerChange(change: ServerChange): Promise<void> {
    // Notify all handlers
    for (const handler of this.serverChangeHandlers) {
      try {
        await handler(change);
      } catch (error) {
        console.error('[Qoolie] Server change handler error:', error);
      }
    }

    // TODO: Merge server change into local IndexedDB
    // This will be implemented based on change type
    if (change.type === 'create' || change.type === 'update') {
      // Upsert into local DB
      console.log('[Qoolie] Server change (upsert):', change);
    } else if (change.type === 'delete') {
      // Delete from local DB
      console.log('[Qoolie] Server change (delete):', change);
    }
  }
}
