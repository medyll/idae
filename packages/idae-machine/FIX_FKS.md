# FIX_FKS.md — FK Convention Audit & Fix Plan

> Author: Claude Opus 4.7 (Anthropic), 2026-05-29
> Status: Investigation complete — no code written yet.

---

## 1. The Problem: Two Misleading demoSchemes

Both copies use `Id`-suffixed field names + `fk-X.id` type + numeric-id seed data:

| File | Copy |
|---|---|
| `server/src/models/demo/demoScheme.ts` | server seed |
| `src/lib/demo/demoScheme.ts` | client dev/demo |

Both declare FKs like:

```ts
// Field name: Id-suffixed (decorative, engine ignores it)
categoryId: field('fk-category.id'),  // targetIndex = 'id'

// Separate relation block
fks: { category: { code: 'category', multiple: false } }

// Seed stores numeric PK values
{ id: 1, categoryId: 1, ... }
```

### Two lies encoded here

1. **Field name `categoryId` implies value = numeric id.** Engine maps relation→field by scanning `fieldType` (`fk-category.*`), never by field name. The `Id` suffix is decorative but misleads every reader into thinking the FK value must be the numeric PK.

2. **`fk-category.id` sets `targetIndex = 'id'`** — resolution queries `{ id: value }`. The canonical ShapeFK model wants `code` (semantic, stable, sync-safe, human-readable in seed data). Storing raw numeric auto-increment ids as FK values is fragile across reseeds and database migrations.

---

## 2. Engine Layers Already Correct (no changes needed)

The following layers derive `targetIndex` from the type string and are fully agnostic to `id` vs `code`:

| Layer | Behavior |
|---|---|
| `machineParserForge.testIs('fk')` | Checks `fk-` prefix only. Preserves `.id`/`.code` verbatim in fieldType. |
| `MachineScheme.findFkField(targetCollection)` | Scans fields for `fk-{collection}.*` prefix, returns `{ fieldName, targetIndex }` where `targetIndex` = part after the dot. |
| `dataRelationUtils.buildRelationWhere(targetIndex, value)` | Builds `{ [targetIndex]: value }` — resolves correctly for both `id` and `code`. |
| `resolveForwardRelations` / `resolveReverseRelations` | Use `findFkField`'s `targetIndex`. Correct and already agnostic. |

**Consequence:** FullInfo panels and relation components that go through `dataRelationUtils` will follow the schema correctly after switching to `.code` — no changes needed there.

---

## 3. Sites That HARDCODE the Target PK (`scheme.index`) Instead of `targetIndex`

These three sites break if demoScheme switches to `fk-category.code` + code-based seed:

### 3.1 `FieldDisplay.svelte:68` — Root cause

```ts
// Extracts only the collection, drops '.id'/'.code' entirely
fieldForge.fieldType.replace('fk-', '').split('.')[0]  // → 'category'
// targetIndex is never forwarded to InputSelect
```

`FieldDisplay` strips the `targetIndex` segment from `fk-X.Y` and passes only `collection` to `InputSelect`. InputSelect has no way to know which field to use as the option value.

### 3.2 `InputSelect.svelte:39,57,64` — Write side

```ts
const indexField = $derived(scheme?.index ?? 'id');  // hardcoded to PK
// ...
<option value={item[indexField]}>  // writes PK, regardless of declared targetIndex
```

FK editor always writes the target collection's PK (`id`) into the record field — even when the field is declared as `fk-category.code`. If the field is `.code`-typed, InputSelect writes the wrong value.

### 3.3 `DataList.svelte:338` — Read side (groupBy FK branch)

```ts
const fkIndexField = fkScheme?.index ?? 'id';  // hardcoded to PK
// labelMap keyed on PK
for (const item of fkItems) {
    const id = item[fkIndexField];  // numeric PK
    labelMap.set(id, label);
}
// item[field] = 'compact' → no match in id-keyed map → fallback to raw string
```

GroupBy FK resolution keys the label map on the target collection's PK. If the field stores `'compact'` (a code), it will never match a numeric PK key → falls back to displaying the raw value, no label.

