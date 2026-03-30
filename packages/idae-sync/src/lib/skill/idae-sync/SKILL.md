---
name: idae-sync
description: Use this when you need automatic background sync from IndexedDB to a server. Provides outbox pattern, conflict resolution, circuit breaker, server push, and rollback — always use this instead of hand-rolling sync logic for offline-first apps.
---

## Overview
Automatic background sync for IndexedDB to server. Implements outbox pattern with conflict resolution, circuit breaker, and field-level merge strategies.

## Install
```bash
pnpm add @medyll/idae-sync
```

## Core API
- `initSync(config)` — Start background sync with endpoint and strategy options
- `SyncAdapter` — Pluggable adapter for custom transport (fetch, WebSocket, etc.)
- `OutboxStore` — Manages pending operations queue; inspect/replay failed ops
- `ConflictResolver` — Configure per-field merge strategies
- `CircuitBreaker` — Prevents cascade failures; auto-resets after cooldown

## Usage
```ts
import { initSync } from '@medyll/idae-sync';

const sync = initSync({
  endpoint: '/api/sync',
  mode: 'optimistic',         // 'optimistic' | 'pessimistic' | 'server-first'
  conflict: 'last-write-wins', // or custom resolver
  retries: 3,
});

sync.start();
```

```ts
import { OutboxStore, ConflictResolver } from '@medyll/idae-sync';

// Inspect failed ops
const failed = await OutboxStore.getDLQ();

// Custom field-level merge
ConflictResolver.register('users', {
  name: 'client-wins',
  score: 'server-wins',
  updatedAt: (local, server) => Math.max(local, server),
});
```

## Key concepts
- Outbox pattern: all writes go to outbox first, synced in background
- Circuit breaker opens after N consecutive failures, pauses sync
- `server-first` mode: server version wins on conflict; local changes discarded
- Rollback: failed syncs can be reverted to last known good state
- Field-level merge: resolve conflicts per field, not per document
- Server push supported via SSE or WebSocket to receive remote changes
