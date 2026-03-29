# @medyll/qoolie

> **Client database IndexedDB the easy way, add server sync. JWT auth, multi-tenancy, custom headers — all configured in one place. The unified data layer for your frontend.**

🔧 **Your strategy** | 🔐 **Auth-ready** | 🔄 **Sync when you want** | 🏢 **Multi-tenant** | 🎛️ **Full API control**

## Features

- **Single Namespace**: All CRUD operations via `qoolie.collection('name')`
- **Optional Sync**: Enable/disable sync per collection
- **Auto-Detection**: API endpoint detected from environment or browser
- **Full API Client Control**: All `IdaeApiClient` options exposed (host, port, method, defaultDb, headers)
- **JWT Authentication**: Token-based auth for protected APIs
- **Multi-Tenancy**: Tenant ID support for isolated data
- **Reactive State**: Works with Svelte 5 runes or idae-stator
- **Type-Safe**: Full TypeScript inference

## Installation

```bash
pnpm add @medyll/qoolie
```

## Quick Start

```typescript
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  dbVersion: 1,
  
  // Global sync config
  sync: {
    enabled: true,
    databaseHost: 'https://api.example.com',
    token: 'your-jwt-token',
    tenantId: 'tenant-123',  // Multi-tenancy
    defaultDb: 'app',
    mode: 'mobile-first',
  },
  
  collections: {
    users: { keyPath: 'id', sync: true },
    drafts: { keyPath: 'id', sync: false },  // Local only
  },
});

// CRUD operations
await qoolie.users.create({ name: 'Alice', age: 30 });
const adults = qoolie.users.where({ age: { $gte: 18 } });

// Sync control
qoolie.sync.pause();
qoolie.sync.resume();

// Update token (e.g., after login/refresh)
qoolie.sync.setToken('new-jwt-token');

// Update tenant (e.g., user switches organization)
qoolie.sync.setTenantId('tenant-456');

// Add custom headers
qoolie.sync.setHeaders({ 'X-Custom-Header': 'value' });
```

## API Reference

### Initialization

```typescript
createQoolie(options: QoolieOptions<T>): QoolieInstance<T>
```

#### QoolieOptions

```typescript
interface QoolieOptions<T extends CollectionConfigMap> {
  dbName: string;
  dbVersion?: number;
  sync?: SyncConfig | false;
  collections: T;
  stateEngine?: 'svelte5' | 'stator';  // Default: 'svelte5'
  hooks?: {
    onSyncEvent?: (event: SyncEvent) => void;
    onError?: (error: Error, context: SyncErrorContext) => void;
  };
}
```

### Svelte 5 Reactivity

When using `stateEngine: 'svelte5'` (default), qoolie queries are reactive with Svelte 5 runes:

```svelte
<script lang="ts">
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  collections: {
    users: { keyPath: '++id' }
  }
});

// Reactive queries with $derived
let allUsers = $derived(qoolie.collection.users.getAll());
let adults = $derived(qoolie.collection.users.where({ age: { $gte: 18 } }));

// Updates automatically when data changes!
</script>

{#each adults.value as user}
  <p>{user.name} - {user.age}</p>
{/each}

<button onclick={() => qoolie.collection.users.create({ name: 'New', age: 25 })}>
  Add User
</button>
```

#### SyncConfig

All fields are optional.

```typescript
interface SyncConfig {
  // Connection
  enabled?: boolean;
  databaseHost?: string;    // Full URL (overrides host/port/method)
  host?: string;            // Default: 'localhost'
  port?: number;            // Default: 3000
  method?: 'http' | 'https';// Default: 'https'
  defaultDb?: string;       // Default: 'app'
  
  // Authentication & Multi-tenancy
  token?: string;             // JWT token for auth
  tenantId?: string;          // Tenant ID for multi-tenancy
  headers?: Record<string, string>;  // Custom headers
  
  // Sync behavior
  mode?: 'mobile-first' | 'server-first';
  intervalMs?: number;        // Default: 5000
  maxRetries?: number;        // Default: 10
  circuitBreaker?: {...} | false;
  
  // Server Push (real-time sync)
  push?: {
    enabled?: boolean;
    protocol?: 'sse' | 'websocket';
    url?: string;
  };
}
```

