# @medyll/qoolie

> **Unified interface for IndexedDB with optional offline-first sync.** Built on top of `@medyll/idae-idbql` and `@medyll/idae-sync`.

## Features

- **Single Namespace**: All CRUD operations via `qoolie.collection('name')`
- **Optional Sync**: Enable/disable sync per collection
- **Auto-Detection**: API endpoint detected from environment or browser
- **JWT Authentication**: Token-based auth for protected APIs
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
    baseUrl: 'https://api.example.com',
    token: 'your-jwt-token',  // Optional - for protected APIs
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
  stateEngine?: 'svelte5' | 'stator';
  hooks?: {
    onSyncEvent?: (event: SyncEvent) => void;
    onError?: (error: Error, context: SyncErrorContext) => void;
  };
}
```

#### SyncConfig

```typescript
interface SyncConfig {
  enabled?: boolean;
  baseUrl?: string;          // Auto-detected if omitted
  token?: string;            // JWT token for auth
  mode?: 'mobile-first' | 'server-first';
  intervalMs?: number;       // Default: 5000
  maxRetries?: number;       // Default: 10
  circuitBreaker?: {...} | false;
}
```

### CRUD Operations

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
- `qoolie.sync.dlq.list()` - List failed operations
- `qoolie.sync.dlq.replay(id)` - Retry failed operation
- `qoolie.sync.dlq.clear()` - Clear DLQ

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

## License

MIT © [Medyll](https://github.com/medyll)
