# idae-sync

idae-sync provides an offline-first synchronization layer for the Idae monorepo. It implements a local Outbox pattern on top of idae-idbql (IndexedDB) and a pluggable delivery pipeline to reliably deliver local write intents to a remote API (idae-api).

This README is a complete reference for developers: architecture summary, runtime integration, API examples, migration steps, testing guidance and troubleshooting.

---

## Quickstart

1. Read the full design decisions in `ARCHITECTURE.md`.
2. Initialize runtime sync early in your app bootstrap:

```ts
import { initSync } from '@medyll/idae-sync';
const syncHandle = initSync({ dbName: 'mydb', delivererConfig: { baseUrl: 'https://api' } });
```

3. For atomic writes (data + outbox) use an IDB transaction and pass `tx` into collection write methods.

---

## Why this package exists

- Guarantee local UX is immediate while making local intents durable and eventually consistent with the server.
- Avoid lost writes and provide deterministic replay (Outbox).
- Provide a generic, pluggable delivery pipeline so teams can swap the HTTP client, implement auth, or add batching.

---

## Key concepts (summary)

- IdbqlEventPayload: event payload emitted by idae-idbql. Includes `collection`, `op`, `data`, `keyPath`, `whereClause`, `silent`, `source`.
- OutboxEntry: persistent representation of a write intent stored in `__outbox__`.
- Silent write: write with `opts.silent=true` to apply server-origin changes locally without re-triggering sync.
- Transaction support: `opts.tx` allows passing an `IDBTransaction` for atomic writes across collections and the Outbox.
- Deliverer: pluggable component that maps OutboxEntry to server calls and returns boolean to indicate success or retry.

---

## Files of interest in this package

- `src/lib/outbox/OutboxStore.ts` — IndexedDB-backed Outbox implementation (enqueue/list/remove/update).
- `src/lib/SyncAdapter.ts` — SyncAdapter: enqueues entries, attempts immediate delivery, background loop with backoff.
- `src/lib/deliverer/IdaeApiDeliverer.ts` — Example deliverer using `@medyll/idae-api`.
- `src/lib/initSync.ts` — Helper to register adapter with idbql and start background processing.
- `ARCHITECTURE.md` — Decision record and implementation checklist.

---

## Runtime integration (detailed)

1. Create an OutboxStore and a deliverer, then create a SyncAdapter:

```ts
import { OutboxStore } from '@medyll/idae-sync/outbox/OutboxStore';
import { createIdaeApiDeliverer } from '@medyll/idae-sync/deliverer';
import { createSyncAdapter } from '@medyll/idae-sync/SyncAdapter';

const outbox = new OutboxStore('mydb');
const deliverer = createIdaeApiDeliverer({ baseUrl: 'https://api' });
const syncAdapter = createSyncAdapter(outbox, (entry) => deliverer.deliver(entry));
```

2. Register the adapter with idbql or use `initSync()` which will preserve existing adapters:

```ts
import { initSync } from '@medyll/idae-sync';
const sync = initSync({ dbName: 'mydb', delivererConfig: { baseUrl: 'https://api' } });
```

3. Ensure your app uses silent writes when applying server-origin changes:

```ts
// server returns canonicalUser
usersCollection.put(canonicalUser, { silent: true });
```

4. For atomic writes, use idbqlCore.transaction and pass the `tx` object to both collection writes and Outbox writes.

---

## Examples

### Enqueue manually (advanced / atomic)

```ts
await idbq.idbDatabase.transaction(['users','__outbox__'], 'readwrite', async (tx) => {
  await usersCollection.put(localUser, { tx });
  const outboxStore = tx.objectStore('__outbox__');
  outboxStore.add({ id: '...', collection: 'users', op: 'put', data: localUser, meta: { createdAt: new Date().toISOString(), retryCount: 0 } });
});
```

### Let SyncAdapter auto-enqueue (simple)

```ts
// normal local write
await usersCollection.put(localUser);
// SyncAdapter receives event and enqueues entry automatically
```

---

## Migration notes

- Add `updated_at` field to models if you plan to use LWW.
- Provide migration scripts to backfill `updated_at` where possible.
- If `updated_at` is absent, code treats it as epoch-0 and remote timestamps win.

---

## Testing guidance

- Use `SyncAdapter.processOnce()` in tests to deterministically run the delivery pass.
- Test these flows:
  - local write -> outbox enqueue -> deliverer success -> outbox removed
  - transient error -> outbox retained and retryCount incremented
  - permanent 4xx error -> outbox consumed and reported to telemetry
  - atomic tx: data + outbox committed together

---

## Next recommended steps

- Wire `initSync()` into app bootstrap and confirm adapter ordering with existing adapters.
- Implement telemetry for queue metrics.
- Add integration tests and CI jobs.
- Plan Service Worker background sync migration for cross-tab reliability.

---

If you want, I can now:
- Create an `examples/` folder with a minimal app bootstrap demonstrating `initSync` and atomic writes; or
- Open PR(s) for review with the branch `idae-sync/outbox-store-sync-adapter` ready; or
- Add integration tests for the flows above.


