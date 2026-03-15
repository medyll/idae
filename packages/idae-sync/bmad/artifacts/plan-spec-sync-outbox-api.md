# Spec: Sync Outbox API Design
**Date:** 2026-03-15
**Status:** Draft
**Follows from:** audit-2026-03-15.md

---

## Goals

1. Establish a single, canonical public API surface for `@medyll/idae-sync`
2. Resolve interface mismatches (deliverer return type)
3. Remove duplicate/dead files
4. Fix broken `SyncAdapter.ts` (class defined inside function body)
5. Expose a correct `src/index.ts` barrel

---

## Current State Problems (from audit)

| # | Problem | Severity |
|---|---------|----------|
| A | `SyncAdapter.ts`: `class SyncAdapter` is syntactically inside the `createSyncAdapter` function body — invalid TS | 🔴 |
| B | `IdaeApiDeliverer.deliver()` → `boolean`, but callers expect `{ status }` | 🔴 |
| C | `src/lib/OutboxStore.ts` (top-level) duplicates `src/lib/outbox/OutboxStore.ts` | 🟡 |
| D | `src/lib/impl/InMemoryOutboxStore.ts` duplicates `src/lib/outbox/InMemoryOutboxStore.ts` | 🟡 |
| E | No `src/index.ts` — no public API | 🟡 |
| F | `OutboxEntry.meta` type missing `nextAttempt`, forcing `as any` casts | 🟡 |
| G | `initSync.ts` passes `(entry) => deliverer.deliver(entry)` — wraps bool deliverer into SyncAdapter that expects `{ status }` | 🔴 |

---

## Canonical Type Definitions

### `OutboxEntry`
```ts
export type OutboxEntry = {
  id: string;
  collection: string;
  op: 'add' | 'put' | 'update' | 'delete' | 'updateWhere' | 'deleteWhere';
  key?: unknown;
  data?: unknown;
  whereClause?: unknown;
  meta: {
    retryCount: number;
    createdAt: string;
    lastAttempt?: string;
    nextAttempt?: string;   // ← add: currently forces `as any`
    failed?: boolean;
    failureReason?: unknown;
  };
};
```

### `IDeliverer` (unified interface)
Replaces the boolean `DelivererResult` in `IdaeApiDeliverer` and the inline structural type in `createSyncAdapter`:

```ts
export type DeliverStatus = 'success' | 'retry' | 'permanent';

export type DeliverResult = {
  status: DeliverStatus;
  response?: unknown;
  conflict?: { local: unknown; remote: unknown };
};

export interface IDeliverer {
  deliver(entry: OutboxEntry): Promise<DeliverResult>;
}
```

### `IOutboxStore` (extracted interface, kept in `outbox/OutboxStore.ts`)
The class `OutboxStore` (IDB implementation) stays. The interface is extracted so `InMemoryOutboxStore` can implement it cleanly:

```ts
export interface IOutboxStore {
  enqueue(entry: OutboxEntry): Promise<void>;
  list(limit?: number): Promise<OutboxEntry[]>;
  peek(): Promise<OutboxEntry | undefined>;
  remove(id: string): Promise<void>;
  update(entry: OutboxEntry): Promise<void>;
  getMetrics(): Promise<OutboxMetrics>;
  subscribe(cb: (m: OutboxMetrics) => void): () => void;
}
```

> Note: The legacy interface (`append`, `ack`, `updateMeta`) in the dead `src/lib/OutboxStore.ts` is **not** carried forward. All active code uses `enqueue`/`remove`/`update`.

---

## File Structure (target)

```
src/
  index.ts                         ← NEW: public barrel
  lib/
    outbox/
      OutboxStore.ts               ✅ canonical class + IOutboxStore interface + types
      InMemoryOutboxStore.ts       ✅ implements IOutboxStore
    deliverer/
      IDeliverer.ts                ← NEW: shared IDeliverer interface + DeliverResult type
      IdaeApiDeliverer.ts          🔧 fix: return DeliverResult instead of boolean
      index.ts                     ✅
    SyncAdapter.ts                 🔧 fix: class outside function; one createSyncAdapter
    Deliverer.ts                   🔧 fix: import IDeliverer from deliverer/IDeliverer.ts
    ConflictResolver.ts            ✅
    WhereSerializer.ts             ✅
    ensureUpdatedAt.ts             ✅
    initSync.ts                    🔧 fix: type ev properly or keep as unknown
    observability/
      metrics.ts                   ✅

  # DELETE:
  lib/OutboxStore.ts               ❌ dead legacy
  lib/impl/InMemoryOutboxStore.ts  ❌ dead duplicate
```

