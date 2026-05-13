# Architecture — Schema-from-MongoDB Refactoring
# idae-machine v2 — Sprint 6-9
# Architect: Sable — 2026-05-13

---

## 1. Problem Statement

`testScheme.ts` is currently the source of truth for the data model.
This blocks: multi-tenant deployments, runtime schema editing, and the
`appscheme_*` meta-model that was always intended to host the truth.

Goal: MongoDB `appscheme_*` = source of truth.
`testScheme.ts` = bootstrap/seed tool only (run once, never in prod).

---

## 2. System Diagram (target)

```
┌─────────────────────────────────────────────────────┐
│  BOOTSTRAP (one-time, dev/CLI only)                  │
│  testScheme.ts → seedSchemeFromModel() → MongoDB     │
│                   (appscheme_base, appscheme,         │
│                    appscheme_field)                   │
└────────────────────────┬────────────────────────────┘
                         │ writes once
                         ▼
┌─────────────────────────────────────────────────────┐
│  MONGODB (source of truth)                           │
│  {org}_machine_app.appscheme_base                    │
│  {org}_machine_app.appscheme                         │
│  {org}_machine_app.appscheme_field                   │
│  {org}_machine_base.vehicle, .category, ...          │
└────────────────────────┬────────────────────────────┘
                         │ GET /api/scheme
                         ▼
┌─────────────────────────────────────────────────────┐
│  SERVER  (Express + Mongoose)                        │
│  /api/scheme  → builds IdbqModel JSON from appscheme │
│  /api/data/:base/:table → routes to useDb(base)      │
│  /api/bootstrap → POST triggers seedSchemeFromModel  │
└────────────────────────┬────────────────────────────┘
                         │ HTTP + Socket.IO
                         ▼
┌─────────────────────────────────────────────────────┐
│  CLIENT  (SvelteKit + Svelte 5)                      │
│  machine.fetchSchema(url)                            │
│   → GET /api/scheme                                  │
│   → cache in IDB (_schema meta-collection)           │
│   → build IdbqModel                                  │
│   → machine.start()                                  │
│                                                      │
│  OFFLINE: serve cached schema immediately            │
│           refresh in background (stale-while-reval.) │
└─────────────────────────────────────────────────────┘
```

---

## 3. DB Naming Convention (locked)

```
org    = 'test'                      (Machine._org)
base   = 'machine_base'              (CollectionModel.base — includes domain)
DB     = '{org}_{base}'              = 'test_machine_base'

Meta DB (appscheme_*): base = 'machine_app'  → 'test_machine_app'
```

`moduleDbName(base: string)` = `${org}_${base}` — NOT `${org}_${domain}_${base}`.
Fix required in `machine.ts` (Sprint 6, Story S6-01).

---

## 4. Data Flow — Schema Delivery

```
MongoDB appscheme_*
  └─ appscheme_base:  [{ code:'machine_base', name:'Base' }, ...]
  └─ appscheme:       [{ code:'vehicle', base:'machine_base', index:'id',
                         presentation:'license_plate model', ... }]
  └─ appscheme_field: [{ collection:'vehicle', name:'id', type:'id', ... }, ...]

GET /api/scheme
  └─ server reads all 3 collections
  └─ reconstructs: { vehicle: { keyPath:'++id', base:'machine_base',
                                 template:{ index, presentation, fields, fks } } }
  └─ returns IdbqModel-compatible JSON

machine.fetchSchema('/api/scheme')
  └─ fetch JSON
  └─ store in IDB._schema (key: url)
  └─ parse → IdbqModel
  └─ machine._model = parsed
  └─ machine.start()
```

---

## 5. Offline Cache Strategy (stale-while-revalidate)

```
fetchSchema(url):
  1. Read IDB._schema[url]  (cached)
  2. IF cache exists:
       machine._model = cache
       machine.start()                ← immediate, no wait
       fetch(url) in background       ← refresh
         → if new: update IDB._schema, emit 'schema:updated'
  3. IF no cache:
       await fetch(url)               ← blocking (first boot)
       store in IDB._schema
       machine._model = fetched
       machine.start()
```

> Tradeoff: stale schema served until next boot after background refresh.
> Acceptable for schema (rare changes) vs data (frequent).

