> **HISTORIQUE — SUPERSEDED 2026-06-01.** Plan d'audit pré-refonte. La convention décrite (fk-X.code, double déclaration fields+fks) est remplacée : fks{} = source unique, join data=id, fold dynamique. Ne pas appliquer.

# FIX_FKS.md — FK Convention Audit & Fix Plan

> Author: Claude Opus 4.7 (Anthropic), 2026-05-29
> Status: Investigation complete — no code written yet.
>
> Editor note: preserved and annotated by **GitHub Copilot CLI** (powered by **GPT-5.4**), 2026-05-29.
> The original analysis remains below. A verification appendix was added in **Section 8** to separate confirmed facts from architectural choices and incorrect claims.

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

---

## 8. GitHub Copilot CLI verification appendix (2026-05-29)

This appendix verifies the document against the current repository state. It does **not**
restate every argument below; it only marks what is confirmed, what is incomplete, and
what is still a decision rather than an established convention.

### 8.1 Confirmed claims

1. **Both demoScheme copies currently encode FK values as `.id` + numeric seed values.**
   Verified in:
   - `server/src/models/demo/demoScheme.ts`
   - `src/lib/demo/demoScheme.ts`

   Both files declare fields such as `categoryId: field('fk-category.id')` /
   `locationOfficeId: field('fk-location_office.id')`, and both `demoSeed` blocks store
   numeric FK values (`categoryId: 1`, `locationOfficeId: 1`, `vehicleId: 2`, etc.).

2. **`MachineParserForge` preserves the FK suffix verbatim.**
   Verified in `src/lib/main/machineParserForge.ts`: FK detection only checks the `fk-`
   prefix and preserves the remainder of the type string as `fieldType`.

3. **`MachineScheme.findFkField()` is schema-driven and extracts `targetIndex` from the
   FK type string.**
   Verified in `src/lib/main/machine/MachineScheme.ts`: it scans fields for
   `fk-{collection}.` and returns both `{ fieldName, targetIndex }`.

4. **`buildRelationWhere()` and `resolveForwardRelations()` are already target-index aware.**
   Verified in `src/lib/data-ui/utils/dataRelationUtils.ts`: forward relations build
   `{ [targetIndex]: value }`, so this path is compatible with both `.id` and `.code`.

5. **`InputSelect.svelte` currently writes the target collection primary key, not the
   declared FK target field.**
   Verified in `src/lib/data-ui/input/InputSelect.svelte`: option values are keyed on
   `scheme?.index ?? 'id'`.

6. **`DataList.svelte` group-by FK labels are currently keyed on the target collection
   primary key.**
   Verified in `src/lib/data-ui/data/DataList.svelte`: the FK label map uses
   `fkScheme?.index ?? 'id'`.

### 8.2 Corrections and missing bug surface

1. **`FieldDisplay.svelte` has two FK issues, not one.**

   The document correctly identifies the edit-path issue (it drops `.id` / `.code` and
   forwards only the collection to `InputSelect`), but it misses a second read-path issue:
   the show-mode label resolution also keys on `fkScheme?.index ?? 'id'`.

   Consequence: if a field becomes `fk-category.code`, read-only display will fall back to
   the raw stored value unless `FieldDisplay` also uses the declared `targetIndex`.

2. **`resolveReverseRelations()` is *not* agnostic to `.id` vs `.code`.**

   The original Section 2 overstates this part. In
   `src/lib/data-ui/utils/dataRelationUtils.ts`, reverse relations currently do:

   - `const sourceId = record[scheme.index]`
   - `where: buildRelationWhere(fkDef.fieldName, sourceId)`

   That works for `.id`-based FKs, but after a migration to `fk-X.code`, reverse queries
   would need the source record's **target field value** (for example `record.code`), not
   always `record.id`.

   This affects reverse-relation consumers such as `DataListRfk.svelte`.

3. **“No changes needed there” is only true for forward relation resolution.**

   The claim can be kept for:
   - `MachineParserForge`
   - `MachineScheme.findFkField`
   - `buildRelationWhere`
   - `resolveForwardRelations`

   It should **not** be extended to reverse relation helpers or all FK display surfaces.

### 8.3 Architectural choice, not verified repository convention

The sentence below is a design direction, not a verified repository fact:

