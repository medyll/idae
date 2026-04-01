# Sprint 2 — Developer Experience + Advanced Features

**Goal:** Developer experience improvements + Advanced features

**Duration:** 6 stories

---

## Story S2-01 — React Hook Wrapper

**ID:** S2-01  
**Title:** React Hook Wrapper  
**Priority:** P1  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S2-01`

### Description

Create React hooks for using qoolie in React applications (since qoolie is framework-agnostic).

### Tasks

- [ ] Create `useQoolie()` hook
- [ ] Create `useQoolieCollection()` hook with reactive queries
- [ ] Create `useQoolieSync()` hook for sync status
- [ ] Support React 18+ (hooks, concurrent rendering)
- [ ] Write unit tests with React Testing Library
- [ ] Export from `@medyll/qoolie/react`

### Acceptance Criteria

- [ ] `useQoolie()` returns qoolie instance (singleton)
- [ ] `useQoolieCollection('users')` returns reactive query results
- [ ] Hooks work with React 18 strict mode
- [ ] No memory leaks (proper cleanup in useEffect)

### Files to Create

```
src/react/useQoolie.ts
src/react/useQoolieCollection.ts
src/react/useQoolieSync.ts
src/react/index.ts
```

---

## Story S2-02 — Vue 3 Composables

**ID:** S2-02  
**Title:** Vue 3 Composables  
**Priority:** P1  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S2-02`

### Description

Create Vue 3 composables for using qoolie in Vue applications.

### Tasks

- [ ] Create `useQoolie()` composable
- [ ] Create `useQoolieCollection()` with Vue reactivity
- [ ] Create `useQoolieSync()` for sync status
- [ ] Support Vue 3.3+ (composition API)
- [ ] Write unit tests with Vue Test Utils
- [ ] Export from `@medyll/qoolie/vue`

### Acceptance Criteria

- [ ] Composables work with Vue 3 reactivity system
- [ ] Proper cleanup in onUnmounted
- [ ] TypeScript types work with Vue 3

### Files to Create

```
src/vue/useQoolie.ts
src/vue/useQoolieCollection.ts
src/vue/index.ts
```

---

## Story S2-03 — Query Builder (Fluent API)

**ID:** S2-03  
**Title:** Fluent Query Builder  
**Priority:** P2  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S2-03`

### Description

Add a fluent/chainable query builder as an alternative to object-based queries.

### Tasks

- [ ] Create `QueryBuilder` class
- [ ] Implement chainable methods: `.where()`, `.orderBy()`, `.limit()`, `.skip()`
- [ ] Support operators: `.eq()`, `.gt()`, `.lt()`, `.in()`, `.contains()`
- [ ] Add `.toArray()`, `.first()`, `.count()` terminators
- [ ] Write unit tests
- [ ] Document in README

### Acceptance Criteria

- [ ] Fluent API is fully typed
- [ ] Chainable methods return QueryBuilder
- [ ] Terminators execute query and return results

### Example Usage

```typescript
// Object-based (existing)
const adults = qoolie.users.where({ age: { $gte: 18 } });

// Fluent API (new)
const adults = qoolie.users
  .query()
  .where('age').gte(18)
  .orderBy('name')
  .limit(10)
  .toArray();
```

### Files to Create

```
src/lib/QueryBuilder.ts
src/lib/QueryBuilder.test.ts
```

---

## Story S2-04 — DevTools Panel

**ID:** S2-04  
**Title:** Browser DevTools Panel  
**Priority:** P2  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S2-04`

### Description

Create a browser DevTools-like panel for debugging qoolie (sync status, queue, DLQ).

### Tasks

- [ ] Create DevTools UI component (Svelte or vanilla)
- [ ] Display sync status (running, paused, queue length)
- [ ] Display outbox queue contents
- [ ] Display DLQ contents with replay button
- [ ] Allow manual flush/pause/resume
- [ ] Export as `@medyll/qoolie/devtools`

### Acceptance Criteria

- [ ] DevTools panel can be mounted in app
- [ ] Real-time updates via sync events
- [ ] Actions (flush, replay) work correctly

### Files to Create

```
src/devtools/DevToolsPanel.svelte
src/devtools/index.ts
```

---

## Story S2-05 — IndexedDB Migration Helper

**ID:** S2-05  
**Title:** IndexedDB Migration Helper  
**Priority:** P2  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S2-05`

### Description

Add utilities for migrating IndexedDB schema versions safely.

### Tasks

- [ ] Create `defineMigration()` function
- [ ] Support versioned migrations (v1 → v2 → v3)
- [ ] Add `migrate()` function to run pending migrations
- [ ] Support rollback (optional)
- [ ] Write unit tests with fake-indexeddb
- [ ] Document migration patterns

### Acceptance Criteria

- [ ] Migrations run in order
- [ ] Failed migrations stop and report error
- [ ] Data is preserved during migration

### Example Usage

```typescript
import { defineMigration, createQoolie } from '@medyll/qoolie';

const migrations = [
  defineMigration(2, (db) => {
    // Add new index
    db.createObjectStore('posts', { keyPath: 'id' })
      .createIndex('byDate', 'createdAt');
  }),
  defineMigration(3, (db, tx) => {
    // Migrate data
    const users = tx.objectStore('users');
    // ... data migration
  }),
];

const qoolie = createQoolie({
  dbName: 'my-app',
  dbVersion: 3,
  migrations,  // Run on init
  collections: { ... },
});
```

### Files to Create

```
src/lib/migrations/defineMigration.ts
src/lib/migrations/runMigrations.ts
src/lib/migrations/types.ts
```

---

## Story S2-06 — Performance Benchmarks

**ID:** S2-06  
**Title:** Performance Benchmarks  
**Priority:** P3  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S2-06`

### Description

Add performance benchmarking suite to track qoolie performance over time.

### Tasks

- [ ] Create benchmark script (`benchmarks/`)
- [ ] Benchmark CRUD operations (100, 1000, 10000 records)
- [ ] Benchmark sync queue throughput
- [ ] Benchmark query performance
- [ ] Add CI job to run benchmarks
- [ ] Store results in `benchmarks/results/`

### Acceptance Criteria

- [ ] Benchmarks run in < 5 minutes
- [ ] Results are stored as JSON
- [ ] Performance regressions are detected

### Files to Create

```
benchmarks/crud.bench.ts
benchmarks/sync.bench.ts
benchmarks/query.bench.ts
benchmarks/run.ts
```

---

# Sprint 2 Summary

| Story | Priority | Est. Effort |
|-------|----------|-------------|
| S2-01 — React Hooks | P1 | 4h |
| S2-02 — Vue Composables | P1 | 4h |
| S2-03 — Query Builder | P2 | 6h |
| S2-04 — DevTools Panel | P2 | 8h |
| S2-05 — Migration Helper | P2 | 6h |
| S2-06 — Benchmarks | P3 | 4h |

**Total:** ~32 hours (~4-5 days focused)

---

**Next Sprint (S3) Candidates:**
- Server push support (SSE/WebSocket listeners)
- Encryption at rest (IndexedDB encryption)
- Plugin system for custom deliverers
- CLI for scaffolding and migrations
