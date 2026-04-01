# Sprint 5 — Advanced Data Management

**Goal:** Advanced features for data validation, conflict resolution, and multi-database support

**Duration:** 4 stories

---

## Story S5-01 — Data Validation & Schema Enforcement

**ID:** S5-01
**Title:** Data Validation & Schema Enforcement
**Priority:** P1
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S5-01`

### Description

Add schema validation for collections to ensure data integrity before writing to IndexedDB.

### Tasks

- [ ] Create `defineSchema()` function for collection schemas
- [ ] Support validation rules: required, type, min, max, pattern, enum
- [ ] Add custom validator support
- [ ] Validate on create/update operations
- [ ] Return validation errors with detailed messages
- [ ] Write unit tests
- [ ] Document validation patterns

### Acceptance Criteria

- [ ] Schema validation runs before write operations
- [ ] Validation errors are descriptive
- [ ] Custom validators work correctly
- [ ] TypeScript types reflect schema constraints

### Example Usage

```typescript
import { createQoolie, defineSchema } from '@medyll/qoolie';

const userSchema = defineSchema({
  fields: {
    name: { type: 'string', required: true, min: 2, max: 100 },
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { type: 'number', min: 0, max: 150 },
    role: { type: 'string', enum: ['admin', 'user', 'guest'] },
  },
});

const qoolie = createQoolie({
  dbName: 'my-app',
  collections: {
    users: {
      keyPath: '++id',
      schema: userSchema,
    },
  },
});

// Validation error on invalid data
try {
  await qoolie.collection.users.create({ name: 'A' }); // name too short
} catch (error) {
  console.log(error.validationErrors);
  // [{ field: 'name', rule: 'min', message: 'Must be at least 2 characters' }]
}
```

### Files to Create

```
src/lib/validation/defineSchema.ts
src/lib/validation/validate.ts
src/lib/validation/validators.ts
src/lib/validation/types.ts
src/lib/validation/index.ts
```

---

## Story S5-02 — Conflict Resolution Strategies

**ID:** S5-02
**Title:** Offline-first Conflict Resolution
**Priority:** P2
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S5-02`

### Description

Add conflict resolution strategies for when local and server data diverge during sync.

### Tasks

- [ ] Create `ConflictResolver` class
- [ ] Support strategies: 'local-wins', 'server-wins', 'manual', 'custom'
- [ ] Detect conflicts during sync (based on updatedAt/timestamp)
- [ ] Emit conflict events for manual resolution
- [ ] Support automatic merge for simple cases
- [ ] Write unit tests with mock conflicts
- [ ] Document conflict resolution patterns

### Acceptance Criteria

- [ ] Conflicts are detected during sync
- [ ] Configured strategy is applied
- [ ] Manual resolution works via event handlers
- [ ] Custom resolvers can be registered

### Example Usage

```typescript
import { createQoolie, ConflictStrategy } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    conflictResolution: {
      default: 'local-wins', // or 'server-wins', 'manual', 'custom'
      perCollection: {
        users: 'manual', // Require manual resolution for users
        posts: 'server-wins',
      },
      customResolver: (local, server) => {
        // Custom merge logic
        return { ...local, ...server, mergedAt: Date.now() };
      },
    },
  },
  collections: { users: { keyPath: 'id' } },
});

// Handle manual conflicts
qoolie.sync.onConflict((conflict) => {
  console.log('Conflict detected:', conflict);
  // Choose resolution
  conflict.resolve('local'); // or 'server', or custom data
});
```

### Files to Create

```
src/lib/sync/conflict/ConflictResolver.ts
src/lib/sync/conflict/strategies.ts
src/lib/sync/conflict/types.ts
src/lib/sync/conflict/index.ts
```

---

## Story S5-03 — Multi-Database Support

**ID:** S5-03
**Title:** Multi-Database Support
**Priority:** P2
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S5-03`

### Description

Support multiple IndexedDB databases for data isolation (e.g., per user, per organization).

### Tasks

- [ ] Create `createMultiDbQoolie()` factory
- [ ] Support dynamic database creation/deletion
- [ ] Add database switching mechanism
- [ ] Support cross-database queries (optional)
- [ ] Add database metadata tracking
- [ ] Write unit tests
- [ ] Document multi-tenant patterns

### Acceptance Criteria

- [ ] Multiple databases can be created
- [ ] Database switching works correctly
- [ ] Data is isolated per database
- [ ] Cleanup/deletion works properly

### Example Usage

```typescript
import { createMultiDbQoolie } from '@medyll/qoolie';

const multiDb = createMultiDbQoolie({
  dbNamePattern: 'my-app-{tenantId}',
  collections: {
    users: { keyPath: 'id' },
    posts: { keyPath: 'id' },
  },
});

// Switch to tenant database
await multiDb.switchTo('tenant-123');
const qoolie = multiDb.getCurrent();

// Or get specific instance
const tenant1Qoolie = multiDb.get('tenant-123');

// List all databases
const databases = await multiDb.list();
console.log(databases); // ['my-app-tenant-123', 'my-app-tenant-456']

// Delete database
await multiDb.delete('tenant-123');
```

### Files to Create

```
src/lib/multiDb/createMultiDbQoolie.ts
src/lib/multiDb/MultiDbManager.ts
src/lib/multiDb/types.ts
src/lib/multiDb/index.ts
```

---

## Story S5-04 — Import/Export Utilities

**ID:** S5-04
**Title:** Import/Export Utilities
**Priority:** P3
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S5-04`

### Description

Add utilities for exporting and importing data for backup, migration, or data transfer.

### Tasks

- [ ] Create `exportDatabase()` function
- [ ] Create `importDatabase()` function
- [ ] Support full database or per-collection export
- [ ] Support JSON and compressed formats
- [ ] Add import validation and error handling
- [ ] Support data transformation during import
- [ ] Write unit tests
- [ ] Document backup/restore patterns

### Acceptance Criteria

- [ ] Export creates valid backup file
- [ ] Import restores data correctly
- [ ] Validation catches invalid imports
- [ ] Progress events are emitted for large imports

### Example Usage

```typescript
import { createQoolie, exportDatabase, importDatabase } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  collections: { users: { keyPath: 'id' } },
});

// Export full database
const backup = await exportDatabase(qoolie);
console.log(backup);
// { database: 'my-app', version: 1, collections: { users: [...] }, exportedAt: Date }

// Export specific collection
const usersBackup = await exportDatabase(qoolie, { collections: ['users'] });

// Download as file
downloadJson(backup, 'backup.json');

// Import backup
await importDatabase(qoolie, backup, {
  strategy: 'merge', // or 'replace', 'skip-existing'
  onProgress: (progress) => console.log(`${progress.percent}% complete`),
});
```

### Files to Create

```
src/lib/importExport/exportDatabase.ts
src/lib/importExport/importDatabase.ts
src/lib/importExport/types.ts
src/lib/importExport/index.ts
```

---

# Sprint 5 Summary

| Story | Priority | Est. Effort |
|-------|----------|-------------|
| S5-01 — Data Validation | P1 | 6h |
| S5-02 — Conflict Resolution | P2 | 8h |
| S5-03 — Multi-Database | P2 | 6h |
| S5-04 — Import/Export | P3 | 4h |

**Total:** ~24 hours (~3 days focused)

---

**Next Sprint (S6) Candidates:**
- Advanced indexing helpers
- Query optimization & caching
- Real-time collaboration features
- Analytics & usage tracking