All `IdaeApiClientConfig` options are supported for full compatibility with idae-api.

### Framework Integrations

#### React Hooks

```typescript
import { useQoolie, useQoolieCollection, useQoolieSync } from '@medyll/qoolie/react';

function App() {
  const { qoolie } = useQoolie({
    dbName: 'my-app',
    sync: { enabled: true },
    collections: { users: { keyPath: 'id' } },
  });

  return <UsersList />;
}

function UsersList() {
  const { data, loading, error, refresh } = useQoolieCollection('users', {
    query: (collection) => collection.where({ active: true }).toArray(),
    reactive: true,
  });

  const { status, pause, resume } = useQoolieSync();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <span>Queue: {status.queueLength}</span>
      <button onClick={pause}>Pause Sync</button>
      <ul>
        {data.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Vue 3 Composables

```vue
<script setup lang="ts">
import { useQoolie, useQoolieCollection, useQoolieSync } from '@medyll/qoolie/vue';

const { qoolie } = useQoolie({
  dbName: 'my-app',
  sync: { enabled: true },
  collections: { users: { keyPath: 'id' } },
});

const { data, loading, error, refresh } = useQoolieCollection('users', {
  query: (collection) => collection.where({ active: true }).toArray(),
  reactive: true,
});

const { status, pause, resume } = useQoolieSync();
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <span>Queue: {{ status?.queueLength }}</span>
    <button @click="pause">Pause Sync</button>
    <ul>
      <li v-for="user in data" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>
```

- `qoolie.collection.where(query)` - Query with filters
- `qoolie.collection.get(id)` - Get by ID
- `qoolie.collection.create(data)` - Create document
- `qoolie.collection.update(id, data)` - Update by ID
- `qoolie.collection.delete(id)` - Delete by ID
- `qoolie.collection.deleteWhere(query)` - Bulk delete

### Sync Control

- `qoolie.sync.pause()` - Pause sync
- `qoolie.sync.resume()` - Resume sync
- `qoolie.sync.getStatus()` - Get sync status
- `qoolie.sync.flush()` - Flush pending operations
- `qoolie.sync.onEvent(handler)` - Listen to sync events
- `qoolie.sync.setToken(token)` - Update JWT token
- `qoolie.sync.clearToken()` - Clear JWT token
- `qoolie.sync.setTenantId(tenantId)` - Update tenant ID
- `qoolie.sync.setHeaders(headers)` - Update custom headers
- `qoolie.sync.configure(options)` - Update any client option
- `qoolie.sync.dlq.list()` - List failed operations
- `qoolie.sync.dlq.replay(id)` - Retry failed operation
- `qoolie.sync.dlq.clear()` - Clear DLQ

### DevTools Panel

Debug sync operations with the built-in DevTools panel:

```typescript
import { createDevTools } from '@medyll/qoolie/devtools';
const devtools = createDevTools(qoolie);
devtools.toggle();
```

### Migrations

Manage IndexedDB schema changes:

```typescript
import { defineMigration, runMigrations } from '@medyll/qoolie/migrations';

const migrations = [
  defineMigration(2, (db) => {
    db.createObjectStore('posts', { keyPath: 'id' });
  }),
  defineMigration(3, async (db, tx) => {
    // Migrate data
  }),
];

await runMigrations('my-app', migrations);
```

### Benchmarks

Run performance benchmarks:

```bash
pnpm run bench
```

## Authentication

Qoolie supports JWT authentication for protected APIs:

```typescript
// Initialize with token
const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    token: localStorage.getItem('jwt'),
  },
  collections: { ... },
});

// Update token after login
async function login(credentials) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  const { token } = await response.json();
  qoolie.sync.setToken(token);
  localStorage.setItem('jwt', token);
}

// Clear token on logout
function logout() {
  qoolie.sync.clearToken();
  localStorage.removeItem('jwt');
}
```

## Multi-Tenancy

Qoolie supports multi-tenant architectures:

```typescript
// Initialize with tenant
const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    token: '...',
    tenantId: 'tenant-123',  // Required for tenant isolation
  },
  collections: { ... },
});