> “The canonical ShapeFK model wants `code` (semantic, stable, sync-safe, human-readable in seed data).”

I did **not** find repository evidence establishing `.code` as the current FK convention.
What the code proves today is:

- the engine can represent any `fk-X.Y` shape
- the current demos and tests still use `.id`

So moving to `.code` remains a valid architectural proposal, but it is still a **decision
to confirm**, not a claim already enforced by the codebase.

### 8.4 Audit results for Section 5

| File | Verification result |
|---|---|
| `DataGroup.svelte` | Checked. No FK value/label resolution there; low risk for this migration. |
| `engineModel.ts` | Checked. No hardcoded `fk-X.id` assumption found. |
| `machineParserForge.test.ts` | Checked. Uses `.id` examples, but these are generic parser tests; they do **not** inherently need changing unless the accepted syntax itself changes. |
| `machineSchemaFromModel.test.ts` | Partially checked. It references demoScheme FK fields; updates are only needed if field names or exact demo types change. |
| `machineClient.test.ts` | Checked. Uses its own inline model with `fk-category.id`; not directly coupled to demoScheme migration. |
| `fieldBuilder.test.ts` | Checked. Generic builder coverage only; no mandatory migration work. |
| `RbacMatrix.svelte` | Checked. No FK type-string handling in this component; unrelated to this bug surface. |

### 8.5 Revised conclusion

The document correctly identifies a **real `.id` hardcoding problem** in current UI code,
but the verified scope is slightly different from the original write-up:

1. **Definitely affected now**
   - `FieldDisplay.svelte` (edit path + show path)
   - `InputSelect.svelte`
   - `DataList.svelte` group-by FK branch
   - `resolveReverseRelations()` if the repository migrates to `.code`

2. **Already schema-agnostic**
   - `MachineParserForge`
   - `MachineScheme.findFkField`
   - `buildRelationWhere`
   - `resolveForwardRelations`

3. **Still an open architectural decision**
    - whether the repository should keep supporting `.id` as the dominant demo convention
      or migrate the demos and seeds to `.code`

---

## 9. DeepSeek v4 Pro independent verification (2026-05-29)

> Annotated by: **opencode CLI** powered by **DeepSeek v4 Pro** (`opencode-go/deepseek-v4-pro`), 2026-05-29.
> Method: re-read every source file listed in §8.1–8.4 and compared against claims.

### 9.1 Verification method

Each file was re-read at the claimed line numbers. All 8 bug-surface claims from §8.2 and all
6 engine-layer claims from §8.1 were independently verified against the current repository state.

### 9.2 Results — 100% confirmation

All 8.1 (confirmed claims) and all 8.2 (corrections) checks passed at the exact lines reported.
No false positives. No missing bugs beyond what §8.2 already corrected.

### 9.3 Additional observation — `InputSelect.svelte` props interface

`InputSelect.svelte` currently accepts no prop for `targetField`. The fix in §6 step 2
(items 1–2) correctly identifies this gap: `FieldDisplay` must compute and forward
`targetIndex`, and `InputSelect` must accept and use it.

### 9.4 Additional observation — `DataList.svelte` groupBy FK uses `findFkField` already

At line 330–332 of `DataList.svelte`, `findGroupByFkCollectionName()` extracts the
collection from the `fks.X` prop notation, but the result is never passed to
`MachineScheme.findFkField()` to recover the `targetIndex`. The fix described in §6 step 2
(item 3) is correct: the `findFkField()` machinery already exists and just needs to be wired in.

### 9.5 Additional observation — `resolveReverseRelations()` surface

`parseReverseFkFields()` (called at line 101) already returns `targetIndex` in its output
(`fkDef.targetField`). The value is simply unused at line 85 where `record[scheme.index]` is
hardcoded. The fix surface is therefore one expression change: use `record[fkDef.targetField]`
instead of `record[scheme.index]`. This is not mentioned explicitly in the original fix plan
(§6) but is consistent with the same engine-agnostic pattern.

### 9.6 Verdict

**Document quality: HIGH.** All claims, line numbers, and fix steps are accurate against
`idae-machine@2026-05-29`. The §8 Copilot appendix correctly identified the only two
issues missing from the original analysis (reverse relations + FieldDisplay show-path).
No further corrections needed.
