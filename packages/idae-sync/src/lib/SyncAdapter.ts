import { OutboxStore, OutboxEntry } from "./outbox/OutboxStore";
import type { IDeliverer } from "./deliverer/IDeliverer";
import type { OnConflictHook } from "./ConflictResolver";
import { ConflictResolver } from "./ConflictResolver";
import { WhereSerializer } from "./WhereSerializer";
import { ensureUpdatedAt } from "./ensureUpdatedAt";
import { SyncModeManager } from "./SyncModeManager";
import { ServerFirstHandler } from "./ServerFirstHandler";
import { RollbackManager } from "./RollbackManager";
import type { SyncMode, SyncModeConfig, SyncEvent, SyncEventHandler } from "./SyncMode";
import type { SyncHooks, DebugFn } from "./SyncHooks";
import type { CanonicalApplyFn } from "./ServerFirstHandler";
import { CircuitBreaker } from "./CircuitBreaker";
import type { CircuitBreakerOptions } from "./CircuitBreaker";

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

export type SyncAdapterOptions = {
  onConflict?: OnConflictHook;
  intervalMs?: number;
  // Phase 2
  mode?: SyncMode;
  collectionModes?: Record<string, SyncMode>;
  getDb?: () => Promise<IDBDatabase>;
  applyCanonical?: CanonicalApplyFn;
  // Phase 3
  maxRetries?: number;
  batchSize?: number;
  compact?: boolean;
  hooks?: SyncHooks;
  debug?: boolean | DebugFn;
  // Phase 4
  maxQueueSize?: number;
  /** Strategy when maxQueueSize exceeded: 'reject' (default) | 'drop-oldest' */
  queueFullStrategy?: 'reject' | 'drop-oldest';
  circuitBreaker?: CircuitBreakerOptions | false;
};

export class SyncAdapter {
  private running = false;
  private networkPaused = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private modeManager: SyncModeManager;
  private serverFirstHandler?: ServerFirstHandler;
  private rollbackManager?: RollbackManager;
  private syncEventHandlers: SyncEventHandler[] = [];
  private maxRetries: number;
  private batchSize: number;
  private compact: boolean;
  private hooks?: SyncHooks;
  private log: DebugFn;
  private onlineHandler?: () => void;
  private offlineHandler?: () => void;
  private maxQueueSize?: number;
  private queueFullStrategy: 'reject' | 'drop-oldest';
  private circuitBreaker?: CircuitBreaker;

  constructor(
    private outbox: OutboxStore,
    private deliverer?: IDeliverer,
    private intervalMs = 5000,
    private onConflict?: OnConflictHook,
    modeConfig?: SyncModeConfig,
    private opts: SyncAdapterOptions = {}
  ) {
    this.modeManager = new SyncModeManager(modeConfig);
    this.maxRetries = opts.maxRetries ?? 10;
    this.batchSize = opts.batchSize ?? 1;
    this.compact = opts.compact ?? false;
    this.hooks = opts.hooks;
    this.maxQueueSize = opts.maxQueueSize;
    this.queueFullStrategy = opts.queueFullStrategy ?? 'reject';
    if (opts.circuitBreaker !== false) {
      this.circuitBreaker = new CircuitBreaker(
        typeof opts.circuitBreaker === 'object' ? opts.circuitBreaker : undefined
      );
    }

    const debugOpt = opts.debug;
    this.log = typeof debugOpt === 'function'
      ? debugOpt
      : debugOpt === true
        ? (msg, data) => console.log(msg, data ?? '')
        : () => {};

    if (deliverer && opts.getDb) {
      this.rollbackManager = new RollbackManager(opts.getDb);
      this.serverFirstHandler = new ServerFirstHandler(
        outbox, deliverer, this.rollbackManager,
        (event) => this.emitSyncEvent(event),
        opts.applyCanonical,
        this.hooks,
        this.log
      );
    }
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => {
      if (!this.networkPaused) this.processPending();
    }, this.intervalMs);