---

## Fixed `SyncAdapter.ts` Structure

Current broken shape:
```ts
export function createSyncAdapter(outbox, deliverer, opts) {
  const maxRetries = ...;
  const backoffBaseMs = ...;
  // ← class defined here (INVALID — class is hoisted to module scope by TS but body references closures)

export class SyncAdapter { ... }  // ← this is actually at module scope, but closing brace of function is missing

export function createSyncAdapter(...) { ... }  // ← DUPLICATE — shadows the first
```

Target shape:
```ts
// 1. Only one createSyncAdapter
// 2. Class at module scope, no nesting
// 3. Function at bottom, returns new SyncAdapter(...)

export class SyncAdapter implements IEventAdapter {
  constructor(
    private outbox: IOutboxStore,
    private deliverer: IDeliverer,
    private intervalMs = 5000,
    private onConflict?: OnConflictHook
  ) {}

  async applyEvent(event: IdbqlEventPayload): Promise<void> { ... }
  start(): void { ... }
  stop(): void { ... }
}

export function createSyncAdapter(
  outbox: IOutboxStore,
  deliverer: IDeliverer,
  opts?: { onConflict?: OnConflictHook; intervalMs?: number }
): SyncAdapter {
  return new SyncAdapter(outbox, deliverer, opts?.intervalMs ?? 5000, opts?.onConflict);
}
```

---

## Fixed `IdaeApiDeliverer.ts`

Change return type from `boolean` → `DeliverResult`:

```ts
import type { IDeliverer, DeliverResult } from './IDeliverer';

export class IdaeApiDeliverer implements IDeliverer {
  private client: ReturnType<typeof IdaeApiClient.getInstance>;

  async deliver(entry: OutboxEntry): Promise<DeliverResult> {
    try {
      // ... switch on entry.op ...
      return { status: 'success' };
    } catch (e: unknown) {
      const status = (e as any)?.status || (e as any)?.response?.status;
      if (status && status >= 400 && status < 500) {
        return { status: 'permanent', response: e };
      }
      return { status: 'retry', response: e };
    }
  }
}
```

---

## `src/index.ts` — Public Barrel

```ts
// Core types
export type { OutboxEntry, IOutboxStore, OutboxMetrics } from './lib/outbox/OutboxStore';
export type { IDeliverer, DeliverResult, DeliverStatus } from './lib/deliverer/IDeliverer';
export type { IdbqlEventPayload } from './lib/SyncAdapter';
export type { OnConflictHook, OnConflictResult } from './lib/ConflictResolver';
export type { InitSyncOptions } from './lib/initSync';

// Classes
export { OutboxStore } from './lib/outbox/OutboxStore';
export { InMemoryOutboxStore } from './lib/outbox/InMemoryOutboxStore';
export { SyncAdapter, createSyncAdapter } from './lib/SyncAdapter';
export { OutboxDeliverer } from './lib/Deliverer';
export { IdaeApiDeliverer, createIdaeApiDeliverer } from './lib/deliverer/IdaeApiDeliverer';

// Helpers
export { defaultOnConflict, mergeObjects } from './lib/ConflictResolver';
export { ensureUpdatedAt } from './lib/ensureUpdatedAt';
export { serializeWhere, deserializeWhere } from './lib/WhereSerializer';
export { incCounter, getCounter, resetCounters } from './lib/observability/metrics';

// Entry point
export { initSync } from './lib/initSync';
```

---

## Implementation Order

1. **Create** `src/lib/deliverer/IDeliverer.ts` with `IDeliverer`, `DeliverResult`, `DeliverStatus`
2. **Fix** `src/lib/outbox/OutboxStore.ts` — add `nextAttempt` to meta type, extract `IOutboxStore`
3. **Fix** `src/lib/deliverer/IdaeApiDeliverer.ts` — return `DeliverResult`
4. **Fix** `src/lib/SyncAdapter.ts` — move class to module scope, single `createSyncAdapter`
5. **Fix** `src/lib/Deliverer.ts` — import from `IDeliverer.ts`
6. **Delete** `src/lib/OutboxStore.ts` and `src/lib/impl/InMemoryOutboxStore.ts`
7. **Create** `src/index.ts`
8. **Run** `vitest run` to verify no regressions

---

## Non-Goals

- No new sync strategies (not in scope)
- No change to IDB schema or `__outbox__` store structure
- No change to conflict resolution algorithms
- No change to test files (unless they import from dead files)
