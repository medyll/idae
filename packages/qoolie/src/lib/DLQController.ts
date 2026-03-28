import type { OutboxStore } from '@medyll/idae-sync';

/**
 * DLQController - Dead Letter Queue management
 */
export class DLQController {
  private outbox: OutboxStore;

  constructor(outbox: OutboxStore) {
    this.outbox = outbox;
  }

  /**
   * List failed entries
   */
  async list(): Promise<any[]> {
    return this.outbox.listDlq();
  }

  /**
   * Retry failed entry
   */
  async replay(id: string): Promise<void> {
    await this.outbox.replayDlq(id);
  }

  /**
   * Clear all failed entries
   */
  async clear(): Promise<void> {
    await this.outbox.clearDlq();
  }
}
