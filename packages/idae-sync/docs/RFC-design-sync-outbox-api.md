# RFC: Design public Outbox API

Purpose
-------
Concise design for the public surface of the Outbox-backed Sync system used by idae-sync. This RFC specifies types and interfaces implementers should depend on when wiring an OutboxStore, SyncAdapter, WhereSerializer, Deliverer, and onConflict hooks. It aligns with ARCHITECTURE.md decisions (write-through local-first, LWW default, same-DB Outbox) and the project PRD.

References
----------
- ARCHITECTURE: ../ARCHITECTURE.md
- PRD: ../PRD.md

Public type sketches
--------------------
These are surface sketches (TypeScript-like) intended for implementers. They are intentionally minimal and may evolve.

// Outbox entry persisted in the same DB
interface OutboxEntry<T = any> {
  id: string;                // uuid
  collection: string;
  op: 'add' | 'put' | 'update' | 'delete' | 'updateWhere' | 'deleteWhere';
  key?: string | number | object;
  data?: T | null;           // payload for add/put/update
  whereClause?: any;         // serialized Where<T> for clause ops
  meta: {
    retryCount: number;
    lastAttempt?: string;    // ISO timestamp
    createdAt: string;       // ISO timestamp
    failed?: boolean;
    lastError?: string | null;
  };
}

// Outbox persistence abstraction
interface OutboxStore {
  append(entry: OutboxEntry): Promise<void>;
  peek(limit?: number): Promise<OutboxEntry[]>;          // read-next N entries without removing
  poll(limit?: number): Promise<OutboxEntry[]>;          // claim/pop up to N entries for delivery attempts
  ack(id: string): Promise<void>;                       // remove on success
  markFailed(id: string, reason?: string): Promise<void>;
  update(entry: OutboxEntry): Promise<void>;            // update metadata (retryCount, lastAttempt)
  clear(): Promise<void>;
  // Optional transactional helper: supply a tx to perform data write + outbox append atomically
  transactionalWrite?(tx: any, writeFn: (tx: any) => Promise<void>): Promise<void>;
}

// SyncAdapter: wires into idae-idbql adapter hooks
interface SyncAdapterOptions {
  deliverer?: Deliverer;                 // runtime-provided delivery function
  whereSerializer?: WhereSerializer;     // serializer for Where clauses
  onConflict?: OnConflictHook;
  config?: SyncConfig;
}

interface SyncAdapter {
  init(): Promise<void>;
  handleEvent(event: any): Promise<void>; // called from idae-idbql adapter registry for local events
  flush(): Promise<void>;                 // attempt immediate delivery of queued entries
  shutdown(): Promise<void>;
}

// Deliverer: responsible for mapping OutboxEntry -> remote request
type DeliverResult = { ok: true; response?: any } | { ok: false; transient?: boolean; status?: number; error?: string };
interface Deliverer {
  deliver(entry: OutboxEntry): Promise<DeliverResult>;
}

// WhereSerializer: stable serialize/deserialize for Where<T> used in updateWhere/deleteWhere
interface WhereSerializer {
  serialize(where: any): string;       // returns deterministic string
  deserialize(serial: string): any;
}

// onConflict hook
type ConflictResolution = 'local' | 'remote' | 'merge';
type OnConflictHook = (local: any, remote: any, context: { collection: string; op: string; entry: OutboxEntry }) =>
  | { resolution: ConflicResolution }
  | { resolution: 'merge'; result: any };

// Config options
interface SyncConfig {
  maxRetries?: number;       // default: 5
  backoffBaseMs?: number;    // base backoff (exponential) default: 500
  concurrency?: number;      // concurrent delivery workers default: 2
  dbName?: string;           // name of DB where Outbox lives (default: same DB)
  retryJitter?: number;      // jitter factor (0..1)
}

Behavior notes
--------------
- Adapter integration: SyncAdapter listens to idae-idbql events. For events where event.source === 'local' && event.silent !== true, the adapter creates an OutboxEntry and attempts immediate delivery via configured deliverer.
- Atomicity: callers that can supply an IDB transaction should use transactionalWrite to write data and append OutboxEntry in the same tx to avoid loss of intent (see ARCHITECTURE.md).
- Conflict handling: on deliverer/server 409 or newer updated_at, SyncAdapter invokes onConflict(local, remote, context) and acts per resolution. Default LWW behavior (accept remote if remote.updated_at > local.updated_at) should be the fallback.

Testing checklist
-----------------
Unit tests
- OutboxEntry round-trip serialization (including whereClause)
- OutboxStore: append/poll/ack/update semantics (in-memory implementation)
- WhereSerializer deterministic output for common Where shapes
- Deliverer: simulate OK, transient errors, permanent errors and ensure DeliverResult contract
- onConflict: default LWW resolution and a custom merge hook test

Integration tests
- Local write -> Outbox entry appended and immediately delivered (happy path). Verify local application of remote response with { source: 'remote', silent: true }.
- Transient network failure: entry persists, retryCount increments, exponential backoff scheduling honored.
- Permanent server failure (4xx): entry marked failed, onConflict invoked where relevant, telemetry surfaced.
- Transactional write: when transaction provided, data write + outbox append succeed or rollback together.
- Where-based ops: updateWhere/deleteWhere serialized, delivered, and reflected correctly on server mock.

Operational considerations
------------------------
- Metrics: counters for queued, delivered, failed, retryCount distributions.
- Service Worker background sync: planned follow-up for cross-tab/background reliability (see ARCHITECTURE.md).
- Migration: updated_at injection for records missing the field; document compatibility behavior.

Rollout notes
-------------
- Initial release can ship the interfaces and an in-memory OutboxStore + scaffolding SyncAdapter. Deliverer implementation and SW integration can follow.

Open questions
--------------
- Exact typed shape of Where<T> used across idae-idbql must be stabilized before a canonical WhereSerializer implementation.
- How to expose durable OutboxStore bindings for server-backed persistence (SQL) vs IndexedDB.

Document history
----------------
- Drafted by Copilot CLI (bmad-next-auto)
