# @medyll/qoolie

> **Unified interface for IndexedDB with optional offline-first sync.** Built on top of `@medyll/idae-idbql` and `@medyll/idae-sync`.

## Features

- **Single Namespace**: All CRUD operations via `qoolie.collection('name')`
- **Optional Sync**: Enable/disable sync per collection
- **Auto-Detection**: API endpoint detected from environment or browser
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
    mode: 'mobile-first',
  },
  
  collections: {
    users: { keyPath: 'id' },
    tasks: { keyPath: 'id', sync: true },
    drafts: { keyPath: 'id', sync: false },  // Local only
  },
});

// CRUD operations
await qoolie.users.create({ name: 'Alice', age: 30 });
const adults = qoolie.users.where({ age: { $gte: 18 } });

// Sync control
qoolie.sync.pause();
qoolie.sync.resume();
```

## API Reference

### Initialization

```typescript
createQoolie(options: QoolieOptions<T>): QoolieInstance<T>
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
- `qoolie.sync.dlq.list()` - List failed operations
- `qoolie.sync.dlq.replay(id)` - Retry failed operation
- `qoolie.sync.dlq.clear()` - Clear DLQ

## License

MIT © [Medyll](https://github.com/medyll)