// Switch tenant (e.g., user changes organization)
function switchTenant(newTenantId: string) {
  qoolie.sync.setTenantId(newTenantId);
  localStorage.setItem('tenantId', newTenantId);
}
```

## Custom Headers

Add custom headers to all API requests:

```typescript
const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    headers: {
      'X-API-Version': 'v2',
      'X-Custom-Header': 'value',
    },
  },
  collections: { ... },
});

// Update headers at runtime
qoolie.sync.setHeaders({
  'X-New-Header': 'new-value',
});

// Or use configure for full control
qoolie.sync.configure({
  host: 'api.example.com',
  port: 443,
  method: 'https',
  headers: { 'Authorization': 'Bearer ...' },
});
```

## Health Check

Get health status and collection statistics:

```typescript
import { createQoolie, getHealthStatus, getCollectionStats } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  collections: { users: { keyPath: 'id' } },
});

// Get overall health status
const health = await getHealthStatus(qoolie);
console.log(health);
// {
//   indexeddb: 'connected',
//   sync: 'running',
//   queueLength: 5,
//   dlqLength: 0,
//   collections: {
//     users: { count: 150 }
//   },
//   timestamp: 1234567890
// }

// Get specific collection stats
const stats = await getCollectionStats(qoolie, 'users');
console.log(stats);
// { count: 150, size: 12288, lastModified: Date }

// Format size for display
import { formatBytes } from '@medyll/qoolie';
console.log(formatBytes(stats.size)); // "12 KB"
```

## Server Push (Real-time Sync)

Enable real-time server push via SSE or WebSocket:

```typescript
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    databaseHost: 'https://api.example.com',
    token: 'your-jwt-token',
    // Server push configuration
    push: {
      enabled: true,
      protocol: 'sse', // or 'websocket'
      url: 'wss://api.example.com/sync',
    },
  },
  collections: { users: { keyPath: 'id' } },
});

// Listen to server changes
qoolie.sync.onServerChange((change) => {
  console.log('Server change:', change);
  // change.type: 'create' | 'update' | 'delete'
  // change.collection: collection name
  // change.id: document id
  // change.data: document data
});

// Check push connection status
console.log('Push connected:', qoolie.sync.isPushConnected());
```

## Encryption at Rest

Encrypt IndexedDB data using AES-GCM:

```typescript
import { createQoolie, EncryptionHelper } from '@medyll/qoolie';

// Create encryption helper
const encryption = new EncryptionHelper({
  password: 'user-password',
  salt: 'random-salt', // Store securely
});

// Initialize encryption
await encryption.init();

// Encrypt data before storing
const data = { secret: 'sensitive-info' };
const encrypted = await encryption.encrypt(data);

// Decrypt data after reading
const decrypted = await encryption.decrypt(encrypted);
```

## Plugin System

Extend Qoolie with custom plugins:

```typescript
import { createQoolie, definePlugin } from '@medyll/qoolie';

// Define a plugin
const myPlugin = definePlugin({
  name: 'my-plugin',
  version: '1.0.0',
  hooks: {
    beforeSync: (entry) => {
      console.log('Before sync:', entry);
      return entry;
    },
    afterSync: (result) => {
      console.log('Sync completed:', result);
    },
    onError: (error, entry) => {
      console.error('Sync error:', error);
    },
  },
});

// Use plugin
const qoolie = createQoolie({
  dbName: 'my-app',
  plugins: [myPlugin],
  collections: { users: { keyPath: 'id' } },
});
```

## CLI

Use the Qoolie CLI for scaffolding and data management:

```bash
# Install CLI globally
npm install -g @medyll/qoolie

# Generate a new collection
qoolie generate:collection posts --keyPath=id --sync

# Generate a migration
qoolie generate:migration add_index_to_posts

# Run migrations
qoolie migrate:run --db=my-app

# Check database status
qoolie status --db=my-app

# Export data
qoolie export users --output=users-backup.json

# Import data
qoolie import users --input=users-backup.json --merge
```

## License

MIT © [Medyll](https://github.com/medyll)
