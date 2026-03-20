# @medyll/idae-sync

Sync your local IndexedDB data to a server — automatically, in the background, even offline.

If you use `@medyll/idae-idbql`, adding sync takes **one line of code**. Your users never wait for the network. Everything else (retries, conflicts, offline recovery) is handled for you.

---

## Install

```bash
pnpm add @medyll/idae-sync
```

---

## Basic Usage (with idae-idbql)

```ts
import { createIdbqlState } from '@medyll/idae-idbql';
import { initSync } from '@medyll/idae-sync';

// Your usual idae-idbql setup
const idbql = createIdbqlState(dbConfig);

// Add sync — that's it
const sync = initSync({
  dbName: 'my-app',
  delivererConfig: { baseUrl: 'https://api.example.com' },
});

// Use idae-idbql exactly as before — nothing changes
await idbql.users.insert({ name: 'Alice' });
// → idae-sync silently queues and sends POST /users to your API

await idbql.users.update({ id: 1 }, { name: 'Bob' });
// → idae-sync silently sends PUT /users/1

// When you're done (e.g. app unmount)
sync.stop();
```

That's the whole integration. Every `.insert()`, `.update()`, `.delete()` is automatically intercepted and delivered to your API — with retries if the network is unavailable.

---

## How It Works

```
User writes data via idae-idbql
    |
    v
idae-sync intercepts → queues in outbox (IndexedDB)
    |
    v
Background delivery (with circuit breaker check)
    |
    ├─ Success        → entry removed
    ├─ Network error  → retry with exponential backoff
    ├─ Max retries    → moved to Dead Letter Queue
    └─ 4xx error      → permanent failure → Dead Letter Queue
```

The outbox persists in IndexedDB — writes are never lost, even if the page reloads or the user goes offline.

---

## Common Options

```ts
const sync = initSync({
  dbName: 'my-app',                        // IndexedDB database name
  delivererConfig: { baseUrl: '...' },     // your API base URL
  intervalMs: 5000,                        // how often to flush (ms), default: 5000
  mode: 'mobile-first',                    // sync strategy, default: 'mobile-first'
  debug: true,                             // log sync activity to console
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dbName` | `string` | `'idae-db'` | IndexedDB database name |
| `delivererConfig` | `Record<string, unknown>` | — | Config for `IdaeApiClient` (needs `baseUrl`) |
| `intervalMs` | `number` | `5000` | Polling interval (ms) |
| `mode` | `SyncMode` | `'mobile-first'` | Global sync mode |
| `collectionModes` | `Record<string, SyncMode>` | — | Per-collection overrides |
| `persist` | `'none'\|'localStorage'\|'sessionStorage'` | `'none'` | Mode persistence |
| `maxRetries` | `number` | — | Max retries before DLQ |
| `batchSize` | `number` | `1` | Entries per delivery tick |
| `maxQueueSize` | `number` | — | Max outbox entries |
| `onQueueFull` | `'reject'\|'drop-oldest'` | `'reject'` | Queue overflow strategy |
| `compaction` | `boolean` | `false` | Merge redundant entries |
| `networkAware` | `boolean` | `true` | Pause when offline |
| `circuitBreaker` | `{ failureThreshold?, resetTimeoutMs? }` | — | Circuit breaker config |
| `hooks` | `SyncHooks` | — | Pipeline hooks |
| `debug` | `boolean\|DebugFn` | `false` | Debug logging |

Returns `{ stop(), flush(), getStatus(), outbox, syncAdapter, deliverer, dlq }`.

---

## Sync Modes

Choose how each collection behaves when the user writes data:

| Mode | Behavior |
|------|----------|
| `mobile-first` | Write locally first, sync in background (default) |
| `server-first` | Write locally optimistically, rollback if server rejects |

Modes are hierarchical: global default → per-collection override.

```ts
const sync = initSync({
  mode: 'mobile-first',           // global default
  collectionModes: {
    orders: 'server-first',       // orders need server confirmation
    drafts: 'mobile-first',       // drafts stay local-first
  },
});
```

### Mode Persistence

```ts
const sync = initSync({
  mode: 'mobile-first',
  persist: 'localStorage',        // 'none' | 'localStorage' | 'sessionStorage'
  persistKey: 'my-app-sync-mode', // optional custom storage key
});
```

Use `SyncModeManager` directly for runtime mode switching:

