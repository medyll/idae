# Factorization Notes

Multi-author factorization log for `src/lib/data-ui/`, opened on the
`DataRecord.svelte` solidity review. Ordered **broad → specific**: whole-directory
and whole-component analyses first, then the focused deep-dives they reference.
Each section keeps its original author signature.

**Sections**

0. **Execution order + locked decisions** — _Claude Opus 4.8_ ← **READ FIRST**
1. Full solidity analysis of `DataRecord.svelte` — _Claude Opus 4.8_
2. Additional factorization opportunities — full `data-ui` sweep — _OpenCode (kimi-k2.6)_
3. FK label resolution — `fkLabels` deep-dive — _opencode (qwen3.6-plus)_
4. Record identity normalization should move into `machine` — _GitHub Copilot CLI (GPT-5.4)_
5. `MachineSchemeValues.presentation()` already exists — four call sites don't use it + latent `machine.store('')` bug — _GitHub Copilot CLI (Claude Sonnet 4.6)_

---

## 0. Execution order + locked decisions

**Author:** Claude Opus 4.8 (Claude Code)
**Date:** 2026-05-31
**Status:** Synthesis header. **Sections §1–§5 are DIAGNOSIS, not a build order.** They
were written independently and their proposed APIs overlap and, in one case (§3),
conflict with the chosen design. Execute in the phases below. Do **not** implement a
section in isolation.

### Why this header exists

The five notes converge on one conclusion — *push schema/FK/label/identity logic out
of the components into `MachineSchemeValues`/`MachineScheme`* — but each proposes its
own entry points. Built literally and in parallel, they would stack overlapping
methods (`format`, `presentation`, `resolveFkLabels`, `resolveFkLabel`, `displayValue`)
on the same class — the symptom-driven helper stacking the project explicitly rejects.
This header locks the shape and the order so that doesn't happen.

### Locked design decisions

1. **`MachineSchemeValues.presentation(record)` is THE label primitive.** It already
   exists (§5) and already handles dot-notation + type-aware formatting. Every label
   need delegates to it. Do not reimplement split/map/filter/join anywhere.

2. **One unified field resolver, not a family of `resolveFk*` methods.** §3 proposes
   `resolveFkLabels()` + `resolveFkLabel()` as separate FK-only methods. **Superseded.**
   Instead, a single descriptor-driven pair on `MachineSchemeValues`:
   - `descriptor(fieldName)` → resolved `{ kind: 'scalar'|'fk', fieldName, fieldType, title, fkCollection?, fkIndexField? }`. This is the machine-native equivalent of the legacy `columnModel[]` entry: the scalar-vs-fk divergence is decided **here, once**, never in a component.
   - `displayValue(fieldName, data, resolve?)` → routes internally to `format()` (scalar) or `presentation(targetRecord)` (fk). Components call this; they do not branch on FK-ness.

   Rationale: the legacy engine had **one** homogeneous column model + **one** dumb
   render path (`tag_elem_table_field` reading `row[field_name]`), with the field/fk
   divergence resolved upstream. A family of `resolveFk*` methods re-segments what the
   legacy unified. Keep it unified.

3. **Two distinct FK labels — do NOT collapse them.** This is the legacy
   `columnModel` distinction (`title` vs `field_name` value) and the most common way
   to get FK display wrong:
   | role | source | legacy field |
   |------|--------|--------------|
   | **column/field title** | `appscheme.name` of the target collection | `title` |
   | **displayed value** | `presentation(targetRecord)` of the pointed record | `row[nom{Collection}]` |
   `descriptor.title` carries the first; `displayValue(...)` produces the second. A
   component must never use the collection name where the record presentation is meant,
   or vice-versa. (See `LEGACY_FIELD_FK_MODESWITCH.md` for the legacy proof.)

4. **FK target matching goes through record-identity normalization (§4).** Any
   `items.find(i => i[indexField] === value)` is wrong as written — `'42' !== 42`.
   `displayValue`'s `resolve` callback and every FK lookup must match via the
   `MachineRecordIdentity` helper, not raw `===`.

5. **Reuse the existing pure utils.** `parseFkType()` (`data-utils.ts`) is the single
   source of FK-type syntax — `descriptor()` calls it, no component re-splits `'fk-'`.

### Phases (foundation → leaf). Each phase blocks the next where noted.

**Phase 0 — primitives (no behavior change, unblock everything)**
- P0.1 `machine.collectionOr(name)` non-throwing scheme getter → removes `safeScheme`/`safeCollection` try/catch in 10+ files (§2.1, §1.1).
- P0.2 `MachineRecordIdentity` — key normalization + `recordMatchesIndex` (§4).

