# @medyll/qoolie

IndexedDB client with optional server sync. Offline-first, reactive, framework-agnostic.

---

## Installation

```bash
pnpm add @medyll/qoolie
```

---

## Basic usage

Create a database, read and write records.

```typescript
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  dbVersion: 1,
  collections: {
    users: { keyPath: '++id' },
    posts: { keyPath: '++id' },
  },
});

// Write
await qoolie.collection.users.create({ name: 'Alice', age: 30 });
await qoolie.collection.users.update(1, { age: 31 });
await qoolie.collection.users.delete(1);

// Read
const user  = await qoolie.collection.users.get(1);
const all   = qoolie.collection.users.getAll();
const found = qoolie.collection.users.where({ age: { $gte: 18 } });
const count = await qoolie.collection.users.count();
```

`getAll()` and `where()` return synchronous snapshots from in-memory state. `get()`, `create()`, `update()`, `delete()` are async and hit IndexedDB.

---

## CRUD reference

```typescript
// Create — returns the inserted record
const user = await col.create({ name: 'Bob' });

// Get by primary key
const user = await col.get(id);

// Get all (synchronous snapshot)
const users = col.getAll();

// Query with filter (synchronous snapshot)
const adults = col.where({ age: { $gte: 18 } });
const admins = col.where({ role: 'admin', active: true });

// Update by primary key — returns updated record
await col.update(id, { age: 32 });

// Update matching records
await col.updateWhere({ role: 'guest' }, { active: false });

// Delete by primary key
await col.delete(id);

// Delete matching records
await col.deleteWhere({ active: false });

// Count, optionally filtered
const total  = await col.count();
const active = await col.count({ active: true });
```

### Query operators

```typescript
col.where({ age:  { $gte: 18 } })           // greater than or equal
col.where({ age:  { $lte: 65 } })           // less than or equal
col.where({ age:  { $gt: 0 }  })            // greater than
col.where({ age:  { $lt: 100 }})            // less than
col.where({ name: { $contains: 'ali' } })   // substring match
col.where({ role: { $in: ['admin','mod'] }})// value in array
col.where({ role: { $nin: ['guest'] } })    // value not in array
col.where({ bio:  { $exists: true } })      // field exists
```

---

## Reactive state

By default, qoolie uses Svelte 5 runes (`stateEngine: 'svelte5'`). `getAll()` and `where()` are reactive — any mutation (local or synced) triggers a re-render automatically.

```svelte
<script lang="ts">
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  collections: { users: { keyPath: '++id' } },
});

let users  = $derived(qoolie.collection.users.getAll());
let adults = $derived(qoolie.collection.users.where({ age: { $gte: 18 } }));
</script>

{#each adults as user}
  <p>{user.name}</p>
{/each}

<button onclick={() => qoolie.collection.users.create({ name: 'New', age: 25 })}>
  Add
</button>
```

No manual subscriptions. No `$store`. No `onMount`. Mutations update the UI immediately.

---

## Server sync

Enable sync to push local writes to a backend and pull remote changes.

```typescript
const qoolie = createQoolie({
  dbName: 'my-app',
  dbVersion: 1,

  sync: {
    enabled:      true,
    databaseHost: 'https://api.example.com',
    token:        localStorage.getItem('jwt') ?? undefined,
    mode:         'mobile-first', // or 'server-first'
    intervalMs:   5000,
  },

  collections: {
    users: { keyPath: '++id', sync: true  },
    drafts:{ keyPath: '++id', sync: false }, // local-only
  },
});
```

Writes go to the outbox immediately. The sync adapter flushes them in the background. On conflict, the configured strategy resolves automatically.

### Sync modes

| Mode | Behavior |
|------|----------|
| `mobile-first` | Local writes first, sync in background (default) |
| `server-first` | Block on server confirmation before updating local state |

### Sync control

