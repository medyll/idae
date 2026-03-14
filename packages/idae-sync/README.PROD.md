# Idae Sync (Production Summary)

Short description

Idae Sync provides lightweight sync scaffolding: an Outbox store, SyncAdapter helpers, and delivery primitives to build reliable bidirectional sync between clients and servers.

Quickstart

- initSync: initialize a sync instance quickly

```js
import { initSync } from '@medyll/idae-sync';
const sync = await initSync({ dbName: 'app-sync' });
await sync.start();
```

- createSyncAdapter: create an adapter to integrate with your storage/delivery layer

```js
import { createSyncAdapter } from '@medyll/idae-sync';
const adapter = createSyncAdapter({ outbox, deliverer });
await adapter.connect();
```

Atomic writes (tx)

Use tx for atomic/transactional writes to the outbox/store to avoid partial states:

```js
await sync.tx(async (tx) => {
  await tx.put('users/123', { name: 'A' });
  await tx.put('outbox/1', { op: 'update', key: 'users/123' });
});
// tx resolves only when all operations are applied atomically
```

Silent / source semantics

- silent: perform an operation without emitting sync events (useful for local-only changes or initial seeding).
- source: tag writes with an origin (e.g., { source: 'local' }) so adapters can ignore or dedupe changes and prevent sync loops.

Running tests

From repository root:

```bash
cd packages/idae-sync
pnpm test
# or: pnpm --filter @medyll/idae-sync test
```

Pointers

- Product requirements and design: see PRD files under bmad/artifacts or docs/ (prd).
- RFCs and design discussions: see docs/rfcs/ or the repo RFC directory for protocol and adapter design notes.

For more examples, check examples/ and the package source in src/.
