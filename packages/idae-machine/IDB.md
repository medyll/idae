# IndexedDB Architecture in idae-machine

> **Last updated:** 2026-06-15

Two persistence layers touch IndexedDB: **Qoolie** (primary, app-facing CRUD/sync/reactive)
and **MachineIdbAdapter** (low-level schema drift detection + IDB upgrade transactions).
This doc describes both, how they're meant to interact, and a known bug (§5) where
their two independent `indexedDB.open()` calls race and leave the DB in a broken state.

---

## 1. Overview

```
┌─────────────────────────────────────────────────────┐
│                 Application Layer                    │
│                 (Machine, Components)                 │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────┐
│                 Qoolie Framework                      │
│  Collections (CRUD)  │  Sync (server)  │  Cache       │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────┐
│              MachineIdbAdapter                        │
│  Drift detection │ Schema-hash bookkeeping │ Upgrade  │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────┐
│                 IndexedDB (Browser API)               │
└─────────────────────────────────────────────────────┘
```

---

## 2. Qoolie — primary persistence layer

Unified CRUD/sync/reactive API across storage backends (IndexedDB, memory, server).

```typescript
// Basic CRUD
const records = machine.collection('vehicle').getAll();
await machine.collection('vehicle').put({ id: 1, name: 'Car' });

// Synchronization
await machine.sync.flush();

// Reactive access (Svelte 5 runes)
const { records } = machine.store('vehicle');
```

Use Qoolie for: CRUD, sync, reactive reads, queries — i.e. most application code.

---

## 3. MachineIdbAdapter — low-level IDB adapter

Handles schema drift detection, store create/rename/delete on upgrade, and
schema-hash bookkeeping. Real exports of `src/lib/main/machineIdbAdapter.ts`:

```typescript
// Detect drift between expected schema (effectiveModel) and actual IDB stores
const drift = await detectSchemaDrift(dbName, version, effectiveModel);
// → null | { toCreate: string[], toDelete: string[], expectedHash: string, newVersion: number }

// Apply a pending upgrade: create/rename/delete stores, create __schema_meta__, persist hash
await performIdbUpgrade(dbName, newVersion, drift, effectiveModel);

// Hash bookkeeping
const hash = computeSchemaHash(Object.keys(effectiveModel));
await storeSchemaHash(dbName, hash);
const stored = await getStoredSchemaHash(dbName);

// Introspection
const stores  = await getCurrentIdbStores(dbName);   // Set<string>, excludes INTERNAL_STORES
const version = await getActualIdbVersion(dbName);   // 0 if db doesn't exist
isProtectedStore('__outbox__'); // true — names matching __xxx__ are never deleted

// Full wipe (dev reset)
await deleteIdbDatabase(dbName);
```

There is no `migrateData()` / `deleteStore()` / `ensureStore()` — never implemented,
do not reintroduce.

---

## 4. Layer responsibilities — quick reference

| Operation Type | Layer | Example |
|----------------|-------|---------|
| CRUD operations | Qoolie | `machine.collection('vehicle').get(1)` |
| Data sync | Qoolie | `await machine.sync.flush()` |
| Reactive access | Qoolie | `machine.store('vehicle')` |
| Schema drift detection | MachineIdbAdapter | `detectSchemaDrift(dbName, version, effectiveModel)` |
| Store create/rename/delete on drift | MachineIdbAdapter | `performIdbUpgrade(dbName, newVersion, drift, effectiveModel)` |
| Full IDB wipe (dev reset) | MachineIdbAdapter | `deleteIdbDatabase(dbName)` |

**DO**: use Qoolie for standard CRUD/sync/reactive; use MachineIdbAdapter only for
drift detection and upgrade transactions.

**DON'T**: use MachineIdbAdapter for regular CRUD, add new functionality to it, or
assume it overlaps with Qoolie's responsibilities.

---

## 5. Known issue — empty IDB / `__schema_meta__` error on fresh boot

### Root cause

Two **independent** `indexedDB.open(dbName, version)` callers each own creation of a
*different subset* of object stores, with no shared coordination:

1. `machineIdbAdapter.performIdbUpgrade` (`src/lib/main/machineIdbAdapter.ts:108-150`)
   → creates business/core collection stores + `__schema_meta__`.
2. qoolie `IdbEngine.open` → `IdbSchema.createSchema` (`packages/qoolie/src/lib/engine/IdbEngine.ts:96-104`,
   `IdbSchema.ts`) → creates the same business/core stores + `__outbox__` (and
   `__outbox_dlq__`).

`indexedDB` only fires `onupgradeneeded` for the **first** open whose requested
version > the DB's current version. Whichever of the two opens loses that race opens
at an equal/lower version → its `onupgradeneeded` never fires → **its stores are
never created**. Which subset survives is timing-dependent — this is the "layers pop
randomly" symptom.

Observed reproduction (db `demo_machine` contains only `__outbox__` +
`__outbox_dlq__`, no business stores, no `__schema_meta__`):

- `detectSchemaDrift` (`machineIdbAdapter.ts:31-63`) opens the (non-existent) db
  twice with **no version** (`getStoredSchemaHash`, `getCurrentIdbStores`) — this
  silently creates the DB at version **1** with zero stores, *before* anyone has
  decided what version it should be.
- Drift is detected (`toCreate` = all business stores, `toDelete` = []) →
  `newVersion = 2`.