```typescript
qoolie.sync.pause();
qoolie.sync.resume();

const status = qoolie.sync.getStatus();
// { running, queueLength, dlqLength, lastSyncAt }

await qoolie.sync.flush();          // drain outbox now
qoolie.sync.onEvent(handler);       // listen to sync events

qoolie.sync.setToken('new-token');  // update JWT after login
qoolie.sync.clearToken();           // clear JWT on logout
qoolie.sync.setTenantId('org-456'); // switch tenant
qoolie.sync.setHeaders({ 'X-Custom': 'value' });
```

### Dead-letter queue

Failed operations move to the DLQ after `maxRetries` attempts.

```typescript
const failed = await qoolie.sync.dlq.list();
await qoolie.sync.dlq.replay(failed[0].id);
await qoolie.sync.dlq.clear();
```

---

## Authentication

```typescript
const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    token:   localStorage.getItem('jwt') ?? undefined,
  },
  collections: { users: { keyPath: '++id' } },
});

async function login(credentials: { email: string; password: string }) {
  const res = await fetch('/api/login', {
    method: 'POST',
    body:   JSON.stringify(credentials),
  });
  const { token } = await res.json();
  qoolie.sync.setToken(token);
  localStorage.setItem('jwt', token);
}

function logout() {
  qoolie.sync.clearToken();
  localStorage.removeItem('jwt');
}
```

---

## Multi-tenancy

```typescript
const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled:  true,
    token:    '...',
    tenantId: 'org-123',
  },
  collections: { ... },
});

function switchOrg(orgId: string) {
  qoolie.sync.setTenantId(orgId);
}
```

---

## Full sync configuration

```typescript
interface SyncConfig {
  // Transport
  enabled?:      boolean;
  databaseHost?: string;                // full URL — overrides host/port/method
  host?:         string;                // default: 'localhost'
  port?:         number;                // default: 3000
  method?:       'http' | 'https';      // default: 'https'
  defaultDb?:    string;

  // Auth & identity
  token?:    string;
  tenantId?: string;
  headers?:  Record<string, string>;

  // Behavior
  mode?:        'mobile-first' | 'server-first';
  intervalMs?:  number;                // default: 5000
  maxRetries?:  number;                // default: 10
  circuitBreaker?: {
    enabled?:         boolean;
    failureThreshold?: number;
    resetTimeoutMs?:   number;
  } | false;

  // Server push
  push?: {
    enabled?:  boolean;
    protocol?: 'sse' | 'websocket';
    url?:      string;
  };
}
```

---

## Server push (real-time)

Receive changes from the server without polling.

```typescript
const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled:      true,
    databaseHost: 'https://api.example.com',
    token:        '...',
    push: {
      enabled:  true,
      protocol: 'sse',
      url:      'https://api.example.com/events',
    },
  },
  collections: { users: { keyPath: '++id' } },
});

qoolie.sync.onServerChange((change) => {
  // change.type:       'create' | 'update' | 'delete'
  // change.collection: string
  // change.id:         string | number
  // change.data:       record data
});
```

---

## Data validation

Define a schema per collection. Invalid writes throw `ValidationError`.

```typescript
import { createQoolie, defineSchema } from '@medyll/qoolie';

const userSchema = defineSchema({
  fields: {
    name:  { type: 'string',  required: true, min: 2, max: 100 },
    email: { type: 'email',   required: true },
    age:   { type: 'number',  min: 0, max: 150 },
    role:  { type: 'string',  enum: ['admin', 'user', 'guest'] },
  },
});

const qoolie = createQoolie({
  dbName: 'my-app',
  collections: {
    users: { keyPath: '++id', schema: userSchema },
  },
});

try {
  await qoolie.collection.users.create({ name: 'A' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.errors); // field-level error list
  }
}
```

---

## Conflict resolution

Configure how sync conflicts are handled when local and server records diverge.

```typescript
import { createQoolie, ConflictResolver } from '@medyll/qoolie';

const resolver = new ConflictResolver({
  default: 'latest-timestamp',  // 'local-wins' | 'server-wins' | 'latest-timestamp' | 'manual'
  perCollection: {
    users: 'manual',
  },
  customResolver: (local, server) => ({
    ...server,
    ...local,
    mergedAt: Date.now(),
  }),
});

resolver.onConflict((event) => {
  // Inspect conflict and resolve
  event.resolve('server'); // or 'local', or custom record
});
```