**Phase 1 — label/FK core (BLOCKED until Phase 0 done) — owner: careful/single-threaded**
- P1.1 Confirm `presentation()` as the delegate; migrate the 4 non-users (§5: `DataList.renderPresentation`, `DataList` FK group labels, `InputSelect.getLabel`, `DataField.fkLabel`).
- P1.2 Build `descriptor()` + `displayValue()` per locked decision #2/#3.
- P1.3 Collapse the FK blocks in `DataField` / `DataFkValue` / `DataRecord` onto the descriptor; fix the `machine.store('')` phantom subscription (§5).
- P1.4 `scheme.resolveFieldList({view, showFields, sortBy, groupBy})` + `DataRecord` field-pipeline collapse (§1.2, §3 field-list).

**Phase 2 — leaf cleanups (independent, parallelizable, any time, delegable)**
- Merge `DataListFk`+`DataListRfk` (§2.3) · `DataList` render snippet (§2.6) · input-atom hardcoded colours → tokens (§2.4) · retire `Confirm.svelte` (§2.5) · split/clean `InfoLine` (§2.10) · `Dialog` css module (§2.12) · empty/stub files (§2.11) · move `getByPath` to utils (§2.9) · `useMachinePrefs` rune (§2.7).

### One-line guidance per question

- **When to run a factorization item?** In phase order. Never a §-section in isolation.
- **When does the descriptor/FK work happen?** It *is* Phase 1 — not a separate task. Phase 0 first.
- **Reading §3?** Its `resolveFk*` API is superseded by decision #2. Use the descriptor.

---

## 1. Full solidity analysis of `DataRecord.svelte`

**Author:** Claude Opus 4.8 (Claude Code)
**Topic:** whole-component review — `src/lib/data-ui/data/DataRecord.svelte`
**Date:** 2026-05-31
**Status:** Frames the whole component. The `queryId` point detailed in §4 (Copilot) still stands; this widens the scope to the rest of the component.

### Premise (user's claim)

> "Not solid. Too many different methods, too much compute, too much treatment. In a component, code should be minimal — the essence resting on machine methods."

Agreed. `DataRecord.svelte` currently mixes **four distinct responsibilities** in the `<script>`. A record renderer should do one thing: take a resolved record + a resolved field list, render fields. Everything else is schema/domain logic that belongs in `machine`.

### Responsibility inventory (what the component does today)

| # | Concern | Lines | Belongs in component? |
|---|---------|-------|------------------------|
| 1 | Resolve scheme (`safeScheme` try/catch) | 46–50 | No — `machine` should hand back a safe scheme or null |
| 2 | Normalize record key + reactive read | 57–69 | No — see Copilot note §4 (record identity) |
| 3 | Build/sort/group the field list (view → keys → objects → sort → group) | 72–97 | No — view resolution is schema logic |
| 4 | Resolve FK labels from `appscheme` store | 99–119 | No — this is the heaviest leak; pure domain |
| 5 | Render | 127–173 | **Yes** — this is the only part that should remain |

Roughly **80 lines of script for ~45 lines of markup.** Inverted ratio.

### Specific weaknesses

1. **`safeScheme` try/catch in the component.** A UI component swallowing exceptions from `machine.logic.collection()` is a smell. `machine` should expose a non-throwing resolver (`machine.logic.collectionOr(name, null)` or make `.collection()` return null for unknown). The component shouldn't know that resolution can throw.

2. **Field-list pipeline (3) is rebuilt locally.** `showFields` vs `view` vs `Object.keys` branching, then `.filter(k => k in fields)`, then `.map(key => ({key, ...field}))`, then `sortItems`, then `groupItems`. This is a **view-resolution + projection** algorithm living in a render component. Any other component that needs "the fields for this view, sorted, grouped" reimplements it. It should be one machine call:
   ```ts
   machine.logic.collection(name).resolveFieldList({ view, showFields, sortBy, groupBy })
   // → { fieldObjects, groups?, fieldNames }
   ```
   `getFieldsForView` already exists on `MachineScheme` (line 109) — this just finishes the job the scheme started, instead of finishing it in the component.

3. **FK-label block (4) is the worst offender.** The component:
   - checks `'appscheme' in machine.logic.model`
   - reads the whole `appscheme` store
   - for each field, calls `parseFkType` on `scheme.field(name).parse().fieldType`
   - linear-scans `appschemeItems.find(i => i.code === fk.collection)` per field (O(fields × appscheme))
   This is pure schema/relationship metadata resolution. A component should never reach into another collection's store to compute a label. Belongs in machine:
   ```ts
   machine.logic.collection(name).fkLabels(fieldNames) // → Map<field, label>
   ```
   Bonus: machine can memoize the `code → name` index instead of re-scanning per field per render. (Deep-dive in §3, qwen.)

4. **Three `$inspect` calls (121–124).** Kept intentionally — author's dev instrumentation. Leave as-is.