```ts
import { SyncModeManager } from '@medyll/idae-sync';

const mgr = new SyncModeManager({ mode: 'mobile-first', persist: 'localStorage' });
mgr.setGlobal('server-first');
mgr.setCollection('drafts', 'mobile-first');
mgr.getGlobal();             // 'server-first'
mgr.getCollection('drafts'); // 'mobile-first'
mgr.clearPersisted();        // remove from storage
```

---

## Network Awareness

Delivery automatically pauses when the browser goes offline and resumes when online.

```ts
const sync = initSync({
  networkAware: true,   // default: true in browser environments
});

// Listen to sync events
const unsubscribe = sync.syncAdapter.onSyncEvent((event) => {
  switch (event.type) {
    case 'network-offline': console.log('Paused — offline'); break;
    case 'network-online':  console.log('Resumed — online'); break;
    case 'delivered':       console.log('Delivered', event.entryId); break;
    case 'fallback':        console.log('Fell back to mobile-first', event.collection); break;
    case 'rollback':        console.log('Rolled back', event.entryId); break;
    case 'dead-letter':     console.log('Moved to DLQ', event.entryId); break;
  }
});

unsubscribe(); // stop listening
```

---

## Flush & Status

```ts
// Deliver all pending entries immediately (bypasses interval)
await sync.syncAdapter.flush();

// Devtools snapshot
const status = await sync.syncAdapter.getStatus();
console.log(status);
// {
//   running: true,
//   networkPaused: false,
//   queueLength: 3,
//   dlqLength: 1,
//   mode: 'mobile-first',
//   circuitBreaker: { orders: { state: 'open', failures: 3 } }
// }
```

---

## Dead Letter Queue

Entries that exceed `maxRetries` or get a permanent server error (4xx) are moved to the DLQ instead of being silently dropped.

```ts
const sync = initSync({
  maxRetries: 5,
});

const failed = await sync.dlq.list();
await sync.dlq.replay('entry-id'); // move back to outbox and retry
await sync.dlq.clear();
```

---

## Hooks

Intercept every stage of the delivery pipeline:

```ts
const sync = initSync({
  hooks: {
    onEnqueue: async (entry) => {
      // Mutate entry before it enters the outbox
      return { ...entry, meta: { ...entry.meta, priority: getPriority(entry) } };
    },
    onBeforeDeliver: async (entry) => {
      // Add auth headers, transform data, etc.
      return entry;
    },
    onAfterDeliver: async (entry, result) => {
      console.log('Delivered', entry.id, result.status);
    },
  },
});
```

---

## Circuit Breaker

Per-collection circuit breakers prevent repeated failed delivery attempts from flooding your API.

States: `closed` (normal) → `open` (blocking) → `half-open` (probing).

```ts
const sync = initSync({
  circuitBreaker: {
    failureThreshold: 3,    // failures before opening
    resetTimeoutMs: 30000,  // ms before trying again (half-open)
  },
});

const status = await sync.syncAdapter.getStatus();
console.log(status.circuitBreaker);
// { orders: { state: 'open', failures: 3, openUntil: '...' } }
```

---

## Batch Delivery

Group multiple entries into a single API call:

```ts
const sync = initSync({
  batchSize: 10,    // deliver up to 10 entries per tick
});
```

---

## Queue Size Limit

Prevent unbounded outbox growth:

```ts
const sync = initSync({
  maxQueueSize: 100,
  onQueueFull: 'reject',      // 'reject' | 'drop-oldest'
});
```

---

## Outbox Compaction

Merge redundant entries for the same key to reduce delivery volume:

```ts
const sync = initSync({
  compaction: true,
});
```

When compaction is enabled, multiple `update` ops for the same key are merged into a single entry before delivery.

---

## Priority Queue

Higher-priority entries are delivered first:

```ts
import { OutboxStore } from '@medyll/idae-sync';

await outbox.enqueue({
  id: 'e1',
  collection: 'orders',
  op: 'add',
  data: { ... },
  meta: { retryCount: 0, createdAt: new Date().toISOString(), priority: 10 },
});
```

---

## Server Push

React to server-initiated updates in real time:

```ts
import { EventSourcePushListener, WebSocketPushListener } from '@medyll/idae-sync';

// SSE
const sse = new EventSourcePushListener('https://api.example.com/push', (payload) => {
  // apply remote doc to local store
});
sse.connect();

// WebSocket
const ws = new WebSocketPushListener('wss://api.example.com/ws', (payload) => {
  // apply remote doc
});
ws.connect();
```