---

## 4. Naming Trap: `fks.category` ≠ schema field name

`DATA_FK.md` describes the caller convention for `groupBy`/`sortBy` props:

```svelte
<DataList groupBy="fks.category" />
```

This is a **DataList prop notation**, not a schema field name. The engine maps relation→field by scanning `fieldType`, not by field name. Renaming `categoryId` → `category` (dropping the `Id` suffix) is purely cosmetic — it removes the misleading suffix but the engine is unaffected. Do not introduce a literal dot in the schema field name (`fks.category` as a key) — that is the prop caller convention only.

---

## 5. Other Consumers to Audit Before Migrating

| File | What to check |
|---|---|
| `DataGroup.svelte` | Does it read FK value/label? Same hardcode risk as DataList. |
| `engineModel.ts` | Type definitions — does anything assume `fk-X.id` shape? |
| `machineParserForge.test.ts` | Likely asserts `fk-X.id` form — needs update after migration. |
| `machineSchemaFromModel.test.ts` | Same. |
| `machineClient.test.ts` | May use demoScheme FK fields — check expected values. |
| `fieldBuilder.test.ts` | FK field builder tests — check `targetIndex` assertions. |
| `RbacMatrix.svelte` | Probably unrelated to FK values. Low priority. |

---

## 6. Recommended Fix Order

> Do not start implementation without confirming step 1.

### Step 1 — Confirm canonical FK value = `code`

The choice `fk-category.code` means:
- FK value stored = `'compact'`, `'suv'`, etc.
- Human-readable seed data.
- Stable across reseeds (code is invariant; auto-increment id is not).
- Resolution query: `{ code: 'compact' }` → target record.

Confirm this is the definitive convention before touching any code.

### Step 2 — Fix the three hardcoded sites (engine-level, schema-agnostic)

Fix root cause first, then write side, then read side — in this order:

1. **`FieldDisplay.svelte:68`** — extract and forward `targetIndex` from `fk-X.Y` to `InputSelect` as a new prop (e.g., `targetField`).
2. **`InputSelect.svelte`** — accept `targetField` prop, use it as `option value={item[targetField]}` instead of `item[indexField]`.
3. **`DataList.svelte:338`** — replace `fkScheme?.index` with `targetIndex` derived from `findFkField(fkCollection)`. Key labelMap on the correct target field.

After these three fixes, the engine handles `fk-X.id` and `fk-X.code` correctly with zero schema changes. The existing id-based demoScheme keeps working; the canonical code-based schema also works.

### Step 3 — Migrate both demoScheme copies

For each FK field in both demoSchemes:
- Change `fk-X.id` → `fk-X.code`
- Optionally rename `categoryId` → `category` (remove misleading `Id` suffix — cosmetic only)
- Update TypeScript `ts:` type annotations accordingly

### Step 4 — Migrate seed data

Rewrite all FK values from numeric ids to codes:

```ts
// Before
{ id: 1, categoryId: 1, locationOfficeId: 2 }

// After
{ id: 1, category: 'compact', location_office: 'PAR-02' }
```

Both seed copies (server + client). Re-run bootstrap after.

### Step 5 — Update tests

Audit and update all test files listed in §5. Fix `fk-X.id` assertions → `fk-X.code`. Fix any test seed data that stores numeric FK ids.

---

## 7. Impact Summary

| Layer | Impact of fix |
|---|---|
| `machineParserForge` | None — already agnostic |
| `MachineScheme.findFkField` | None — already returns any targetIndex |
| `dataRelationUtils` | None — already uses targetIndex |
| `FieldDisplay` | Forward targetIndex — small, targeted change |
| `InputSelect` | New `targetField` prop + use it — small change |
| `DataList` groupBy | Use `findFkField` targetIndex instead of `index` — small change |
| Both demoSchemes | Field types + field names + ts types |
| Both seed datasets | All FK values rewritten to codes |
| Tests | Assertions updated to match new types/values |

Engine core: **no breaking changes**. All fix surface is UI components + demo data.
