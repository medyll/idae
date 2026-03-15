import { OutboxStore, OutboxEntry } from "./outbox/OutboxStore";
import type { IDeliverer } from "./deliverer/IDeliverer";
import type { OnConflictHook } from "./ConflictResolver";
import { ConflictResolver } from "./ConflictResolver";
import { WhereSerializer } from "./WhereSerializer";
import { ensureUpdatedAt } from "./ensureUpdatedAt";

export type IdbqlEventPayload = {
  collection: string;
  op: OutboxEntry['op'];
  data?: unknown;
  key?: unknown;
  whereClause?: unknown;
  silent?: boolean;
  source?: 'local' | 'remote' | 'system';
};

// Extended shape for e2e compatibility (local-write events)
type LocalWriteEvent = {
  type: string;
  doc: unknown;
  source: string;
};

export class SyncAdapter {
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private outbox: OutboxStore,
    private deliverer?: IDeliverer,
    private intervalMs = 5000,
    private onConflict?: OnConflictHook
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => this.processPending(), this.intervalMs);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** Accept both IdbqlEventPayload and LocalWriteEvent shapes */
  async handleEvent(event: IdbqlEventPayload | LocalWriteEvent): Promise<void> {
    if ('type' in event && 'doc' in event) {
      // Map local-write shape to IdbqlEventPayload
      const localWrite = event as LocalWriteEvent;
      return this.applyEvent({
        collection: localWrite.type,
        op: 'put',
        data: localWrite.doc,
        source: localWrite.source as 'local',
      });
    }
    return this.applyEvent(event as IdbqlEventPayload);
  }

  /** Alias for processPending for backward compatibility */
  async processOnce(): Promise<void> {
    return this.processPending();
  }

  async applyEvent(event: IdbqlEventPayload): Promise<void> {
    // Ignore silent events and non-local sources
    if (event.silent) return;
    if (event.source && event.source !== "local") return;

    const now = new Date().toISOString();

    const entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: event.collection,
      op: event.op,
      key: event.key,
      data: event.data,
      whereClause: event.whereClause,
      meta: { retryCount: 0, createdAt: now },
    };

    if (entry.data) {
      ensureUpdatedAt(entry.data);
    }

    await this.outbox.enqueue(entry);

    // Attempt immediate delivery if deliverer is available
    if (!this.deliverer) return;

    try {
      const result = await this.deliverer.deliver(entry);
      if (result.status === 'success') {
        await this.outbox.remove(entry.id);
      } else if (result.status === 'retry') {
        entry.meta.retryCount = 1;
        entry.meta.lastAttempt = now;
        await this.outbox.update(entry);
      } else if (result.status === 'permanent') {
        entry.meta.lastAttempt = now;
        entry.meta.failed = true;
        entry.meta.failureReason = result.response;
        await this.outbox.update(entry);
      }
    } catch (e) {
      // treat unexpected errors as retryable
      entry.meta.retryCount = 1;
      entry.meta.lastAttempt = now;
      await this.outbox.update(entry).catch(() => {});
    }
  }

  private async processPending(): Promise<void> {
    if (!this.deliverer) return;
    try {
      const entries = await this.outbox.list(1);
      const entry = entries?.[0];
      if (!entry) return;

      const result = await this.deliverer.deliver(entry);
      if (result.status === 'success') {
        await this.outbox.remove(entry.id);
      } else if (result.status === 'retry') {
        entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
        entry.meta.lastAttempt = new Date().toISOString();
        await this.outbox.update(entry);
      } else if (result.status === 'permanent') {
        entry.meta.lastAttempt = new Date().toISOString();
        entry.meta.failed = true;
        entry.meta.failureReason = result.response;
        await this.outbox.update(entry);
      }
    } catch (e) {
      // ignore errors in background processing
    }
  }
}

// Overload signatures for createSyncAdapter
export function createSyncAdapter(
  opts: {
    outbox: OutboxStore;
    serializer?: WhereSerializer;
    ensureUpdatedAt?: (obj: unknown) => void;
    conflictResolver?: ConflictResolver;
  }
): SyncAdapter;
export function createSyncAdapter(
  outbox: OutboxStore,
  deliverer?: IDeliverer,
  opts?: { onConflict?: OnConflictHook; intervalMs?: number }
): SyncAdapter;

// Implementation
export function createSyncAdapter(
  outboxOrOpts:
    | OutboxStore
    | {
        outbox: OutboxStore;
        serializer?: WhereSerializer;
        ensureUpdatedAt?: (obj: unknown) => void;
        conflictResolver?: ConflictResolver;
      },
  deliverer?: IDeliverer,
  opts?: { onConflict?: OnConflictHook; intervalMs?: number }
): SyncAdapter {
  if (typeof outboxOrOpts === 'object' && 'outbox' in outboxOrOpts && 'serializer' in outboxOrOpts) {
    // Options-object overload (e2e test style)
    const optionsObj = outboxOrOpts as {
      outbox: OutboxStore;
      serializer?: WhereSerializer;
      ensureUpdatedAt?: (obj: unknown) => void;
      conflictResolver?: ConflictResolver;
    };
    return new SyncAdapter(
      optionsObj.outbox,
      deliverer,
      opts?.intervalMs ?? 5000,
      opts?.onConflict
    );
  }
  // Positional overload (original style)
  return new SyncAdapter(
    outboxOrOpts as OutboxStore,
    deliverer,
    opts?.intervalMs ?? 5000,
    opts?.onConflict
  );
}
