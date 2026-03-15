import type { DeliverResult } from './deliverer/IDeliverer';
import type { OutboxEntry } from './outbox/OutboxStore';
import { OutboxStore } from './outbox/OutboxStore';

export type DeliverFunction = (entry: OutboxEntry) => Promise<DeliverResult>;

/** Alias for type compatibility */
export type Deliverer = DeliverFunction;

export class OutboxDeliverer {
  private maxRetries?: number;
  private backoffBaseMs: number;

  constructor(
    private outbox: OutboxStore,
    opts?: { maxRetries?: number; backoffBaseMs?: number }
  ) {
    this.maxRetries = opts?.maxRetries;
    this.backoffBaseMs = opts?.backoffBaseMs ?? 1000;
  }

  async processOnce(callOpts: {
    deliver: DeliverFunction;
    applyRemote?: (response: unknown) => void | Promise<void>;
  }): Promise<void> {
    const entries = await this.outbox.list(1);
    const entry = entries?.[0];
    if (!entry) return;

    let result: DeliverResult;
    try {
      result = await callOpts.deliver(entry);
    } catch (e) {
      // treat errors as retry
      result = { status: 'retry', response: e };
    }

    const now = Date.now();

    if (result.status === 'success') {
      if (result.response && callOpts.applyRemote) {
        try {
          await callOpts.applyRemote(result.response);
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
