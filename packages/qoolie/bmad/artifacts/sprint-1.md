# Sprint 1 — Core Implementation

**Goal:** Core implementation - Qoolie basic CRUD + sync foundation

**Duration:** 5 stories

---

## Story S1-01 — Project Scaffolding

**ID:** S1-01  
**Title:** Project Scaffolding  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-01`

### Description

Set up the qoolie package structure with all necessary configuration files.

### Tasks

- [ ] Create `package.json` with ES modules, workspace deps
- [ ] Create `tsconfig.json` with strict mode
- [ ] Create `vite.config.ts` for Vitest
- [ ] Create `src/index.ts` entry point
- [ ] Create `src/lib/` directory structure
- [ ] Create basic README.md
- [ ] Run `pnpm install` at monorepo root
- [ ] Verify `pnpm --filter @medyll/qoolie check` passes

### Acceptance Criteria

- [ ] `package.json` has correct name, version, type: module
- [ ] Dependencies: `@medyll/idae-idbql`, `@medyll/idae-sync`
- [ ] TypeScript compiles without errors
- [ ] Package is recognized by Nx/pnpm workspace

### Files to Create

```
packages/qoolie/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── index.ts
    └── lib/
```

---

## Story S1-02 — Type Definitions

**ID:** S1-02  
**Title:** Type Definitions  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-02`

### Description

Create all TypeScript interfaces and types for Qoolie configuration and API.

### Tasks

- [ ] Define `CollectionConfig` interface
- [ ] Define `SyncConfig` interface
- [ ] Define `QoolieOptions` generic interface
- [ ] Define `QoolieInstance` return type
- [ ] Define `SyncStatus` interface
- [ ] Define `QoolieError` class
- [ ] Export all types from `src/lib/types.ts`

### Acceptance Criteria

- [ ] All interfaces match architecture plan
- [ ] Generic types work with collection map inference
- [ ] No `any` types in public API
- [ ] Type tests pass (if a config is invalid, TypeScript errors)

### Files to Create/Modify

```
src/lib/types.ts  (new)
```

---

## Story S1-03 — Config Resolution Module

**ID:** S1-03  
**Title:** Config Resolution & Auto-Detection  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-03`

### Description

Implement configuration normalization and API endpoint auto-detection.

### Tasks

- [ ] Create `autoDetectBaseUrl()` function
- [ ] Create `normalizeConfig()` function
- [ ] Handle SSR vs browser environments
- [ ] Merge global + per-collection sync configs
- [ ] Validate required fields (dbName, keyPath)
- [ ] Write unit tests for config resolution

### Acceptance Criteria

- [ ] Auto-detection works in browser (`window.location.origin`)
- [ ] Auto-detection reads `import.meta.env.VITE_API_URL`
- [ ] SSR returns undefined (dev must provide baseUrl)
- [ ] Per-collection config overrides global config
- [ ] Invalid config throws descriptive error

### Files to Create

```
src/lib/config.ts           (new)
src/lib/utils/autoDetectBaseUrl.ts  (new)
src/lib/utils/normalizeConfig.ts    (new)
src/lib/config.test.ts      (new)
```

---

## Story S1-04 — Qoolie Core Class

**ID:** S1-04  
**Title:** Qoolie Core Class Implementation  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-04`

### Description

Implement the main Qoolie class that orchestrates idae-idbql and optional sync.

### Tasks

- [ ] Create `Qoolie` class with constructor
- [ ] Initialize `idae-idbql` with schema
- [ ] Conditionally initialize `idae-sync` (if sync enabled)
- [ ] Register sync adapter to intercept events
- [ ] Create `collection` dynamic accessor
- [ ] Implement `destroy()` cleanup method
- [ ] Export `createQoolie()` factory function

### Acceptance Criteria

