# @medyll/idae-sync

Build mobile-first apps that work offline and sync seamlessly when connectivity returns. Your users interact with local data instantly — `idae-sync` handles queuing, retrying, and conflict resolution in the background.

## Why idae-sync?

- **Offline-first**: Users never wait for the network. Writes go to a local outbox and sync later.
- **Automatic retries**: Transient network failures are retried with exponential backoff. No data is lost.
- **Conflict resolution**: When local and remote data diverge, built-in strategies (last-write-wins, merge) resolve conflicts automatically — or plug in your own.
- **Observable**: Monitor queue depth, retry counts, and staleness in real time.
- **One-line setup**: Call `initSync()` and you're done.

## Install

```bash
pnpm add @medyll/idae-sync
```

## Quick Start

```ts
import { initSync } from '@medyll/idae-sync';

// Start syncing — that's it
const sync = initSync({
  dbName: 'my-app',
  delivererConfig: { baseUrl: 'https://api.example.com' },
});

// Your app writes data locally via idae-idbql as usual.
// idae-sync picks up every local write, queues it, and delivers it
// to your API automatically. If the network is down, it retries.

// When you're done (e.g. user logs out)
sync.stop();
```

---

## How It Works

When your app writes data locally (via `@medyll/idae-idbql`), `idae-sync` intercepts the write and queues it in a persistent outbox stored in IndexedDB. A background process picks up queued entries and delivers them to your API. If delivery fails, the entry stays in the outbox and is retried automatically.

```
User writes data locally
    |
    v
idae-sync intercepts and queues in outbox
    |
    v
Background delivery attempts
    |
    ├─ Success  ──>  entry removed, done
    ├─ Network error ──>  retry later (exponential backoff)
    └─ Server rejects (4xx) ──> marked as failed
```

This means your app always feels fast — the user never waits for the server.

### Architecture

```
Local Write
    |
    v
SyncAdapter.applyEvent()
    |
    v
OutboxStore.enqueue()  ──>  IDB __outbox__
    |
    v
IDeliverer.deliver()
    |
    ├─ success  ──>  remove from outbox
    ├─ retry    ──>  increment retryCount, schedule next attempt
    └─ permanent ──> mark failed + failureReason
```

---

## API Reference

### Entry Point

#### `initSync(opts?: InitSyncOptions)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dbName` | `string` | `'idae-db'` | IndexedDB database name |
| `dbVersion` | `number` | `undefined` | IDB version |
| `delivererConfig` | `Record<string, unknown>` | `undefined` | Config passed to `IdaeApiClient` |
| `intervalMs` | `number` | `5000` | Background polling interval (ms) |

Returns `{ stop(), outbox, syncAdapter, deliverer }`.

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

#### `IDeliverer`

```ts
interface IDeliverer {
  deliver(entry: OutboxEntry): Promise<DeliverResult>;
}
```

#### `IdbqlEventPayload`

```ts
type IdbqlEventPayload = {
  collection: string;
  op: OutboxEntry['op'];
  data?: unknown;
  key?: unknown;
  whereClause?: unknown;
  silent?: boolean;
  source?: 'local' | 'remote' | 'system';
};
```

---

### Classes

#### `OutboxStore`

IndexedDB-backed persistent outbox. Creates a `__outbox__` object store automatically.

```ts
const outbox = new OutboxStore('my-db');
await outbox.enqueue(entry);
const pending = await outbox.list(10);
await outbox.remove(entry.id);
await outbox.update(entry);
const metrics = await outbox.getMetrics();
const unsub = outbox.subscribe((m) => console.log(m.queueLength));
```

#### `InMemoryOutboxStore`

In-memory implementation for testing. Same API as `OutboxStore`.

#### `SyncAdapter`

Bridges `idae-idbql` events to the outbox. Supports background polling.

```ts
const adapter = createSyncAdapter(outbox, deliverer, {
  intervalMs: 3000,
  onConflict: defaultOnConflict,
});
adapter.start();

// Process a local event
await adapter.applyEvent({ collection: 'books', op: 'add', data: { title: 'Foo' } });

adapter.stop();
```

#### `OutboxDeliverer`

Standalone deliverer that processes outbox entries one at a time with backoff.

```ts
const deliverer = new OutboxDeliverer(outbox, { backoffBaseMs: 500 });
await deliverer.processOnce({
  deliver: async (entry) => ({ status: 'success', response: { id: 'srv-1' } }),
  applyRemote: (response) => console.log('Applied:', response),
});
```

