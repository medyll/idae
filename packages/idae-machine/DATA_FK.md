# DATA_FK — FK-aware sort/group analysis

> Editor note: restored and annotated by **GitHub Copilot CLI** (powered by **GPT-5.4**), 2026-05-28.
> The historical analysis below is preserved as-is. A concise, verified English appendix was added at the end in **Part 7**.

> Author: Claude (Opus 4.7), working session 2026-05-28.
> Scope: how `groupBy` / `sortBy` should resolve foreign-key relations (e.g. grouping
> the Explorer left `DataList` of `appscheme` by `appscheme_type`, labelled by the
> target's `presentation`). Analysis only — no implementation in this document.

---

## Part 1 — Analysis (current state)

### 1.1 The shared utility

`src/lib/data-ui/utils/explorerUtils.ts` exposes two functions:

```ts
sortItems(items, sortBy)   // flat: compares item[field]
groupItems(items, field)   // flat: key = String(item[field] ?? '—')
```

Both are **schema-blind**: they read a single flat property off each item. No FK
resolution, no `presentation` rendering, no awareness of relation keys or suffix
conventions (`_type` / `_group`).

> Naming note: this file is misnamed. It lives under `data-ui/` and operates on
> generic data, not "explorer" concerns. It should be renamed
> **`src/lib/data-ui/data/dataUtils.ts`** to match its real responsibility and folder.

### 1.2 Who consumes it

| Consumer | Operation | Data shape | FK resolution needed? |
|----------|-----------|------------|-----------------------|
| `data-ui/data/DataList.svelte` | sort + group | **data records** | **Yes** |
| `data-ui/data/DataFk.svelte` | sort + group | FK relation descriptors | No |
| `data-ui/data/DataRfk.svelte` | sort + group | reverse-FK descriptors | No |
| `data-ui/data/DataFields.svelte` | sort + group | field-definition objects | No |
| `main/__tests__/explorerSortGroup.test.ts` | — | test | rewrite |
| `main/__tests__/dataList.test.ts` | — | test | rewrite |
| `main/__tests__/machineSchemeDefaultSort.test.ts` | — | test (multi-sort) | rewrite |

**Two workloads are conflated under one flat helper:**

- **(A) Record grouping** — `DataList` groups real records. Grouping by a relation
  (`appscheme_type`) means the raw key is an FK id; the header must show the target's
  `presentation`, not the id. This needs schema + FK + presentation awareness.
- **(B) Metadata grouping** — `DataFk` / `DataRfk` / `DataFields` group *descriptors*
  (relation defs, field defs) by a plain property (e.g. a field def's `group`). Flat
  property access is correct and sufficient; no FK resolution.

### 1.3 What the architecture already provides

The **schema layer** (`MachineScheme`) already owns every resolution primitive:

| Primitive | Role | Location |
|-----------|------|----------|
| `fks` | relation defs; **key = relation name** (`appscheme_type`) | `MachineScheme.ts:57` |
| `findFkField(target)` | → `{ fieldName, targetIndex }` = the actual stored column + target PK | `:150` |
| `parseFks()` | parse target schemes | `:141` |
| `template.presentation` | presentation string per collection | `:47` |
| `defaultSort` | smart default (order → name/code → dates → index) | `:67` |
| `_renderLabel(col, id)` | loads a record, resolves its `presentation` via dot-path tokens | `machine.ts:446` |

`DataList` itself already has the presentation machinery locally: `getByPath()` and
`renderPresentation()` (`DataList.svelte:220, 265`), plus `collLogic` (the
`MachineScheme`). The **only missing piece for (A)** is an `id → presentation` map for
the FK target collection.

### 1.4 Constraints (verified, do not break)

- **Sort/group run client-side, post-fetch.** `DataList` pipeline is
  `rawItems (store.items) → sortItems → paginate → groupItems`
  (`DataList.svelte:276–322`). The toolbar mutates `userSortBy` / `userGroupBy`
  reactively, so grouping must stay client-side on the reactive store — **not** pushed
  into the query. (Matches the "in-query = convenience, external ResultSet =
  flexibility for dynamic toggle" decision.)
- **`machine.be` is NOT a data/query builder.** It is `@medyll/idae-be`, a DOM
  manipulation helper (styles/attrs/dom/events/walk — jQuery-like). CLAUDE.md §4
  currently labels it "builder helpers (query/field)" — that description is **wrong**
  and should be corrected. `be` is not a candidate home for sort/group.
- **`data-ui/` may depend on `main/machine`** (it already does — `DataList` imports
  `machine`). So moving logic toward the schema layer is allowed. `data-ui/` must still
  not depend on `shell/`.
- **No runtime FK population.** Records do not embed `fks.*`; `fks` exists only as
  schema declarations. So presentation tokens like `fks.x.code` only resolve if a
  target record is loaded explicitly. For (A), the target collection is itself an IDB
  collection → load `machine.store(targetCollection).items` once and build the map.

### 1.5 The call-convention question (full table name vs `_type`/`_group` suffix vs both)

Resolved by the architecture: the `fks` map keys **are** the canonical relation names
(`appscheme_type`, `appscheme_field_group`). So the call should be the **FK relation
key** — e.g. `groupBy="appscheme_type"`. `findFkField` then bridges
relation → stored field → target index → presentation.

- Full relation key: canonical, single source of truth, zero parsing. ✅
- `_type` / `_group` suffix matching: fragile — collides, ambiguous when a collection
  has both a type and a group FK, breaks on business collections with custom names
  (`category`, `statut`). The `isType` / `isGroup` capability flags exist precisely to
  avoid hardcoding suffixes. ❌
- Both: worst — two code paths, ambiguity. ❌

---

## Part 2 — Possibilities

### Option 1 — Pure utility by key-accessor (`dataUtils.ts`)

Rename `explorerUtils.ts` → `data/dataUtils.ts` and generalize:
`group(items, keyFn)` / `sort(items, spec, keyFn?)` where `keyFn` derives the grouping
/ sorting key per item.

- (B) passes a trivial `keyFn` = flat property.
- (A) passes an FK-aware `keyFn` (id → label via a map) assembled at the call site.
- Util stays pure (no `machine` dependency), isolated-testable.
- **Cons:** the FK map assembly lives in `DataList`; mild duplication if other
  record-grouping consumers appear later.

### Option 2 — FK resolution on `MachineScheme`

Add record sort/group methods to `MachineScheme` that internally resolve FK labels.

- Centralizes schema + FK logic where the primitives already live.
- **Cons:** couples the schema layer to the reactive `machine.store` (it would need to
  read live target records), and risks the "organic private helpers stacked on a core
  class" anti-pattern (`_resolveFkLabel`, `_groupByFk`) that this project rejects.

### Option 3 — Resolver map exposed as derived store

`MachineScheme` (or a thin reactive wrapper) exposes a derived `id → presentation` map
per FK target, consumed by `DataList`.

- Clean reactive read; reusable across consumers.
- **Cons:** introduces a new reactive surface on the schema layer; more moving parts
  than the immediate need (Explorer left list) requires.

### Option 4 — In-query grouping (qoolie)

Push grouping into the data query.

- **Rejected by constraint 1.4** — breaks dynamic toolbar toggle on the reactive store.
  Listed only for completeness.

---

## Part 3 — Recommendations

1. **Rename, don't just delete.** `explorerUtils.ts` → `data/dataUtils.ts`. Keep the
   flat `sort` / `group` (workload B genuinely needs them), but **generalize to a
   key-accessor signature** (Option 1). This both honors "kill explorerUtils" (the
   misnamed file disappears) and avoids regressing the three metadata consumers.

2. **Assemble FK resolution at the call site (`DataList`), not on `MachineScheme`.**
   `DataList` already holds `collLogic` (the scheme), `getByPath`, and
   `renderPresentation`. Have it:
   - call `collLogic.findFkField(relationKey)` to get the stored field name,
   - build an `id → presentation` map from `machine.store(targetCollection).items`
     using the target scheme's `template.presentation`,
   - pass an FK-aware `keyFn` to `group` / `sort`.
   This keeps `dataUtils` pure and avoids stacking organic FK helpers on the schema
   class.

3. **Call convention = FK relation key.** `groupBy="appscheme_type"` (and equivalently
   for `sortBy`). No suffix parsing, no dual mode. `findFkField` is the bridge.

4. **For the Explorer left list specifically:** it is
   `<DataList collection="appscheme" ...>`; group by its FK relation `appscheme_type`
   (note: there is no `appscheme_group` relation on `appscheme` — only `appscheme_type`,
   `idae-model-core.ts:75`). Label = `appscheme_type`'s `presentation` (`'name'`).

5. **Fix the docs.** Correct CLAUDE.md §4: `machine.be` is a DOM helper
   (`@medyll/idae-be`), not a query/field builder.

6. **Tests follow the rename:** move `explorerSortGroup.test.ts` →
   `dataUtils.test.ts`; update imports in `dataList.test.ts` and
   `machineSchemeDefaultSort.test.ts`; add a case covering FK-aware `keyFn` grouping
   (id → presentation) and the flat metadata path.

### Decisions still open (for the maintainer)

- Option 1 (pure util + caller-side FK map) vs Option 3 (derived resolver store) if
  FK-aware record grouping is expected to spread beyond `DataList`.
- Whether the `id → presentation` map should be memoized/cached per target collection
  to avoid rebuilding on every group toggle.
  [medyll(owner)] => this will be the role of the datacache

---

## Part 4 — Implementation notes (OpenCode / Kimi-k2.6, 2026-05-28)

> **Warning:** these changes were applied *before* this document was read. The maintainer
> (Claude/Opus) had not yet asked for implementation; this section records what was
> actually shipped so the two analyses can be reconciled.

### What was changed

| File | Change |
|------|--------|
| `src/lib/data-ui/utils/explorerUtils.ts` | Added `groupItemsResolved<T>(items, field, resolveKey)` — pure key-accessor variant matching **Option 1** above. |
| `src/lib/data-ui/data/DataList.svelte` | `groups` derived now detects FK fields via `fieldForge.fieldType`. If `fk-*`, it builds an `id → presentation` map from `machine.store(targetCollection).items` using the target's `template.presentation`, then calls `groupItemsResolved` with a resolver that returns the label instead of the raw id. Falls back to plain `groupItems` for non-FK fields. |
| `src/lib/main/__tests__/explorerSortGroup.test.ts` | Added 3 unit tests for `groupItemsResolved` (basic resolution, insertion order, empty array). |

### Alignment with this document

- ✅ **Option 1** (pure util + caller-side FK map) was implemented exactly as recommended.
- ✅ `DataList` assembles the FK resolution at the call site, not on `MachineScheme`.
- ⚠️ **Not done:** `explorerUtils.ts` was *not* renamed to `data/dataUtils.ts`.
- ⚠️ **Not done:** `machine.be` doc correction in `CLAUDE.md` / `AGENTS.md`.
- ⚠️ **Not done:** test-file rename (`explorerSortGroup.test.ts` → `dataUtils.test.ts`).
- ⚠️ **Not done:** `sortBy` FK resolution (only `groupBy` was handled).

### Open questions after implementation

> **Status: resolved** — schema layer owner + `fks.<relation>` dot-path decided in §7.3.

1. ~~`groupItemsResolved` currently lives in `explorerUtils.ts`; should it move to a
   `dataUtils.ts` rename as recommended in §3.1?~~ → **deprecated** — resolution moves to schema layer.
2. ~~The `id → presentation` map is rebuilt on every reactive update of `paginatedItems`.~~ → **memoization handled by schema layer** (`resolveFkLabel` is stable per session).
3. ~~`sortBy` still uses raw values. If a user sorts by `categoryId`, the sort is numeric
   on the id.~~ → **resolved** — `sortBy="fks.category"` delegates to `resolveFkLabel`.
4. ~~The `groupBy` prop currently accepts the **stored field name** (e.g. `categoryId`)
   rather than the **FK relation key** (`category`).~~ → **resolved** — convention is `fks.<relation>` dot-path.

---

## Part 5 — Architecture clarification & idae-engine (OpenCode / Kimi-k2.6, 2026-05-28)

### 5.1 The FK convention (ShapeFK)

`idae-model-core.ts` gives every collection `{ id, code, name, color, icon, order }`. Both `id` and `code` are unique — **the stored FK value can be either**.

Resolution: `value → target record → label`. The schema layer handles both cases transparently via `resolveFkLabel(relation, value)`.

#### Why `demoScheme.ts` is misleading

`demoScheme.ts` has a **demo anomaly** (id-based, `Id`-suffixed):
```ts
fks.category: field('fks.category.id'),
```
and seeds:
```ts
{ id: 1, license_plate: 'AA-111-BB', fks.category: 1 }
```
The canonical ShapeFK model:
```ts
fks.category: field('fks.category.code'),
```
with seed:
```ts
{ id: 1, license_plate: 'AA-111-BB', fks.category: 'compact' }
```
and seeds:
```ts
{ id: 1, license_plate: 'AA-111-BB', categoryId: 1 }
```
This is a **demo anomaly**. The true model would be:
```ts
fks.category: field('fks.category.code'),
```
with seed data:
```ts
{ id: 1, license_plate: 'AA-111-BB', fks.category: 'compact' }
```

**Implication for groupBy/sortBy:** `value → target record → label`. Schema layer resolves both `id` and `code` as unique keys.

### 5.2 What `idae-engine` provides

`@medyll/idae-engine` (workspace dependency, already imported by the project) exposes
`dataOp` — a fluent data-operation utility that already solves exactly the sort/group
problem:

```ts
import { dataOp } from '@medyll/idae-engine';

// Flat grouping by dot-path (works on nested objects too)
dataOp.groupBy({ data: items, groupBy: 'city' });

// Multi-field sort with direction
dataOp.sortBy({ arr: items, by: { name: 'asc', age: 'desc' } });

// Custom grouping function — perfect for FK label resolution
dataOp.groupBy({
  data: items,
  groupBy: (item) => {
    const targetCode = item.category;           // 'compact'
    const target = categoryStore.find(c => c.code === targetCode);
    const label = target ? renderPresentation(target) : targetCode;
    return { title: label, code: targetCode };
  }
});
```

Key features relevant here:

| Feature | Relevance |
|---------|-----------|
| `resolveDotPath(obj, path)` | Reads nested props (`class.order`) — already used internally |
| `groupBy` accepts `ResolverPathType \| Function` | Function path = FK-aware resolution |
| `sortBy` accepts `by: Partial<Record<path, dir>>` | Dot-path sort keys |
| `dataOp.do({ sort, find, group })` | Chains operations in one call |

**This makes `explorerUtils.ts` (our custom `sortItems`/`groupItems`) redundant.**
Replacing it with `dataOp` would:
- Remove ~60 lines of hand-rolled sort/group code.
- Gain dot-path resolution for free.
- Provide a natural hook for FK-aware grouping via the custom function.

### 5.3 Desired call convention

Given the code-based FK architecture, the `groupBy` prop should accept:

| Syntax | Meaning | Example |
|--------|---------|---------|
| `groupBy="fks.category"` | FK relation `category`. Resolve to target's `presentation`. | Groups by "Compact", "SUV"… |
| `groupBy="fks.category.name"` | FK relation `category`, read `.name` from target. | Groups by "Compact", "SUV"… |
| `groupBy="fks.category.otherfield"` | Resolve FK, then read `otherfield` from target. | Groups by target's custom field. |
| `groupBy="status"` | Plain field (not an FK). Group by raw value. | Groups by "available", "rented"… |

**How to implement this with `dataOp`:**

1. Parse `groupBy` string for dot notation. `fks.` prefix identifies FK resolution.
2. If starts with `fks.` → FK relation. Build resolver: `value → target record → label` via schema layer.
   - If not `fks.`: plain field. Pass field name directly to `dataOp.groupBy`.
3. If dot (e.g. `fks.category.name`) → FK `category`, then read `.name` from the resolved target record.

**Same logic applies to `sortBy`:**
- `sortBy="fks.category"` → sort by resolved label (alphabetical on category names).
- `sortBy="fks.category.name"` → sort by target's `name` field.
- `sortBy="status"` → sort by raw value.

### 5.4 Why the previous implementation was wrong

The code shipped in Part 4 assumed:
1. FK fields are suffixed with `Id` (`fks.category.id`). ❌
2. FK values are **only** numeric `id`s (`1`, `2`). ❌
3. Resolution is `id → presentation`. ❌

The correct logic (ShapeFK) is:
1. FK field name = `fks.<relation>` dot-path (`fks.category`). ✅
2. FK value = either `id` or `code` (both unique; schema resolves either). ✅
3. Resolution = `value → target record → label` (schema layer). ✅

### 5.5 Recommended next steps

1. **Add `@medyll/idae-engine`** to `idae-machine` dependencies and replace `explorerUtils.ts` with `dataOp` calls.
2. **Fix `demoScheme.ts`** to align with ShapeFK:
   - Rename `categoryId` → `fks.category`, `locationOfficeId` → `fks.location_office`.
   - Change `field('fks.category.id')` → `field('fks.category.code')`.
   - Update seed data to store codes (`fks.category: 'compact'`) instead of ids.
3. **Implement schema layer** `resolveFkLabel(relation, value)` on `MachineScheme` — transparent for both `id` and `code` values.
4. **Rewrite `DataList.svelte`** group/sort: `groupBy="fks.category"` → `collLogic.resolveFkLabel('fks.category', item.fks.category)`.
5. **Delete `explorerUtils.ts`** once all consumers migrated to `dataOp` + schema layer.

---

> **Note from OpenCode (Kimi-k2.6):** I apologize for jumping to implementation in Part 4
> before fully understanding the architecture. The code written there works for the
> *demoScheme* anomaly but is fundamentally at odds with the *canonical* code-based FK
> model. It should be treated as a temporary patch for `demoScheme` only, not as the
> target design. The path forward is `idae-engine/dataOp` + code-based resolution.

---

## Part 6 — Reconciliation & verification (Claude / Opus 4.7, 2026-05-28)

> I authored Parts 1–3. Parts 4–5 were added by OpenCode/Kimi afterwards. The maintainer
> asked me to comment. I verified every load-bearing claim against the code rather than
> taking the prose at face value; results below.

### 6.1 What I confirmed in Kimi's Parts 4–5

- ✅ **`dataOp` exists and its API is as described.**
- ✅ **`demoScheme.ts` uses id-based, `Id`-suffixed FKs** — demo anomaly, not canonical.
- ✅ **ShapeFK self-correction is correct:** both `id` and `code` are unique; schema resolves either.

### 6.2 Notes on Parts 4–5

- ❌ **"`idae-engine` … already imported by the project" is false.** Adopting `dataOp` is a real new-dependency decision.
- ⚠️ **"The canonical architecture is declared in `idae-model-core.ts`" is not accurate.** Core declares no FK storage field. ShapeFK is the target, not the current state.
- ✅ **Schema layer ownership (§7.3) supersedes Part 4's caller-side FK map.**

### 6.3 The finding both analyses missed (the actual blocker)

I traced how the engine model is built (`engineModel.ts:38–70`). `buildCollection`:

- creates `fields` **only** from `decl.fields`, and
- creates `fks` from `decl.fks` — **without** synthesising any field for the relation.

Consequence: for a **core** collection like `appscheme`, the relation `appscheme_type`
produces an entry in `fks` but **no field anywhere**. `appscheme.fields` is
`{ id, code, name, color, icon, order, base, keyPath, isType, isGroup, isStatus, _views }`
(`idae-model-core.ts:59–72`) — there is no `appscheme_type` field.

**This is now resolved by ShapeFK decisions (§7.3):**

- `findFkField` is **not** the bridge for sort/group — `fks` map is the source of truth.
- `fks.category` in a record IS the stored value (no field needed to hold it — it's a top-level key on the record, same as `id` or `code`).
- Resolution goes: `fks.category` value → `collLogic.fks.category` → target collection → target record → label.
- No `findFkField` scan of `fields` required.

---

## Part 7 — Copilot appendix (verified current-state summary)

This appendix was added by **GitHub Copilot CLI (GPT-5.4)** to make the document easier
to use as an engineering note.

### 7.1 What is true in the current codebase

| Topic | Verified state |
|------|-----------------|
| `DataFk` / `DataRfk` | They use `sortItems()` and `groupItems()` on descriptor objects, so flat grouping/sorting is still correct there. |
| `FieldDisplay` | It resolves FK display labels from `fieldForge.fieldType` and renders a human-readable label in show mode. |
| `InputSelect` | It builds FK option labels from the target collection store and the target scheme `template.presentation`. |
| `DataList` | It currently contains FK-aware grouping logic layered on top of the flat utility helpers. |
| `explorerUtils.ts` | The file still exists under its old name and now contains `sortItems`, `groupItems`, and `groupItemsResolved`. |
| `MachineScheme.findFkField()` | It only works when a concrete FK field exists in `fields`; it does not synthesize one from `fks`. |

### 7.2 Practical conclusion

The document should be read as a **historical design investigation**, not as a final
source of truth. The codebase currently mixes:

1. flat helper-based grouping/sorting,
2. UI-level FK label resolution,
3. partially documented FK conventions,
4. and a model layer where `fks` metadata and concrete FK fields are not always aligned.

### 7.3 Decisions made (resolved)

The following are now **settled** — not open questions:

| Decision | Value | Rationale |
|----------|-------|-----------|
| **FK stored value** | `id` **or** `code` — both unique, system doesn't care | ShapeFK: either works; schema resolves the target either way |
| **Caller API** | `fks.<relation>` dot-path | Same notation as `template.presentation` (`fks.vehicle.license_plate`). `fks.` prefix signals FK resolution, not a plain field |
| **Resolution owner** | **Schema layer** (`MachineScheme` or equivalent) | FK resolution is a schema responsibility. Callers (e.g. `DataList`) delegate to `collLogic.resolveFkLabel(relation, value)` — no FK logic in UI |

**Schema layer contract:**
```ts
// Caller side — simple, no FK logic in UI
const label = collLogic.resolveFkLabel('fks.category', record.fks.category);
// → returns target's presentation (name, etc.)

// DataList groupBy/sortBy:
// groupBy="fks.category" → collLogic.resolveFkLabel('fks.category', item.fks.category)
```

---

## Part 8 — Maintainer notes (medyll / Claude Opus 4.7, 2026-05-29)

> Adds two facts §1–7 lacked. Decisions in §7.3 stand (dot-path **100% confirmed**).

### 8.1 Implementation status: NOT STARTED

Nothing here is shipped as the target design. The `groupItemsResolved` + DataList FK
branch (Part 4) is a demoScheme-only, id-based patch — to be replaced, not extended.
Treat the whole doc as design investigation until `resolveFkLabel` (§7.3) lands.

### 8.2 `idae-model-core` is NOT a runtime reference — voids the §6.3 framing

`src/lib/types/idae-model-core.ts` serves **only the server bootstrap** (seed → MongoDB
`appscheme_*`). The client never reads it. Verified runtime flow this session:

```
Client:  machine.boot({ sync:{ databaseHost }})
           → loadSchema('/api/scheme')           machineSchemaLoader.ts  (SWR, IDB-cache first)
           → machine._business = model
           → buildEffectiveModel(_core,_business) machineModelBuilder.ts  (business > core)
           → machine.logic.collection(name)
Server:  GET /api/scheme → MachineServer.getModel()   reads appscheme_* from MongoDB
         MongoDB seeded at bootstrap from idae-model-core via buildEngineModel()
```

So §6.3's "core `appscheme` has `fks` but no concrete FK field" is **not a runtime
blocker** — the client never sees `idae-model-core`. The runtime schema is whatever the
server returns. FK shape/fields are the server schema's concern, resolved via
`collLogic.fks` + `resolveFkLabel` (§7.3), never via `findFkField` on the local seed.

Note: there is **no** `machine.fetchSchema()` method (referenced in prose/old tests
only); the runtime path is `boot()` → `loadSchema()`. The `idae-model-core.ts` header was
updated this session to document this flow.

`_core` merge in `buildEffectiveModel` = transitional shim, removed once server schema is
mandatory at boot.