- [ ] `createQoolie()` returns QoolieInstance
- [ ] Collections are accessible via `qoolie.collection.users`
- [ ] Sync adapter is registered only when enabled
- [ ] `destroy()` cleans up all resources
- [ ] No memory leaks (test with weak refs if needed)

### Files to Create

```
src/lib/Qoolie.ts  (new)
```

### Code Sketch

```typescript
export class Qoolie<T extends CollectionConfigMap> {
  private db: IdbqlIndexedCore;
  private syncAdapter?: SyncAdapter;
  private collectionMap: Map<string, QoolieCollection<any>>;
  
  constructor(options: QoolieOptions<T>) {
    // 1. Normalize config
    // 2. Initialize idae-idbql
    // 3. If sync enabled: init sync adapter + deliverer
    // 4. Register sync adapter to idbql events
    // 5. Create collection wrappers
  }
  
  get collection(): { [K in keyof T]: QoolieCollection<T[K]> } {
    // Return proxied collections
  }
  
  destroy() {
    this.syncAdapter?.stop();
    // Cleanup
  }
}

export function createQoolie<T extends CollectionConfigMap>(
  options: QoolieOptions<T>
): QoolieInstance<T> {
  return new Qoolie(options);
}
```

---

## Story S1-05 — QoolieCollection Wrapper

**ID:** S1-05  
**Title:** QoolieCollection Wrapper with Reactive State  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-05`

### Description

Create the collection wrapper that provides CRUD operations and reactive state.

### Tasks

- [ ] Create `QoolieCollection<T>` class
- [ ] Wrap idae-idbql Collection methods
- [ ] Expose reactive state (Svelte 5 or Stator)
- [ ] Implement `where()`, `get()`, `create()`, `update()`, `delete()`
- [ ] Implement `updateWhere()`, `deleteWhere()`
- [ ] Handle sync-enabled vs sync-disabled collections
- [ ] Write unit tests for CRUD operations

### Acceptance Criteria

- [ ] All CRUD methods delegate to idae-idbql correctly
- [ ] Reactive state updates on data changes
- [ ] Works with Svelte 5 `$derived()` in components
- [ ] Works with Stator `onchange()` in vanilla JS
- [ ] Type inference works for collection data

### Files to Create

```
src/lib/QoolieCollection.ts  (new)
src/lib/QoolieCollection.test.ts  (new)
```

### Code Sketch

```typescript
export class QoolieCollection<T> {
  private collection: Collection<T>;
  private state: CollectionState<T>;
  private syncEnabled: boolean;
  
  constructor(
    name: string,
    config: CollectionConfig,
    db: IdbqlIndexedCore,
    syncEnabled: boolean
  ) {
    this.collection = db[name] as Collection<T>;
    this.state = db.state[name] as CollectionState<T>;
    this.syncEnabled = syncEnabled;
  }
  
  where(query: Where<T>): ResultSet<T> {
    return this.collection.where(query);
  }
  
  async create(data: T): Promise<T> {
    return this.collection.add(data);
  }
  
  // ... other CRUD methods
}
```

---

## Story S1-06 — SyncController Facade

**ID:** S1-06  
**Title:** SyncController Facade  
**Priority:** P1  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-06`

### Description

Create a simplified facade for sync operations (pause, resume, status).

### Tasks

- [ ] Create `SyncController` class
- [ ] Implement `pause()` / `resume()`
- [ ] Implement `getStatus()`
- [ ] Implement `flush()`
- [ ] Implement `onEvent()` handler registration
- [ ] Expose `dlq` controller
- [ ] Write unit tests

### Acceptance Criteria

- [ ] `pause()` stops sync adapter polling
- [ ] `resume()` restarts sync adapter
- [ ] `getStatus()` returns sync state snapshot
- [ ] `onEvent()` returns unsubscribe function
- [ ] All methods delegate to idae-sync correctly

### Files to Create

```
src/lib/SyncController.ts  (new)
src/lib/SyncController.test.ts  (new)
```

---

## Story S1-07 — DLQController