#### `IdaeApiDeliverer`

Delivers outbox entries to `@medyll/idae-api`. Maps entry ops to REST calls:

| Op | API Call |
|----|----------|
| `add` | `collection.create(data)` |
| `put` / `update` | `collection.update(id, data)` |
| `delete` | `collection.deleteById(id)` |
| `updateWhere` | `collection.updateWhere(where, data)` |
| `deleteWhere` | `collection.deleteWhere(where)` |

Returns `{ status: 'permanent' }` for 4xx errors, `{ status: 'retry' }` for transient failures.

---

### Conflict Resolution

```ts
import { defaultOnConflict, mergeObjects, ConflictResolver } from '@medyll/idae-sync';

// Last-write-wins (uses updated_at timestamps)
const result = defaultOnConflict(localDoc, remoteDoc);
// => { resolution: 'remote', result: remoteDoc }

// Shallow merge
const merged = mergeObjects(localDoc, remoteDoc);
// => { resolution: 'merge', result: { ...local, ...remote } }

// Class wrapper (uses defaultOnConflict internally)
const resolver = new ConflictResolver();
resolver.resolve(local, remote, { collection: 'books', op: 'update' });
```

---

### Helpers

| Export | Description |
|--------|-------------|
| `ensureUpdatedAt(obj)` | Sets `updated_at` to now if missing |
| `serializeWhere(where)` | Deterministic JSON serialization for where clauses |
| `deserializeWhere(s)` | Parse serialized where clause |
| `isDeterministic(a, b)` | Check if two where clauses serialize identically |
| `WhereSerializer` | Class wrapper around serialize/deserialize |

---

### Observability

```ts
import { incCounter, getCounter, resetCounters } from '@medyll/idae-sync';

incCounter('deliveries.success');
console.log(getCounter('deliveries.success')); // 1
resetCounters();
```

`OutboxStore.subscribe()` provides real-time metrics:

```ts
outbox.subscribe((metrics) => {
  console.log(metrics.queueLength);      // pending entries
  console.log(metrics.oldestEntryAgeMs); // staleness
  console.log(metrics.maxRetry);         // highest retry count
  console.log(metrics.retryHistogram);   // { "0": 5, "1": 2, "3": 1 }
});
```

---

## Testing

```bash
pnpm test
```

| Suite | Coverage |
|-------|----------|
| `conflict-resolver.spec.ts` | LWW + merge strategies |
| `deliverer.spec.ts` | OutboxDeliverer success/retry/permanent |
| `metrics.spec.ts` | Counter inc/get/reset |
| `outbox.spec.ts` | IDB-backed OutboxStore CRUD + metrics |
| `outbox-transactions.spec.ts` | Transactional append/commit/rollback |
| `outboxstore.spec.ts` | InMemoryOutboxStore operations |
| `syncAdapter.spec.ts` | Event handling + background processing |
| `updated-at.spec.ts` | ensureUpdatedAt propagation |
| `where-serializer.spec.ts` | Deterministic serialization |
| `outbox-deliverer.e2e.spec.ts` | End-to-end: enqueue -> deliver -> ack |

---

## Project Structure

```
src/
  index.ts                          # Public barrel
  lib/
    outbox/
      OutboxStore.ts                # IDB-backed outbox (types + class)
      InMemoryOutboxStore.ts        # In-memory impl for tests
    deliverer/
      IDeliverer.ts                 # Unified deliverer interface
      IdaeApiDeliverer.ts           # REST API deliverer
      index.ts                      # Re-exports
    SyncAdapter.ts                  # Event adapter + background poller
    Deliverer.ts                    # OutboxDeliverer (backoff engine)
    ConflictResolver.ts             # LWW + merge strategies
    WhereSerializer.ts              # Deterministic where serialization
    ensureUpdatedAt.ts              # Timestamp helper
    initSync.ts                     # One-line setup
    observability/
      metrics.ts                    # Simple in-memory counters
test/
  *.spec.ts                         # Unit tests
  integration/
    outbox-deliverer.e2e.spec.ts    # End-to-end test
```

---

## Dependencies

| Package | Role |
|---------|------|
| `@medyll/idae-idbql` | IndexedDB query layer + event bus |
| `@medyll/idae-api` | REST API client (used by `IdaeApiDeliverer`) |

## License

ISC - Lebrun Meddy