---

## Conflict Resolution

```ts
import { defaultOnConflict, mergeObjects, mergeFieldLevel, ConflictResolver } from '@medyll/idae-sync';

// Last-write-wins (uses updated_at timestamps)
defaultOnConflict(localDoc, remoteDoc);
// => { resolution: 'remote', result: remoteDoc }

// Shallow merge
mergeObjects(localDoc, remoteDoc);
// => { resolution: 'merge', result: { ...local, ...remote } }

// Field-level merge (per-field timestamps)
mergeFieldLevel(localDoc, remoteDoc);

// Class wrapper
const resolver = new ConflictResolver();
resolver.resolve(local, remote, { collection: 'books', op: 'update' });
```

---

## Observability

```ts
import { incCounter, getCounter, resetCounters } from '@medyll/idae-sync';

incCounter('deliveries.success');
getCounter('deliveries.success'); // 1
resetCounters();
```

`OutboxStore.subscribe()` provides real-time metrics:

```ts
outbox.subscribe((metrics) => {
  console.log(metrics.queueLength);       // pending entries
  console.log(metrics.oldestEntryAgeMs);  // staleness
  console.log(metrics.maxRetry);          // highest retry count
  console.log(metrics.retryHistogram);    // { "0": 5, "1": 2 }
});
```

---

## API Reference

### Classes

#### `OutboxStore`

IndexedDB-backed persistent outbox.

```ts
const outbox = new OutboxStore('my-db');
await outbox.enqueue(entry);
await outbox.remove(entry.id);
await outbox.update(entry);
const pending = await outbox.list(10);
const count = await outbox.size();
const found = await outbox.findPending('collection', 'key');
await outbox.moveToDlq('entry-id', 'reason');
const dlq = await outbox.listDlq();
await outbox.replayDlq('entry-id');
await outbox.clearDlq();
const unsub = outbox.subscribe((m) => console.log(m.queueLength));
```

#### `InMemoryOutboxStore`

In-memory implementation for testing. Same API as `OutboxStore`.

#### `SyncAdapter`

Bridges `idae-idbql` events to the outbox. Supports background polling and all sync features.

```ts
const adapter = createSyncAdapter(outbox, deliverer, opts);
adapter.start();
await adapter.applyEvent({ collection: 'books', op: 'add', data: { title: 'Foo' } });
await adapter.flush();
const status = await adapter.getStatus();
const unsub = adapter.onSyncEvent((e) => console.log(e));
adapter.stop();
```

#### `CircuitBreaker`

```ts
import { CircuitBreaker } from '@medyll/idae-sync';

const cb = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 30000 });
cb.isOpen('orders');         // false
cb.recordFailure('orders');
cb.getState('orders');       // 'closed' | 'open' | 'half-open'
cb.getStatus();              // { orders: { state, failures, openUntil? } }
cb.reset('orders');
```

#### `SyncModeManager`

```ts
import { SyncModeManager } from '@medyll/idae-sync';

const mgr = new SyncModeManager({ mode: 'mobile-first', persist: 'localStorage' });
mgr.setGlobal('server-first');
mgr.setCollection('drafts', 'mobile-first');
mgr.resolve('drafts');   // 'mobile-first'
mgr.resolve('orders');   // 'server-first' (falls back to global)
mgr.clearPersisted();
```

#### `IdaeApiDeliverer`

Delivers outbox entries to `@medyll/idae-api`:

| Op | API Call |
|----|----------|
| `add` | `collection.create(data)` |
| `put` / `update` | `collection.update(id, data)` |
| `delete` | `collection.deleteById(id)` |
| `updateWhere` | `collection.updateWhere(where, data)` |
| `deleteWhere` | `collection.deleteWhere(where)` |

Returns `{ status: 'permanent' }` for 4xx errors, `{ status: 'retry' }` for transient failures.

---

### Types

#### `OutboxEntry`

```ts
type OutboxEntry = {
  id: string;
  collection: string;
  op: 'add' | 'put' | 'update' | 'delete' | 'updateWhere' | 'deleteWhere';
  key?: unknown;
  data?: unknown;
  whereClause?: unknown;
  meta: {
    retryCount: number;
    createdAt: string;
    priority?: number;
    lastAttempt?: string;
    nextAttempt?: string;
    failed?: boolean;
    failureReason?: unknown;
  };
};
```