- **Early-return branch** (`performIdbUpgrade`, line ~108):
  `if (toCreate.length > 0 && toDelete.length === 0) return;`
  → "fresh install, let qoolie handle it" — returns *without* opening the db,
  *without* creating `__schema_meta__`, *without* calling `storeSchemaHash`.
- `createStore()` then calls `createQoolie({ dbVersion: 2, collections, ... })` →
  qoolie's `IdbEngine.open(dbName, 2)` — actual version 1 < 2 → its
  `onupgradeneeded` *should* fire and create everything via `IdbSchema.createSchema`.

  In the observed failure this step produced **only** `__outbox__`/`__outbox_dlq__`
  — i.e. `IdbSchema.createSchema`'s `#schema` (built from `effectiveModel` /
  `collections`) was effectively empty at that point, while its hardcoded
  outbox-store creation (`IdbSchema.ts:60-61`, unconditional) still ran. Likely
  `_effectiveModel` / `_business` was not yet populated (schema fetch race) when
  `createStore()` built `collections` for this particular open.

- On the **next** boot, `getCurrentIdbStores` now sees `__outbox_dlq__` as an
  "actual" store. `INTERNAL_STORES` (`machineIdbAdapter.ts:12`) only lists
  `__outbox__`, `__schema_meta__`, `__migrations__` — **missing `__outbox_dlq__`**.
  So `__outbox_dlq__` lands in `toDelete` forever → early-return condition
  (`toDelete.length === 0`) is **false** → the *full* `performIdbUpgrade` path runs
  → `storeSchemaHash` is called → `__schema_meta__` still doesn't exist (it was
  never created in the step above, and `isProtectedStore('__outbox_dlq__')` prevents
  its "deletion", so no rename/cleanup path creates it either) → **throws**
  "`__schema_meta__` store not found — call upgradeIdb first".

  Side effect: because drift is non-null every boot, `this._version` keeps
  incrementing by 1 on **every page load**, forever.

### Why "the layers pop all the time"

Both layers independently decide "what version should the DB be at" and "what stores
should exist", using two separate `indexedDB.open(...)` calls that race each other.
There is no single source of truth. Any change to either side (model shape, boot
order, network timing of `/api/scheme`) shifts which open wins the upgrade race and
therefore which stores get created — hence constant, hard-to-reproduce breakage.

### Simplification direction (no code yet — for discussion)

1. **One expected-store list, owned by `machineIdbAdapter`**:
   `Object.keys(effectiveModel) ∪ { '__outbox__', '__outbox_dlq__', '__schema_meta__' }`.
   Fix `INTERNAL_STORES` to include `__outbox_dlq__` (and any other qoolie-internal
   store names) so drift detection stops looping forever.

2. **One upgrade transaction, one `indexedDB.open(dbName, version)` with a version
   bump**. Two options:
   - **(a)** `machineIdbAdapter` performs the *only* versioned open + `onupgradeneeded`,
     creating business stores + `__outbox__`/`__outbox_dlq__`/`__schema_meta__` in one
     transaction (remove the "fresh install, let qoolie handle it" early-return
     entirely). qoolie's subsequent `createQoolie({ dbVersion: <same version> })`
     opens at an *equal* version → no `onupgradeneeded` fires → qoolie just attaches
     to the pre-existing stores. Requires verifying qoolie tolerates "stores already
     exist, no upgrade fired" on `IdbEngine.open`.
   - **(b)** (preferred — restores single-layer philosophy) qoolie becomes the
     *sole* store-creator: pass `__schema_meta__` as a regular entry in the
     `collections` config from `machine.ts`, so `IdbSchema.createSchema` creates it
     alongside business stores and `__outbox__`. `machineIdbAdapter` then never calls
     `indexedDB.open` with a version — only read-only opens (no-version) for drift
     detection + hash read/write. This removes one of the two competing upgraders
     entirely.

3. Either way: **never call `indexedDB.open(dbName)` (no version) before the target
   version is known** — those calls silently pin the DB at version 1 with zero
   stores and poison the subsequent version-bump math. Drift detection should read
   `getActualIdbVersion` (already exists, `machineIdbAdapter.ts`) without creating the
   db, or accept that a not-yet-existing db has version 0 / no stores without opening
   it at all.

---

## 6. Key Files Reference

### Qoolie (sibling package `packages/qoolie`)
- `packages/qoolie/src/lib/Qoolie.ts` — top-level facade, builds `IdbEngine` from `dbVersion`/`collections`
- `packages/qoolie/src/lib/engine/IdbEngine.ts` — owns `indexedDB.open(dbName, dbVersion)` + `onupgradeneeded`
- `packages/qoolie/src/lib/engine/IdbSchema.ts` — `createSchema()`, creates business stores + `__outbox__`/`__outbox_dlq__`

### MachineIdbAdapter (this package)
- `src/lib/main/machineIdbAdapter.ts` — drift detection + schema-hash bookkeeping + upgrade transaction (exports listed in §3)
- `src/lib/main/machineDb.ts` — schema/collection logic (`MachineDb`), not IDB-specific
- `src/lib/main/machine.ts` — calls `_scheduleDrift()` / `createStore()` which wire the two layers together (see §5 for the resulting race)

### Integration points
- `src/routes/+layout.svelte` — initialization (`machine.boot()`)
- `server/src/bootstrap/*` — server-side operations