**ID:** S1-07  
**Title:** Dead Letter Queue Controller  
**Priority:** P1  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-07`

### Description

Create controller for managing failed sync operations.

### Tasks

- [ ] Create `DLQController` class
- [ ] Implement `list()` — list failed entries
- [ ] Implement `replay(id)` — retry failed entry
- [ ] Implement `clear()` — clear all failed
- [ ] Write unit tests

### Acceptance Criteria

- [ ] `list()` returns array of failed outbox entries
- [ ] `replay()` moves entry back to main outbox
- [ ] `clear()` removes all DLQ entries
- [ ] DLQ is accessible via `qoolie.sync.dlq`

### Files to Create

```
src/lib/DLQController.ts  (new)
src/lib/DLQController.test.ts  (new)
```

---

## Story S1-08 — Main Exports & Public API

**ID:** S1-08  
**Title:** Main Exports & Public API Surface  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-08`

### Description

Finalize the public API surface and exports from the package.

### Tasks

- [ ] Export `createQoolie` from `src/index.ts`
- [ ] Export all types from `src/lib/types.ts`
- [ ] Export `QoolieError` class
- [ ] Create barrel exports (no deep imports)
- [ ] Verify tree-shaking works (no unused code)
- [ ] Write integration test for public API

### Acceptance Criteria

- [ ] `import { createQoolie, QoolieError } from '@medyll/qoolie'` works
- [ ] All types are exported
- [ ] No deep imports needed (e.g., `@medyll/qoolie/lib/...`)
- [ ] Bundle size is reasonable (<10KB minified)

### Files to Modify

```
src/index.ts  (main entry point)
```

---

## Story S1-09 — Unit Test Suite

**ID:** S1-09  
**Title:** Unit Test Suite (Vitest)  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-09`

### Description

Create comprehensive unit tests for all qoolie modules.

### Tasks

- [ ] Set up Vitest with fake-indexeddb
- [ ] Write tests for config resolution
- [ ] Write tests for QoolieCollection CRUD
- [ ] Write tests for SyncController
- [ ] Write tests for DLQController
- [ ] Write tests for error handling
- [ ] Ensure >80% code coverage
- [ ] Run `pnpm test` and verify all pass

### Acceptance Criteria

- [ ] All stories have passing tests
- [ ] Code coverage >80%
- [ ] Tests run in <10 seconds
- [ ] No flaky tests

### Files to Create

```
src/lib/*.test.ts  (test files for each module)
```

---

## Story S1-10 — Build & Type Check

**ID:** S1-10  
**Title:** Build Pipeline & Type Check  
**Priority:** P0  
**Status:** planned  
**Role:** Developer  
**Command:** `bmad dev story S1-10`

### Description

Ensure the package builds correctly and passes all type checks.

### Tasks

- [ ] Run `pnpm --filter @medyll/qoolie build`
- [ ] Run `pnpm --filter @medyll/qoolie check`
- [ ] Run `pnpm --filter @medyll/qoolie lint`
- [ ] Fix any TypeScript errors
- [ ] Fix any ESLint warnings
- [ ] Verify dist/ output is correct
- [ ] Test import in a sample project

### Acceptance Criteria

- [ ] Build completes without errors
- [ ] Type check passes
- [ ] Lint passes
- [ ] dist/ contains .js and .d.ts files
- [ ] Package can be imported in another package

### Commands

```bash
pnpm --filter @medyll/qoolie build
pnpm --filter @medyll/qoolie check
pnpm --filter @medyll/qoolie lint
pnpm --filter @medyll/qoolie test
```

---

# Sprint 1 Complete Definition

**Stories:** S1-01 through S1-10

**Total Stories:** 10

**Estimated Effort:** ~3-5 days of focused development

**Next Sprint (S2) Candidates:**
- Server push support (SSE/WebSocket)
- Advanced conflict resolution UI helpers
- Query builder fluent API
- DevTools panel for debugging