#### `DeliverResult`

```ts
type DeliverResult = {
  status: 'success' | 'retry' | 'permanent';
  response?: unknown;
  conflict?: { local: unknown; remote: unknown };
};
```

#### `SyncMode`

```ts
type SyncMode = 'mobile-first' | 'server-first';
```

#### `SyncEvent`

```ts
type SyncEvent = {
  type: 'delivered' | 'fallback' | 'rejected' | 'rollback' | 'dead-letter' | 'network-online' | 'network-offline';
  collection?: string;
  entryId?: string;
  reason?: unknown;
  fallbackMode?: SyncMode;
};
```

#### `SyncHooks`

```ts
type SyncHooks = {
  onBeforeDeliver?: (entry: OutboxEntry) => Promise<OutboxEntry> | OutboxEntry;
  onAfterDeliver?: (entry: OutboxEntry, result: DeliverResult) => Promise<void> | void;
  onEnqueue?: (entry: OutboxEntry) => Promise<OutboxEntry> | OutboxEntry;
};
```

---

## Testing

```bash
pnpm test
```

| Suite | Coverage |
|-------|----------|
| `outboxstore.spec.ts` | InMemoryOutboxStore CRUD |
| `syncAdapter.spec.ts` | Event handling + background polling |
| `deliverer.spec.ts` | OutboxDeliverer success/retry/permanent |
| `conflict-resolver.spec.ts` | LWW + merge strategies |
| `where-serializer.spec.ts` | Deterministic serialization |
| `sync-modes.spec.ts` | Mode hierarchy + collection overrides |
| `server-first.spec.ts` | Optimistic write + rollback |
| `fallback.spec.ts` | Automatic fallback to mobile-first |
| `dlq.spec.ts` | Dead letter queue operations |
| `network-awareness.spec.ts` | Pause/resume on offline/online |
| `compaction.spec.ts` | Outbox entry merging |
| `batch.spec.ts` | Batch delivery |
| `hooks.spec.ts` | Pipeline hooks |
| `circuit-breaker.spec.ts` | Per-collection circuit breaker |
| `flush-queuelimit.spec.ts` | Flush + maxQueueSize |
| `field-merge.spec.ts` | Field-level conflict resolution |
| `mode-persistence.spec.ts` | SyncModeManager localStorage/sessionStorage |
| `getStatus.spec.ts` | Devtools status snapshot |
| `outbox-idb.spec.ts` | Real IndexedDB e2e tests |
| `outbox-deliverer.e2e.spec.ts` | End-to-end: enqueue → deliver → ack |

Run the throughput benchmark:

```bash
npx tsx test/benchmark.ts
```

---

## Project Structure

```
src/
  index.ts                          # Public barrel
  lib/
    outbox/
      OutboxStore.ts                # IDB-backed outbox + DLQ
      InMemoryOutboxStore.ts        # In-memory impl for tests
    deliverer/
      IDeliverer.ts                 # Unified deliverer interface
      IdaeApiDeliverer.ts           # REST API deliverer
    SyncAdapter.ts                  # Event adapter + background poller
    SyncMode.ts                     # SyncMode types
    SyncModeManager.ts              # Hierarchical mode resolution + persistence
    CircuitBreaker.ts               # Per-collection circuit breaker
    ServerPush.ts                   # SSE + WebSocket push listeners
    RollbackManager.ts              # Snapshot/rollback for server-first
    ServerFirstHandler.ts           # Optimistic write + rollback logic
    SyncHooks.ts                    # Hook types
    Deliverer.ts                    # OutboxDeliverer (backoff engine)
    ConflictResolver.ts             # LWW + merge + field-level strategies
    WhereSerializer.ts              # Deterministic where serialization
    ensureUpdatedAt.ts              # Timestamp helper
    initSync.ts                     # One-line setup
    observability/
      metrics.ts                    # In-memory counters
test/
  *.spec.ts                         # Unit + integration tests
  benchmark.ts                      # Throughput benchmark
```

---

## Dependencies

| Package | Role |
|---------|------|
| `@medyll/idae-idbql` | IndexedDB query layer + event bus |
| `@medyll/idae-api` | REST API client (used by `IdaeApiDeliverer`) |

## License

ISC - Lebrun Meddy
