# Sprint 4 — Integration avec idae-idbql et idae-api

**Goal:** Leveraging existing features from idae-idbql and idae-api for deeper integration

**Duration:** 4 stories

---

## Story S4-01 — Query Operators Avancés (idae-idbql)

**ID:** S4-01
**Title:** Advanced Query Operators from idae-idbql
**Priority:** P1
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S4-01`

### Description

Integrate advanced query operators from idae-idbql into qoolie's where() method.
idae-idbql already supports: `$gt`, `$lt`, `$gte`, `$lte`, `$in`, `$contains`, `$or`, `$and`, `$regex`

### Tasks

- [ ] Review idae-idbql query operators implementation
- [ ] Ensure qoolie.where() passes all operators to idbql
- [ ] Add documentation for supported operators
- [ ] Write integration tests with all operators
- [ ] Update README with operator examples

### Acceptance Criteria

- [ ] All idae-idbql operators work through qoolie
- [ ] TypeScript types support all operators
- [ ] Documentation lists all supported operators

### Example Usage

```typescript
// Already supported
const adults = qoolie.users.where({ age: { $gte: 18 } });

// Advanced operators from idae-idbql
const results = await qoolie.posts.where({
  status: 'published',
  views: { $gt: 100 },
  tags: { $in: ['svelte', 'idb'] },
  $or: [
    { author: 'Alice' },
    { featured: true }
  ],
  title: { $regex: 'tutorial' }
});
```

### Files to Create/Update

```
src/lib/operators.ts (document supported operators)
src/lib/QoolieCollection.test.ts (add operator tests)
```

---

## Story S4-02 — Reactive Queries with Svelte 5 Runes

**ID:** S4-02
**Title:** Reactive Queries with Svelte 5 Runes
**Priority:** P1
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S4-02`

### Description

Leverage idae-idbql's Svelte 5 runes integration for reactive qoolie queries.
When using Svelte 5, qoolie queries should automatically update UI when data changes.

### Tasks

- [ ] Review idae-idbql collection.svelte.ts implementation
- [ ] Add reactive wrapper for qoolie collections
- [ ] Support $derived() for query results
- [ ] Create Svelte 5 example component
- [ ] Write tests for reactivity

### Acceptance Criteria

- [ ] Query results update automatically when data changes
- [ ] Works with Svelte 5 $derived() rune
- [ ] No manual refresh needed

### Example Usage

```svelte
<script lang="ts">
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  collections: { users: { keyPath: 'id' } }
});

// Reactive query with $derived
let adults = $derived(qoolie.users.where({ age: { $gte: 18 } }));
let allUsers = $derived(qoolie.users.getAll());
</script>

{#each adults.value as user}
  <p>{user.name} - {user.age}</p>
{/each}
```

### Files to Create

```
src/lib/QoolieCollection.svelte.ts (reactive wrapper)
src/lib/QoolieCollection.svelte.test.ts
```

---

## Story S4-03 — idae-api Client Integration

**ID:** S4-03
**Title:** idae-api Client Integration
**Priority:** P2
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S4-03`

### Description

Deep integration with idae-api's IdaeApiClient for sync.
Currently qoolie uses idae-sync, which already uses IdaeApiClient.
This story ensures full feature parity and proper configuration.

### Tasks

- [ ] Review IdaeApiClient capabilities
- [ ] Ensure all IdaeApiClient options are exposed in qoolie sync config
- [ ] Support tenant context from idae-api
- [ ] Support auth middleware integration
- [ ] Write integration tests

### Acceptance Criteria

- [ ] All IdaeApiClient options available in qoolie
- [ ] Multi-tenancy works end-to-end
- [ ] Auth token refresh works correctly

### Example Usage

```typescript
const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    // All IdaeApiClientConfig options
    host: 'localhost',
    port: 3000,
    method: 'https',
    defaultDb: 'app',
    token: 'jwt-token',
    tenantId: 'tenant-123',
    headers: {
      'X-Custom-Header': 'value'
    }
  },
  collections: { users: { keyPath: 'id' } }
});
```

### Files to Update

```
src/lib/types.ts (ensure all IdaeApiClientConfig options are supported)
src/lib/utils/normalizeConfig.ts
```

---

## Story S4-04 — Health Check & Status API

**ID:** S4-04
**Title:** Health Check & Status API
**Priority:** P3
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S4-04`

### Description

Add health check and status methods inspired by idae-api's healthMiddleware.
Provide visibility into IndexedDB state, sync status, and connection health.

### Tasks

- [ ] Create `getHealthStatus()` method
- [ ] Report IndexedDB connection status
- [ ] Report sync queue status
- [ ] Report DLQ status
- [ ] Add `getCollectionStats()` for per-collection metrics
- [ ] Write tests

### Acceptance Criteria

- [ ] Health status returns connection state
- [ ] Queue lengths are reported
- [ ] Collection stats show document counts

### Example Usage

```typescript
// Get overall health
const health = await qoolie.getHealthStatus();
console.log(health);
// {
//   indexeddb: 'connected',
//   sync: 'running',
//   queueLength: 5,
//   dlqLength: 0,
//   collections: { users: { count: 150 }, posts: { count: 300 } }
// }

// Get collection-specific stats
const stats = await qoolie.getCollectionStats('users');
console.log(stats);
// { count: 150, size: '1.2MB', lastModified: Date }
```

### Files to Create

```
src/lib/health.ts
src/lib/health.test.ts
```

---

# Sprint 4 Summary

| Story | Priority | Est. Effort |
|-------|----------|-------------|
| S4-01 — Query Operators | P1 | 3h |
| S4-02 — Svelte 5 Reactivity | P1 | 4h |
| S4-03 — idae-api Integration | P2 | 4h |
| S4-04 — Health Check API | P3 | 3h |

**Total:** ~14 hours (~2 days focused)

---

**Next Sprint (S5) Candidates:**
- Offline-first conflict resolution
- Data validation & schema enforcement
- Multi-database support
- Import/Export utilities