---

## 6. Server Multi-DB Routing

```typescript
// Current (wrong):
mongoose.connect('mongodb://localhost:27017/idae_machine')  // one DB

// Target:
mongoose.connect('mongodb://localhost:27017')  // server only

// Per-request DB selection:
const dbName = `${org}_${appschemeEntry.base}`  // 'test_machine_base'
const db = mongoose.connection.useDb(dbName, { useCache: true })
const col = db.collection(tableName)
```

`useCache: true` = mongoose reuses existing connection to same DB. No pool explosion.

---

## 7. seedSchemeFromModel — Design

```typescript
// server/src/bootstrap/seedSchemeFromModel.ts

async function seedSchemeFromModel(
  model: IdbqModel,
  opts: { org: string; mongoUri: string }
): Promise<void>

// For each collection in model:
//   1. Upsert appscheme_base entry (unique base values)
//   2. Upsert appscheme entry (collection metadata)
//   3. Upsert appscheme_field entries (one per field)
//
// Target DB: '{org}_machine_app'  (meta DB)
// Idempotent: uses upsert on code field
```

Trigger via:
- `POST /api/bootstrap` (dev only, guarded by NODE_ENV=development)
- CLI: `tsx server/src/bootstrap/seed.ts`

---

## 8. Component Responsibilities (unchanged)

| Component | Role | Changes |
|-----------|------|---------|
| `MachineDb` | Wraps IdbqModel, schema introspection | None — model source changes, not interface |
| `MachineScheme` | Per-collection schema access | None |
| `MachineParserForge` | Field rule parsing | None |
| `MachineRights` | RBAC | None |
| `MachineFieldType` | Format/validate | None |
| `MachineSchemeValues` | Field value ops | None |

> Key insight: MachineDb interface is stable. Only the IdbqModel that feeds it changes source.

---

## 9. Risk Areas

| Risk | Severity | Mitigation |
|------|----------|-----------|
| IdbqModel JSON not type-safe over wire | Medium | Zod validation on client parse |
| Schema cache stale after structural change | Low | `schema:updated` event triggers soft reload |
| mongoose `useDb` connection leak | Medium | `useCache: true`, monitor in dev |
| testScheme.ts still imported in tests | High | Adapter: `buildModelFromTestScheme()` returns same shape as API |
| Bootstrap overwrites prod data | Critical | `POST /api/bootstrap` only in NODE_ENV=development |

---

## 10. File Map — New/Modified per Sprint

### Sprint 6 — Foundation fixes
```
machine.ts                    MOD  fix moduleDbName()
server/.env                   MOD  remove DB name from URI
server/src/config.ts          MOD  remove default DB name
```

### Sprint 7 — Bootstrap + seedSchemeFromModel
```
server/src/bootstrap/seedSchemeFromModel.ts   NEW
server/src/bootstrap/seed.ts                  NEW  (CLI entry)
server/src/routes/bootstrap.ts                NEW  (POST /api/bootstrap)
server/src/index.ts                           MOD  register bootstrap route (dev only)
```

### Sprint 8 — Server schema delivery + multi-DB routing
```
server/src/routes/scheme.ts   MOD  read appscheme_* → return IdbqModel JSON
server/src/routes/data.ts     MOD  useDb(org_base) per collection
server/src/middleware/dbRouter.ts  NEW  lookup collection→base, useDb()
```

### Sprint 9 — Client async init
```
src/lib/main/machine.ts           MOD  add fetchSchema(), schema cache logic
src/lib/main/machineSchemaCache.ts NEW  IDB cache read/write for schema
src/lib/demo/testScheme.ts        MOD  add note: bootstrap only, not prod
src/routes/+page.svelte           MOD  use machine.fetchSchema() not init(model)
src/lib/main/__tests__/           MOD  mock schema API in tests
```

### Sprint 10 — Tests + cleanup
```
server/src/__tests__/bootstrap.test.ts  NEW
server/src/__tests__/scheme.test.ts     MOD
src/lib/main/__tests__/machine.test.ts  MOD  mock fetch
testScheme.ts                           MOD  move to src/lib/bootstrap/
```