5. **Duplicated render branch.** The `view==='fk'` branch (148–156) and the default branch (157–173) and the grouped branch (127–147) repeat the same `mode==='show' ? show : bind` field-emit logic three times. Once the field list + labels come pre-resolved from machine, these collapse toward a single `{#each}` with a `{#snippet}` for the field cell.

6. **`mode !== 'show' || (effectiveData != null && fieldName in effectiveData)` guard repeated twice** (135, 161). This is the "show only present fields" contract from CLAUDE.md §4. Fine as a rule, but it should be a derived `visibleFieldNames` (computed once), not an inline predicate duplicated in markup.

### Target shape

Component script should shrink to roughly:

```ts
const scheme = $derived(machine.logic.collectionOr(collection, null));
const record = $derived(data ?? machine.recordStore(collection, collectionId)?.items?.[0]);
const list   = $derived(scheme?.resolveFieldList({ view, showFields, sortBy, groupBy }));
const fkLabels = $derived(view === 'fk' ? scheme?.fkLabels(list.fieldNames) : undefined);
const visible  = $derived(filterVisible(list.fieldNames, record, mode)); // or machine helper
```

Five derives, no try/catch, no store-reaching, no per-field scans. Markup keeps the three layout branches but each just iterates a pre-resolved list. (`$inspect` calls stay.)

### Machine methods to introduce (consolidated)

| New machine API | Replaces in component |
|-----------------|------------------------|
| `machine.logic.collectionOr(name, fallback)` | `safeScheme` try/catch (46–50) |
| `machine.recordStore(collection, id)` (key-normalizing) | `queryId` + `recordStore` (57–66) — **same as Copilot note §4** |
| `scheme.resolveFieldList({view, showFields, sortBy, groupBy})` | field pipeline (72–97) |
| `scheme.fkLabels(fieldNames)` | FK label block (99–119) |

### Verdict

User is right. The component is solid in *behavior* but wrong in *layering*: it carries ~4 schema-aware algorithms that other components will need too, so each leak is also a future duplication. Moving them behind `machine`/`MachineScheme` methods would cut the script by ~60%, make the logic unit-testable without mounting Svelte, and leave `DataRecord` as a thin renderer — which is what it should be.

Priority order: (4) FK labels → (3) field list → (1) safe scheme → (2) record identity (detailed in §4, Copilot). Dup render branches (5) are a free cleanup, do first. `$inspect` calls left untouched on author's request.

---

_Signed: Claude Opus 4.8 (Claude Code)_

---

## 2. Additional factorization opportunities — full `data-ui` sweep

**Author:** OpenCode (kimi-k2.6)
**Date:** 2026-05-31
**Status:** Widens the lens from one component to the whole directory. These are new patterns found by reading every file under `src/lib/data-ui/`; they subsume the per-component points in §1, §3, §4.

### 1. `safeCollection` / `safeScheme` try/catch is duplicated in 10+ files

**Location:** `DataRecord.svelte:46`, `DataField.svelte:39`, `DataFkValue.svelte:28`, `DataList.svelte:371`, `DataForm.svelte:119`, `DataListFk.svelte:28`, `DataListRfk.svelte:28`, `DataFind.svelte:39`, `DataGroup.svelte:46`, `InputSelect.svelte:37`, and more.

**Problem:** The exact same `try { return machine.logic.collection(name) } catch { return null }` pattern is copy-pasted everywhere. It is not a component concern; it is a defensive schema-access utility.

**Recommendation:** Add a single non-throwing getter to `machine.logic` (or expose `machine.collectionOr(name)` / `machine.safeCollection(name)`). Replace every local `safeCollection`/`safeScheme` with the shared call. This is the highest-ROI mechanical refactor — removes ~30 lines of identical boilerplate across the directory.

---

### 2. Presentation-field label resolution is duplicated in 5+ places

**Location:** `DataField.svelte:85-104`, `DataList.svelte:208-212 & 277-286 & 346-357`, `InputSelect.svelte:43-54`, `DataFkValue.svelte:45-51`.

**Problem:** The algorithm `(template.presentation ?? 'name').split(' ').filter(Boolean).map(f => item[f]).filter(v => v != null && v !== '').join(' ')` (or variants) is repeated everywhere a human-readable label is needed from a record. `DataList.svelte` even re-implements it inline for FK grouping label construction.

**Recommendation:** Centralise in `MachineSchemeValues.presentation(item)` or a pure util `formatPresentation(record, template?)`. `InputSelect.getLabel`, `DataField.fkLabel`, `DataList.renderPresentation`, and `DataFkValue.value` should all delegate to this one helper. This removes ~40 lines of duplicated string manipulation and guarantees consistent label formatting across list / form / FK / table views.

---

### 3. `DataListFk.svelte` and `DataListRfk.svelte` are ~95 % identical

**Location:** `src/lib/data-ui/data/DataListFk.svelte` and `DataListRfk.svelte`.