---

## Encryption at rest

Encrypt IndexedDB data with AES-GCM before it is written to disk.

```typescript
import { EncryptionHelper } from '@medyll/qoolie';

const enc = new EncryptionHelper({ password: 'user-secret', salt: 'app-salt' });
await enc.init();

const encrypted = await enc.encrypt({ secret: 'sensitive' });
const plain     = await enc.decrypt(encrypted);
```

---

## Plugins

Extend qoolie with lifecycle hooks.

```typescript
import { createQoolie, definePlugin } from '@medyll/qoolie';

const logPlugin = definePlugin({
  name:    'logger',
  version: '1.0.0',
  hooks: {
    beforeSync: (entry) => { console.log('outgoing:', entry); return entry; },
    afterSync:  (result) => { console.log('synced:',  result); },
    onError:    (err, entry) => { console.error('failed:', err); },
  },
});

const qoolie = createQoolie({
  dbName:    'my-app',
  plugins:   [logPlugin],
  collections: { users: { keyPath: '++id' } },
});
```

---

## Schema migrations

Migrate IndexedDB structure across versions.

```typescript
import { defineMigration, runMigrations } from '@medyll/qoolie/migrations';

const migrations = [
  defineMigration(2, (db) => {
    db.createObjectStore('posts', { keyPath: 'id' });
  }),
  defineMigration(3, async (db, tx) => {
    const store = tx.objectStore('users');
    // transform existing records
  }),
];

await runMigrations('my-app', migrations);
```

---

## Import / export

```typescript
import { exportDatabase, importDatabase, downloadExport } from '@medyll/qoolie';

// Export all collections to JSON
const snapshot = await exportDatabase(qoolie);
downloadExport(snapshot, 'backup.json'); // triggers file download

// Import (merge by default)
await importDatabase(qoolie, snapshot, { strategy: 'merge' });
// strategy: 'merge' | 'replace' | 'skip'
```

---

## Health check

```typescript
import { getHealthStatus, getCollectionStats } from '@medyll/qoolie';

const health = await getHealthStatus(qoolie);
// {
//   indexeddb:   'connected',
//   sync:        'running',
//   queueLength:  5,
//   dlqLength:    0,
//   collections: { users: { count: 150 } },
//   timestamp:   1234567890
// }

const stats = await getCollectionStats(qoolie, 'users');
```

---

## Framework adapters

### React

```typescript
import { useQoolie, useQoolieCollection, useQoolieSync } from '@medyll/qoolie/react';

function App() {
  const { qoolie } = useQoolie({
    dbName: 'my-app',
    collections: { users: { keyPath: '++id' } },
  });

  const { data, loading, error } = useQoolieCollection('users', {
    query:    (col) => col.where({ active: true }),
    reactive: true,
  });

  const { status, pause, resume } = useQoolieSync();

  if (loading) return <p>Loading...</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Vue 3

```vue
<script setup lang="ts">
import { useQoolie, useQoolieCollection } from '@medyll/qoolie/vue';

const { qoolie } = useQoolie({
  dbName: 'my-app',
  collections: { users: { keyPath: '++id' } },
});

const { data, loading } = useQoolieCollection('users', {
  query:    (col) => col.where({ active: true }),
  reactive: true,
});
</script>

<template>
  <ul>
    <li v-for="user in data" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

---

## DevTools

```typescript
import { createDevTools } from '@medyll/qoolie/devtools';

const devtools = createDevTools(qoolie);
devtools.toggle(); // shows/hides the debug panel
```

---

## CLI

```bash
# Scaffold a new collection
qoolie generate:collection posts --keyPath=id --sync

# Generate a migration
qoolie generate:migration add_index_to_posts

# Run migrations
qoolie migrate:run --db=my-app

# Database status
qoolie status --db=my-app

# Export data
qoolie export users --output=users.json

# Import data
qoolie import users --input=users.json --merge
```

---

## License

MIT

---

Author: Lebrun Meddy
