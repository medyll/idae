export type DeliverResult = { status: 'success'|'retry'|'permanent'; response?: any; conflict?: { local:any; remote:any } };

export type DeliverFunction = (entry: import('./outbox/OutboxStore').OutboxEntry) => Promise<DeliverResult>;

export class OutboxDeliverer {
  private maxRetries?: number;
  private backoffBaseMs: number;
  private concurrency?: number;
  constructor(
    private outbox: import('./outbox/OutboxStore').OutboxStore,
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
      const current = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
      const retryCount = (current.retryCount ?? 0) + 1;
      const nextAttemptMs = now + this.backoffBaseMs * Math.pow(2, retryCount);
      entry.meta = { ...current, retryCount, lastAttempt: new Date(now).toISOString(), nextAttempt: new Date(nextAttemptMs).toISOString() } as any;
      await this.outbox.update(entry);
      return;
    }

    if (result.status === 'permanent') {
      const current = entry.meta || { retryCount: 0, createdAt: new Date().toISOString() };
      entry.meta = { ...current, lastAttempt: new Date(now).toISOString(), failed: true, failureReason: result.response } as any;
      await this.outbox.update(entry);
      return;
    }
  }
}