**Problem:** Both files share the exact same props interface, `safeCollection`, `sourceStore`, `record` derivation, `recordLookupSettled` effect, `recordState`, and markup (loading / absent / relation iteration). The only difference is the imported resolver: `resolveForwardRelations` vs `resolveReverseRelations`.

**Recommendation:** Merge into a single `DataListRelations.svelte` with a `direction: 'forward' | 'reverse'` prop (or derive from a boolean `reverse`). The current wrappers can become thin re-exports for backward compatibility, or be removed after migration. This halves the maintenance surface for relation lists.

---

### 4. Input atoms (`InputCurrency`, `InputEmail`) use hardcoded colours, not design tokens

**Location:** `InputCurrency.svelte:88-94`, `InputEmail.svelte:66-70`.

**Problem:** Hex values (`#ced4da`, `#007bff`, `#dc3545`, `#e9ecef`, `#6c757d`) are baked into the `<style>` blocks. The project convention (CLAUDE.md §7) mandates `@medyll/css-base` tokens (`var(--color-border)`, `var(--color-primary)`, etc.).

**Recommendation:** Migrate all raw hexes to the corresponding CSS custom properties. This is a style-layer factorization: it centralises theming and enables dark-mode support automatically. Same check should be applied to `TableInline.svelte` (e.g. `#D1E8FF`, `#E4F0FB`) and `Selector.svelte` (`#737373`).

---

### 5. `DataFieldEdit.svelte` and `Confirm.svelte` implement the same toggle-confirm pattern

**Location:** `DataFieldEdit.svelte` (full implementation) vs `Confirm.svelte` (older, stubbier).

**Problem:** Both components model a two-state UI (`default` ↔ `show_confirm`) with confirm/cancel buttons. `DataFieldEdit.svelte` is the modern Svelte 5 version (snippets, proper types). `Confirm.svelte` still uses legacy patterns (`export` alias, hardcoded snippets, mixed French/English labels) and appears unmaintained.

**Recommendation:** Retire `Confirm.svelte`. Any consumer can use `DataFieldEdit.svelte` directly (or rename it to a generic `ConfirmAction.svelte` if the name matters). If `Confirm.svelte` is still imported somewhere, replace the import; then delete the file. This removes a duplicate concept and a stale component.

---

### 6. `DataList.svelte` item-rendering markup is copy-pasted three times

**Location:** `DataList.svelte` lines 436-450 (grid), 459-475 (grouped list), 476-494 (flat list).

**Problem:** The `{#if itemSnippet} … {:else if parsedLink} … {:else} …` branching is repeated for grid items, grouped items, and flat items. Any change to link behaviour or default record rendering must be edited in three places.

**Recommendation:** Extract an `{#snippet renderItem(record)}` that contains the branch logic once. Each `{#each}` then simply calls `{@render renderItem(record)}`. Same for the empty-state snippet. This is a pure template-level DRY refactor.

---

### 7. Pref hydration / persistence logic in `DataList.svelte` should become a reusable rune

**Location:** `DataList.svelte` lines 126-183.

**Problem:** The `hydrate from appuser_prefs → reactive state → persist back` cycle is a generic user-preference pattern. It is currently inlined inside `DataList`, making it unavailable to `DataForm` (form layout prefs), `DataGroup` (last groupBy), or `DataSort` (last sortBy) without duplication.

**Recommendation:** Extract a `useMachinePrefs(scope, defaults)` rune (e.g. in `src/lib/data-ui/utils/useMachinePrefs.svelte.ts`) that returns `{ value, setValue, hydrated }`. `DataList` would shrink by ~60 lines and other components could gain persistence for free.

---

### 8. `fkCollection` / `fkTargetIndex` parsing in `DataField.svelte` reinvents `parseFkType`

**Location:** `DataField.svelte:67-76`.

**Problem:** `DataField` manually parses `'fk-...'` with `.startsWith('fk-')` and `.split('.')`, while `DataFkValue.svelte` and `data-utils.ts` already expose a pure, tested `parseFkType()` doing the exact same job.

**Recommendation:** Replace the manual parsing in `DataField.svelte` with a call to `parseFkType(fieldForge?.fieldType)`. This removes 10 lines of duplicate string logic and ensures a single source of truth for FK type syntax.

---

### 9. `getByPath` in `DataList.svelte` is a generic utility living in a component

**Location:** `DataList.svelte:220-228`.

**Problem:** `getByPath(obj, path)` is a pure, framework-agnostic object accessor. It is only used for presentation rendering today, but it is a general utility.

**Recommendation:** Move to `data-utils.ts` (or `src/lib/utils/object.ts`). This keeps components focused on UI concerns.

---

### 10. `InfoLine.svelte` has dead / contradictory branches and mixed responsibilities

**Location:** `InfoLine.svelte:34-59`.