    // Network awareness (browser only)
    if (typeof window !== 'undefined') {
      this.onlineHandler = () => {
        this.networkPaused = false;
        this.log('[idae-sync] network online — flushing outbox');
        this.emitSyncEvent({ type: 'network-online' });
        this.processPending();
      };
      this.offlineHandler = () => {
        this.networkPaused = true;
        this.log('[idae-sync] network offline — polling suspended');
        this.emitSyncEvent({ type: 'network-offline' });
      };
      window.addEventListener('online', this.onlineHandler);
      window.addEventListener('offline', this.offlineHandler);

      // Check initial state
      if (!navigator.onLine) {
        this.networkPaused = true;
        this.log('[idae-sync] started offline — polling suspended');
      }
    }
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (typeof window !== 'undefined') {
      if (this.onlineHandler) window.removeEventListener('online', this.onlineHandler);
      if (this.offlineHandler) window.removeEventListener('offline', this.offlineHandler);
    }
  }

  // --- Sync mode API ---

  setMode(mode: SyncMode): void {
    this.modeManager.setGlobal(mode);
  }

  setCollectionMode(collection: string, mode: SyncMode): void {
    this.modeManager.setCollection(collection, mode);
  }

  getMode(): SyncMode {
    return this.modeManager.getGlobal();
  }

  getCollectionMode(collection: string): SyncMode {
    return this.modeManager.getCollection(collection);
  }

  onSyncEvent(handler: SyncEventHandler): () => void {
    this.syncEventHandlers.push(handler);
    return () => {
      this.syncEventHandlers = this.syncEventHandlers.filter(h => h !== handler);
    };
  }

  private emitSyncEvent(event: SyncEvent): void {
    for (const handler of this.syncEventHandlers) {
      try { handler(event); } catch { /* ignore */ }
    }
  }

  /** Flush all pending outbox entries immediately (bypasses interval) */
  async flush(): Promise<void> {
    if (!this.deliverer) return;
    const entries = await this.outbox.list(1000);
    if (!entries.length) return;
    this.log(`[idae-sync] flush — ${entries.length} entries`);
    for (let i = 0; i < entries.length; i += this.batchSize) {
      await Promise.allSettled(entries.slice(i, i + this.batchSize).map(e => this.deliverOne(e)));
    }
  }

  /** Returns a full status snapshot — useful for devtools / monitoring */
  async getStatus(): Promise<{
    running: boolean;
    networkPaused: boolean;
    queueLength: number;
    dlqLength: number;
    mode: SyncMode;
    circuitBreaker: Record<string, unknown>;
  }> {
    const all = await this.outbox.list(10000);
    const dlq = await (this.outbox as any).listDlq?.() ?? [];
    return {
      running: this.running,
      networkPaused: this.networkPaused,
      queueLength: all.length,
      dlqLength: dlq.length,
      mode: this.modeManager.getGlobal(),
      circuitBreaker: this.circuitBreaker?.getStatus() ?? {},
    };
  }

  /** Accept both IdbqlEventPayload and LocalWriteEvent shapes */
  async handleEvent(event: IdbqlEventPayload | LocalWriteEvent): Promise<void> {
    if ('type' in event && 'doc' in event) {
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
    if (event.silent) return;
    if (event.source && event.source !== "local") return;

    const mode = this.modeManager.resolve(event.collection);

    if (mode === 'server-first') {
      return this.applyServerFirst(event);
    }

    return this.applyMobileFirst(event);
  }

  private async buildEntry(event: IdbqlEventPayload): Promise<OutboxEntry | null> {
    // Enforce maxQueueSize
    if (this.maxQueueSize != null) {
      const currentSize = await (this.outbox as any).size?.() ?? (await this.outbox.list(10000)).length;
      if (currentSize >= this.maxQueueSize) {
        if (this.queueFullStrategy === 'drop-oldest') {
          const oldest = await this.outbox.list(1);
          if (oldest[0]) {
            await this.outbox.remove(oldest[0].id);
            this.log(`[idae-sync] queue full — dropped oldest ${oldest[0].collection}#${oldest[0].id}`);
          }
        } else {
          this.log(`[idae-sync] queue full (${this.maxQueueSize}) — rejected ${event.collection}`);
          return null;
        }
      }
    }

    const now = new Date().toISOString();
    let entry: OutboxEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collection: event.collection,
      op: event.op,
      key: event.key,
      data: event.data,
      whereClause: event.whereClause,
      meta: { retryCount: 0, createdAt: now, priority: (event as any).priority ?? 0 },
    };

    if (entry.data) ensureUpdatedAt(entry.data);

    if (this.hooks?.onEnqueue) {
      entry = await this.hooks.onEnqueue(entry);
    }

    return entry;
  }

  private async applyMobileFirst(event: IdbqlEventPayload): Promise<void> {
    const now = new Date().toISOString();
    const entry = await this.buildEntry(event);
    if (!entry) return;

    // Compaction: merge with existing pending entry for same (collection, key)
    if (this.compact && event.key != null) {
      const existing = await (this.outbox as any).findPending?.(event.collection, event.key) as OutboxEntry | undefined;
      if (existing) {
        this.log(`[idae-sync] compact ${event.collection}#${String(event.key)}`);
        await this.outbox.update({ ...existing, data: event.data, op: event.op });
        return;
      }
    }

    await this.outbox.enqueue(entry);
    this.log(`[idae-sync] enqueue ${entry.collection}#${entry.id} (mobile-first)`);

    if (!this.deliverer) return;

    let deliverEntry = entry;
    if (this.hooks?.onBeforeDeliver) deliverEntry = await this.hooks.onBeforeDeliver(entry);

    try {
      const result = await this.deliverer.deliver(deliverEntry);

      if (this.hooks?.onAfterDeliver) await this.hooks.onAfterDeliver(entry, result);

      if (result.status === 'success') {
        this.circuitBreaker?.recordSuccess(entry.collection);
        await this.outbox.remove(entry.id);
        this.log(`[idae-sync] deliver ${entry.collection}#${entry.id} → success`);
        this.emitSyncEvent({ type: 'delivered', collection: entry.collection, entryId: entry.id });
      } else if (result.status === 'retry') {
        this.circuitBreaker?.recordFailure(entry.collection);
        entry.meta.retryCount = 1;
        entry.meta.lastAttempt = now;
        await this.checkMaxRetries(entry);
      } else if (result.status === 'permanent') {
        entry.meta.lastAttempt = now;
        entry.meta.failed = true;
        entry.meta.failureReason = result.response;
        await this.outbox.update(entry);
      }
    } catch (e) {
      this.circuitBreaker?.recordFailure(entry.collection);
      entry.meta.retryCount = 1;
      entry.meta.lastAttempt = now;
      await this.checkMaxRetries(entry);
    }
  }

  private async applyServerFirst(event: IdbqlEventPayload): Promise<void> {
    const now = new Date().toISOString();
    const entry = await this.buildEntry(event);
    if (!entry) return;

    await this.outbox.enqueue(entry);
    this.log(`[idae-sync] enqueue ${entry.collection}#${entry.id} (server-first)`);

    if (this.serverFirstHandler) {
      await this.serverFirstHandler.handle(entry);
    } else if (this.deliverer) {
      let deliverEntry = entry;
      if (this.hooks?.onBeforeDeliver) deliverEntry = await this.hooks.onBeforeDeliver(entry);
      try {
        const result = await this.deliverer.deliver(deliverEntry);
        if (this.hooks?.onAfterDeliver) await this.hooks.onAfterDeliver(entry, result);
        if (result.status === 'success') {
          await this.outbox.remove(entry.id);
          this.emitSyncEvent({ type: 'delivered', collection: entry.collection, entryId: entry.id });
        } else if (result.status === 'permanent') {
          await this.outbox.remove(entry.id);
          this.emitSyncEvent({ type: 'rollback', collection: entry.collection, entryId: entry.id, reason: result.response });
        } else {
          entry.meta.retryCount = 1;
          entry.meta.lastAttempt = now;
          await this.checkMaxRetries(entry);
          this.emitSyncEvent({ type: 'fallback', collection: entry.collection, entryId: entry.id, reason: 'transient', fallbackMode: 'mobile-first' });
        }
      } catch (e) {
        entry.meta.retryCount = 1;
        entry.meta.lastAttempt = now;
        await this.checkMaxRetries(entry);
        this.emitSyncEvent({ type: 'fallback', collection: entry.collection, entryId: entry.id, reason: e, fallbackMode: 'mobile-first' });
      }
    }
  }

  private async checkMaxRetries(entry: OutboxEntry): Promise<void> {
    if (entry.meta.retryCount >= this.maxRetries) {
      this.log(`[idae-sync] dead-letter ${entry.collection}#${entry.id} (retries=${entry.meta.retryCount})`);
      await (this.outbox as any).moveToDlq?.(entry.id, 'max-retries');
      this.emitSyncEvent({ type: 'dead-letter', collection: entry.collection, entryId: entry.id, reason: 'max-retries' });
    } else {
      await this.outbox.update(entry);
    }
  }

  async processPending(): Promise<void> {
    if (!this.deliverer) return;
    try {
      const entries = await this.outbox.list(this.batchSize);
      if (!entries?.length) return;

      await Promise.allSettled(entries.map(e => this.deliverOne(e)));
    } catch (e) {
      // ignore errors in background processing
    }
  }

  private async deliverOne(entry: OutboxEntry): Promise<void> {
    if (!this.deliverer) return;

    // Circuit breaker: skip if collection is open
    if (this.circuitBreaker?.isOpen(entry.collection)) {
      this.log(`[idae-sync] circuit open — skipped ${entry.collection}#${entry.id}`);
      return;
    }

    let deliverEntry = entry;
    if (this.hooks?.onBeforeDeliver) deliverEntry = await this.hooks.onBeforeDeliver(entry);

    try {
      const result = await this.deliverer.deliver(deliverEntry);

      if (this.hooks?.onAfterDeliver) await this.hooks.onAfterDeliver(entry, result);

      if (result.status === 'success') {
        this.circuitBreaker?.recordSuccess(entry.collection);
        await this.outbox.remove(entry.id);
        this.log(`[idae-sync] deliver ${entry.collection}#${entry.id} → success`);
      } else if (result.status === 'retry') {
        this.circuitBreaker?.recordFailure(entry.collection);
        entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
        entry.meta.lastAttempt = new Date().toISOString();
        await this.checkMaxRetries(entry);
      } else if (result.status === 'permanent') {
        entry.meta.lastAttempt = new Date().toISOString();
        entry.meta.failed = true;
        entry.meta.failureReason = result.response;
        await this.outbox.update(entry);
      }
    } catch (e) {
      this.circuitBreaker?.recordFailure(entry.collection);
      entry.meta.retryCount = (entry.meta.retryCount || 0) + 1;
      entry.meta.lastAttempt = new Date().toISOString();
      await this.checkMaxRetries(entry);
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
  opts?: SyncAdapterOptions
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
  opts?: SyncAdapterOptions
): SyncAdapter {
  const modeConfig = opts?.mode || opts?.collectionModes
    ? { mode: opts?.mode, collectionModes: opts?.collectionModes }
    : undefined;

  if (typeof outboxOrOpts === 'object' && 'outbox' in outboxOrOpts && 'serializer' in outboxOrOpts) {
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
      opts?.onConflict,
      modeConfig,
      opts ?? {}
    );
  }
  return new SyncAdapter(
    outboxOrOpts as OutboxStore,
    deliverer,
    opts?.intervalMs ?? 5000,
    opts?.onConflict,
    modeConfig,
    opts ?? {}
  );
}
