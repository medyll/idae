import type { DeliverResult } from './deliverer/IDeliverer';
import type { OutboxEntry } from './outbox/OutboxStore';

export type DeliverFunction = (entry: OutboxEntry) => Promise<DeliverResult>;

import { OutboxStore } from './outbox/OutboxStore';

export class OutboxDeliverer {
  private maxRetries?: number;
  private backoffBaseMs: number;
  private concurrency?: number;
  constructor(
    private outbox: OutboxStore,
    private deliverFn: DeliverFunction,
    opts?: { maxRetries?: number; backoffBaseMs?: number; concurrency?: number; applyRemote?: (entryId:string, response:any)=>Promise<void> }
  ) {
    this.maxRetries = opts?.maxRetries;
    this.backoffBaseMs = opts?.backoffBaseMs ?? 1000;
    this.concurrency = opts?.concurrency;
    this.opts = opts;
  }

  private opts?: { maxRetries?: number; backoffBaseMs?: number; concurrency?: number; applyRemote?: (entryId:string, response:any)=>Promise<void> };

  async processOnce(): Promise<void> {
    const entries = await this.outbox.list(1);
    const entry = entries && entries.length ? entries[0] : undefined;
    if (!entry) return;
    let result: DeliverResult;
    try {
      result = await this.deliverFn(entry);
    } catch (e) {
      // treat errors as retry
      result = { status: 'retry', response: e };
    }

    const now = Date.now();

    if (result.status === 'success') {
      if (result.response && this.opts?.applyRemote) {
        try {
          await this.opts.applyRemote(entry.id, result.response);
        } catch (e) {
          // ignore applyRemote errors
        }
      }
      await this.outbox.remove(entry.id);
      return;
    }

    if (result.status === 'retry') {
      const retryCount = (entry.meta.retryCount ?? 0) + 1;
      const nextAttemptMs = now + this.backoffBaseMs * Math.pow(2, retryCount);
      entry.meta.retryCount = retryCount;
      entry.meta.lastAttempt = new Date(now).toISOString();
      entry.meta.nextAttempt = new Date(nextAttemptMs).toISOString();
      await this.outbox.update(entry);
      return;
    }

    if (result.status === 'permanent') {
      entry.meta.lastAttempt = new Date(now).toISOString();
      entry.meta.failed = true;
      entry.meta.failureReason = result.response;
      await this.outbox.update(entry);
      return;
    }
  }
}