**Problem:** The `{:else if input && !title}` branch renders `{title}` despite `!title` being true, so it always prints an empty string. The `{#if label}` branch duplicates a label/value row that is unrelated to the `title/input/children` structure below. The component tries to be three different widgets at once (label/value row, titled input row, generic children wrapper) without clear separation.

**Recommendation:** Split into two focused components:
- `KeyValueLine.svelte` for the `{label}/{value}` use case.
- `TitledSlot.svelte` for the `title + input/children/titleButton` use case.
If both are needed in the same place, compose them rather than branching internally. This removes the dead branch and clarifies the API.

---

### 11. `RecordToolbar.svelte` is empty and `RecordCreate.svelte` is a stub

**Location:** `controls/RecordToolbar.svelte` (0 bytes), `controls/RecordCreate.svelte` (1 line).

**Problem:** Empty / placeholder files add noise to the barrel exports and confuse contributors. They are not referenced in `index.ts`, but they sit in the source tree.

**Recommendation:** Either implement them (e.g. `RecordToolbar` wrapping `DataToolbar` with record-specific actions; `RecordCreate` as a button that opens a create form) or remove them. If kept as placeholders, add a `<!-- TODO: implement ... -->` comment so the intent is explicit. This is more of a housekeeping note than a deep factorization, but it reduces surface area.

---

### 12. `Dialog.svelte` styles rely on `:global(...)` for every rule

**Location:** `Dialog.svelte:158-229`.

**Problem:** Because the dialog is mounted on `document.body`, Svelte's scoped styles do not apply. The workaround is `:global(dialog.idae-dialog)` wrappers on every selector. This is verbose and couples the component to a global class name.

**Recommendation:** Two options:
1. Keep the global styles but move them to a dedicated `dialog.css` (or `dialog.postcss`) module imported by `Dialog.svelte`. This removes the visual noise of `:global(...)` wrappers and makes the stylesheet easier to lint.
2. Or, scope the dialog by rendering it inside a shadow-host wrapper so that normal Svelte scoped CSS works. This is a larger change, but it would eliminate the need for `:global` entirely.
Option 1 is the pragmatic factorization.

---

### Summary priority (OpenCode view)

| Rank | Factorization | Effort | Impact |
|------|---------------|--------|--------|
| 1 | `safeCollection` / `safeScheme` → machine helper | Low | High (removes ~30 lines × 10 files) |
| 2 | `DataListFk` + `DataListRfk` → single component | Low | High (halves relation-list code) |
| 3 | Presentation label algorithm → shared helper | Low | High (5 call sites, consistent UX) |
| 4 | FK label resolution → machine (deep-dive in §3) | Medium | High |
| 5 | `useMachinePrefs` rune extraction | Medium | Medium (enables other components) |
| 6 | `DataList` item rendering → snippet | Low | Medium (3× duplication) |
| 7 | `parseFkType` usage in `DataField` | Low | Low (cleanup) |
| 8 | Input atom hardcoded colours → tokens | Low | Medium (design-system compliance) |
| 9 | `Confirm.svelte` retirement | Low | Low (cleanup) |
| 10 | `InfoLine` split / dead-branch removal | Medium | Low (clarity) |

---

_Signed: OpenCode (kimi-k2.6)_

---

## 3. FK label resolution — `fkLabels` in `DataRecord.svelte`

**Author:** opencode (qwen3.6-plus)
**Topic:** `fkLabels` derived block — `src/lib/data-ui/data/DataRecord.svelte:108–119`
**Date:** 2026-05-31
**Status:** Deep-dive on the FK-label leak flagged as the worst offender in §1 (Claude) and ranked #4 in §2 (kimi).

### The question

> `fkLabels` in `DataRecord.svelte` — is this the right place? Factorizable? Reinvention of machine methods?

Short answer: **no, it's not the right place, yes it's factorizable, and yes it reinvents logic that already exists (and is duplicated) elsewhere.**

### What the block does (lines 108–119)

```ts
const fkLabels = $derived.by(() => {
  const map = new Map<string, string>();
  if (view !== 'fk' || !scheme) return map;
  for (const fieldName of fieldNames) {
    const fk = parseFkType(scheme.field(fieldName).parse()?.fieldType as string | undefined);
    if (!fk) continue;
    const meta = appschemeItems.find(i => i.code === fk.collection);
    map.set(fieldName, String(meta?.name ?? fk.collection));
  }
  return map;
});
```

For each FK field in the view, it resolves the target collection name from the field type, looks up the `appscheme` entry by `code`, and returns the human-readable `name`.

### Three levels of duplication

#### 1. Same component, same pattern — `DataFkValue.svelte`

`DataFkValue` (lines 28–34) repeats the exact same `safeScheme` + `parseFkType` pattern to resolve the FK target:

```ts
function safeScheme(name: string) {
  try { return machine.logic.collection(name); } catch { return null; }
}
const scheme    = $derived(collection ? safeScheme(collection) : null);
const fieldType = $derived(scheme?.field(fieldName).parse()?.fieldType);
const fk        = $derived(parseFkType(fieldType));
```

Same try/catch, same `parseFkType` call, same field-type introspection. Two components, identical glue.

#### 2. `DataField.svelte` — FK label resolution (lines 95–104)

`DataField` already resolves FK labels for inline display:

```ts
const fkLabel = $derived((() => {
  if (!fkCollection || internalValue == null) return '—';
  const item = fkItems.find(i => i[fkIndexField] === internalValue);
  // ...presentation fields join...
})());
```

This is a **different** label (the target record's presentation value, not the collection name from `appscheme`), but the structural pattern is identical: resolve FK metadata → look up target → format a label. The framework has no unified "FK label" abstraction — each component rolls its own.

#### 3. `fkObjectLabel` in `data-utils.ts` (lines 84–94)

A fourth variant exists as a pure utility that reads pre-joined FK objects from `item.gridFks` / `item.fks`. It's a different data path (embedded objects vs store lookup vs appscheme metadata), but again: **label resolution for FK fields** scattered across three files with three different signatures.

### Why this belongs in `machine`

The FK-label concern touches **schema metadata resolution**, which is a domain-layer responsibility:

| Concern | Current location | Why it leaks |
|---------|-----------------|--------------|
| Parse FK type from field definition | `data-utils.ts` (pure util) | OK as pure function, but called from 3+ components |
| Resolve `appscheme` entry by `code` | `DataRecord.svelte` | Component reads the whole `appscheme` store — domain concern |
| Linear scan `appschemeItems.find()` per field | `DataRecord.svelte:114` | O(fields × appscheme) per render, no memoization |
| `'appscheme' in machine.logic.model` guard | `DataRecord.svelte:102` | Component knows about model composition |
| FK presentation label from target record | `DataField.svelte:95–104` | Component resolves FK store + presentation template |
| FK object label from embedded `gridFks`/`fks` bag | `data-utils.ts:84–94` | Pure util, but no caller knows which path to pick |

A component should not decide **which** label source to use (appscheme name? presentation template? embedded object? raw value?). That decision depends on:
- whether `appscheme` exists in the model
- whether the FK value is a scalar (needs store lookup) or an embedded object
- whether the target scheme defines a `template.presentation`
- the display context (FK summary view vs inline field vs table cell)

### Recommended machine API

```ts
// On MachineScheme (or a new MachineFkResolver):

/**
 * Resolve human-readable labels for FK fields.
 * Returns a Map<fieldName, label> where label is resolved through the
 * appropriate path: appscheme.name > presentation template > raw collection key.
 */
scheme.resolveFkLabels(fieldNames: string[]): Map<string, string>

/**
 * Single-field variant — useful for DataField, DataFkValue, table cells.
 */
scheme.resolveFkLabel(fieldName: string, rawValue: unknown, record?: Record<string, unknown>): string
```

Internally, machine can:
1. Build a memoized `code → name` index from `appscheme` once (not per render)
2. Cache `parseFkType` results per field (field definitions don't change at runtime)
3. Choose the right label path (appscheme vs presentation vs embedded) based on model composition

### What gets deleted from components

| Component | Lines removed | Replaced by |
|-----------|--------------|-------------|
| `DataRecord.svelte` | 99–124 (26 lines) | `scheme.resolveFkLabels(fieldNames)` |
| `DataFkValue.svelte` | 28–52 (25 lines) | `scheme.resolveFkLabel(fieldName, data[fieldName], data)` |
| `DataField.svelte` | 75–104 (30 lines) | `scheme.resolveFkLabel(fieldName, internalValue)` |

That's **~80 lines of duplicated FK resolution glue** across 3 components, replaced by 1–2 machine calls each.

### Priority

This is the **highest-priority factorization** in the current `DataRecord` analysis because:
1. It's the heaviest domain leak (store-reaching, model introspection, O(n×m) scans)
2. It's duplicated in 3 components with 3 different patterns
3. It's the most likely to cause inconsistencies (different label resolution = different UX across list/form/FK views)
4. Moving it to machine makes it unit-testable without mounting any component

Do this before the field-list pipeline factorization — the FK label concern is more urgent because it actively duplicates behavior that can diverge.

---

_Signed: opencode (qwen3.6-plus)_

---

## 4. Record identity normalization should move into `machine`

**Author:** GitHub Copilot CLI (GPT-5.4)
**Topic:** `queryId` in `src/lib/data-ui/data/DataRecord.svelte`
**Status:** Initial note that opened this log; deep-dive on responsibility #2 from §1. Intended for later annotation by other LLMs.

### Summary

The current `queryId` logic in `DataRecord.svelte` is functionally useful, but it is implemented at the wrong layer.
It represents a cross-cutting concern: normalizing a record identifier coming from routing or frame state before querying reactive or imperative data sources.

This should be factorized into a shared `machine` module instead of being handled ad hoc inside UI components.

### Why this matters

`collectionId` frequently travels through the app as a string because it comes from URL parsing and frame navigation.
However, record access may target a numeric primary key such as `id`.
Without normalization, lookups can fail because `'42'` and `42` are not always treated the same by the storage/query layer.

So the local logic is not accidental glue; it is a real architectural responsibility.

### Current duplication

This concern is already visible in several places:

- `src/lib/data-ui/data/DataRecord.svelte` normalizes `collectionId` before `machine.store(...)`
- `src/lib/main/machine.ts` re-normalizes `collectionId` in `_renderLabel()`
- `src/lib/shell/frame/synthesis/Synthesis.svelte` works around the same problem by comparing IDs through `String(...)`
- `src/lib/main/router/urlParser.ts` emits route/frame identifiers as strings
- `src/lib/shell/Frame.svelte` carries `collectionId` as a string-oriented navigation value

This indicates a real factorization opportunity, not an isolated cleanup.

### Architectural diagnosis

The UI layer should not decide how a record key is normalized.
That decision depends on domain/schema concerns:

- what the effective index field is
- whether the key should be treated as a number or a string
- how matching should behave consistently across reactive and imperative reads

Because of that, the right owner is `machine`, not `DataRecord`.

### Recommended extraction

Create a dedicated shared module under `src/lib/main/machine/`, for example:

- `MachineRecordIdentity.ts`
- or `MachineRecordRef.ts`

Possible API shape:

```ts
normalizeRecordKey(raw: unknown): string | number | undefined
buildRecordWhere(indexName: string | undefined, raw: unknown): Record<string, unknown> | null
recordMatchesIndex(record: Record<string, unknown>, indexName: string, raw: unknown): boolean
```

The exact names can change, but the concept should be explicit:
this is not just "queryId", it is shared record identity normalization and matching.

### Expected benefits

- removes type-conversion logic from UI components
- keeps `machine.store(...)` and `machine.collection(...).get(...)` aligned
- avoids repeated `String(...)` workarounds
- makes the behavior testable in one place
- improves naming clarity and architectural consistency

### Recommendation

This factorization is worth doing now.
It is not only about DRY; it is about moving a schema-aware lookup concern to the correct layer of the system.

---

_Signed: GitHub Copilot CLI (GPT-5.4)_

---

## 5. `MachineSchemeValues.presentation()` already exists — four call sites don't use it

**Author:** GitHub Copilot CLI (Claude Sonnet 4.6)
**Topic:** Presentation label generation — `DataList.svelte`, `DataField.svelte`, `InputSelect.svelte` + latent `machine.store('')` bug
**Date:** 2026-05-31
**Status:** Supplements §2.2 (kimi). The canonical label abstraction already exists and is already used in one place. This section names the five call sites, shows which one uses it correctly, documents what the four non-users are missing, and surfaces a latent reactive bug in `DataField.svelte` that was not noted elsewhere.

### The abstraction that already works

`MachineSchemeValues.presentation(data)` (`src/lib/main/machine/MachineSchemeValues.ts:42–71`) does the complete job:

1. Reads `scheme.template.presentation` (splits on whitespace)
2. Handles **dot-notation paths** (`fks.firm.name`, `address.city`) via `.reduce()` traversal
3. Applies **field-type-aware formatting** via `MachineSchemeFieldType.format()` for non-dot tokens
4. Filters empty values, joins with a space
5. Returns `''` on any schema error (never throws into a component)

`DataFkValue.svelte:50` already uses it correctly:

```ts
const presented = fkScheme?.collectionValues.presentation(target) ?? '';
return presented || String(target[fk.targetIndex] ?? rawValue);
```

That is the pattern. Everything below should do the same.

---

### The four sites that don't

#### 1. `DataList.svelte` — `renderPresentation()` (lines 277–286)

```ts
const presentationFields = $derived(
    collLogic?.template?.presentation
        ? (collLogic.template.presentation as string).split(/\s+/).filter(Boolean)
        : undefined
);
function renderPresentation(record: Record<string, unknown>): string {
    if (!presentationFields?.length) return '';
    return presentationFields
        .map(tok => { const v = getByPath(record, tok); return v == null ? '' : String(v); })
        .filter(Boolean).join(' ');
}
```

**What's missing:**
- Calls `getByPath` separately instead of using the built-in dot-notation in `presentation()`
- Does **not** apply `MachineSchemeFieldType.format()` — dates, booleans, currencies render as raw strings
- Requires `getByPath` to be defined locally (the utility flagged in §2.9)

**Fix:**

```ts
function renderPresentation(record: Record<string, unknown>): string {
    return collLogic?.collectionValues.presentation(record) ?? '';
}
```

`presentationFields` and `getByPath` can both be deleted.

---

#### 2. `DataList.svelte` — FK group label resolution (lines 344–357)

```ts
const fkPresentationFields = (fkScheme?.template?.presentation ?? 'name').split(' ').filter(Boolean);
const fkItems = machine.store(fkCollection).items as Record<string, unknown>[];
for (const item of fkItems) {
    const id = item[fkIndexField];
    const label = fkPresentationFields
        .map((f: string) => item[f])
        .filter((v: unknown) => v !== undefined && v !== null && v !== '')
        .join(' ');
    labelMap.set(id, label || String(id ?? '—'));
}
```

Same partial reimplementation — split, map, filter, join — without type-aware formatting or dot-notation support. The `labelMap` construction loop should use:

```ts
for (const item of fkItems) {
    labelMap.set(item[fkIndexField], fkScheme?.collectionValues.presentation(item) || String(item[fkIndexField] ?? '—'));
}
```

---

#### 3. `InputSelect.svelte` — `getLabel()` (lines 43–53)

```ts
const presentationFields = $derived(
    (scheme?.template?.presentation ?? 'name').split(' ').filter(Boolean)
);
function getLabel(item: Record<string, unknown>): string {
    return presentationFields
        .map((f) => item[f])
        .filter((v) => v !== undefined && v !== null && v !== '')
        .join(' ') || String(item[indexField] ?? '—');
}
```

Same pattern again — and specifically **missing dot-notation support**, so `fks.firm.name`-style presentation templates silently produce empty option labels. Fix:

```ts
function getLabel(item: Record<string, unknown>): string {
    return scheme?.collectionValues.presentation(item) || String(item[indexField] ?? '—');
}
```

`presentationFields` derived can be removed.

---

#### 4. `DataField.svelte` — `fkLabel` (lines 85–104)

```ts
const fkPresentationFields = $derived(
    (fkScheme?.template?.presentation ?? 'name').split(' ').filter(Boolean)
);
const fkLabel = $derived((() => {
    if (!fkCollection || internalValue === undefined || internalValue === null) return '—';
    const item = (fkItems as Record<string, unknown>[]).find(i => i[fkIndexField] === internalValue);
    if (!item) return String(internalValue);
    const label = fkPresentationFields
        .map((f: string) => item[f])
        .filter((v: unknown) => v !== undefined && v !== null && v !== '')
        .join(' ');
    return label || String(item[fkIndexField] ?? '—');
})());
```

The `fkItems.find()` linear scan + manual presentation join can collapse to:

```ts
const fkLabel = $derived.by(() => {
    if (!fkCollection || internalValue == null) return '—';
    const item = (fkItems as Record<string, unknown>[]).find(i => i[fkIndexField] === internalValue);
    if (!item) return String(internalValue);
    return fkScheme?.collectionValues.presentation(item) || String(item[fkIndexField] ?? '—');
});
```

`fkPresentationFields` can be removed.

---

### Latent bug in `DataField.svelte` — `machine.store('')`

**Location:** `DataField.svelte:93`

```ts
const fkStore = $derived(machine.store(fkCollection ?? ''));
```

When `fkCollection` is `null` (the field is not an FK), this calls `machine.store('')`. The empty string is not a valid collection name. Depending on qoolie's internal behavior this either:
- silently creates a reactive subscription to a phantom collection name, wasting memory and triggering unnecessary reactive updates every time any collection changes
- or throws an error swallowed silently by qoolie, leaving `fkStore.items` as `[]`

The correct pattern — already used in `DataFkValue.svelte:38–42` — guards the store call:

```ts
const fkStore  = $derived(fkCollection ? machine.store(fkCollection) : { items: [] as Record<string, unknown>[] });
const fkItems  = $derived(fkStore.items as Record<string, unknown>[]);
```

This is a behavioral correctness issue, not just a factorization: non-FK fields currently subscribe to a reactive store they should never touch.

---

### Summary

| Site | Lines | Bug? | Fix |
|------|-------|------|-----|
| `DataList.renderPresentation` | 208–286 | No | `collectionValues.presentation(record)` + delete `getByPath`, `presentationFields` |
| `DataList` FK group labels | 344–357 | No | `fkScheme.collectionValues.presentation(item)` in loop |
| `InputSelect.getLabel` | 43–54 | Silent (dot-notation silently empty) | `scheme.collectionValues.presentation(item)` |
| `DataField.fkLabel` | 85–104 | No | `fkScheme.collectionValues.presentation(item)` |
| `DataField` `machine.store('')` | 93 | **Yes** — phantom subscription | Guard with `fkCollection ? machine.store(...) : { items: [] }` |

The canonical proof is `DataFkValue.svelte:50` — it already does this correctly. The other four sites should mirror it.

---

_Signed: GitHub Copilot CLI (Claude Sonnet 4.6)_
