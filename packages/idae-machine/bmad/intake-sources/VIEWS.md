# View System

> Implemented 2026-05-30 (claude-opus-4-8). Reflects shipped code.
> History: this file began as a 4-author analysis; that accretion is superseded.

---

## 0. Principle

A **view is only a list of fields** — no layout, formatting, component, or screen.
Views are decoupled from templates/screens. `template.presentation` is a SEPARATE
legacy display string, **not** a view; it remains a fallback only.

---

## 1. The views

**Partition** by FK-ness — disjoint, `full = flat ∪ fk`:

| View | Membership |
|------|------------|
| `full` | all fields, incl. FKs |
| `flat` | non-FK fields only |
| `fk`   | FK fields only |

**Curated subset** — orthogonal, NOT part of the partition:

| View | Membership |
|------|------------|
| `focus` | group `identification` fields; fallback `[code, name]` (≥ `[code]`) |

Partition views are functions of the field set → **derivable**, no
`appscheme_view` rows strictly required. `focus` derives from the field `group`
(plumbed through `getModel`); when no identification field exists it degrades to
`[code, name]`. Seeded rows act as explicit overrides.

### Code/name solidification (upstream invariant)

Every collection exposes **both** `code` and `name`. `getModel()` coalesces: if
only `code` exists → `name := code`; if only `name` → `code := name`. So `focus`'s
fallback and FK labels can always rely on both. `code` is guaranteed by the global
invariant; `name` is not — the coalescing closes that gap.

---

## 2. Runtime chain

```
appscheme_view + appscheme_view_type   (MongoDB, seeded by deployModel.ts)
        ↓
server/src/MachineServer.ts  getModel()
        ↓  _viewTypeToKey(view_type.code) → 'full'|'flat'|'fk'|'focus' (null = dropped)
        ↓  field defs carry `group`; code/name coalesced
        ↓  sort each view by `order`
        ↓
collectionModel._views : Partial<ViewFields>
        ↓
src/lib/main/machine/MachineScheme.ts  getFieldsForView(view)
        ↓  seeded _views[view] → else derive (fk-ness for full/flat/fk, group for focus)
        ↓
src/lib/data-ui/data/DataList.svelte   getFieldsForView('full')
```

| Step | File |
|------|------|
| view-type→key map | `server/src/MachineServer.ts` `_viewTypeToKey` |
| field def + group + code/name coalesce | `server/src/MachineServer.ts` `getModel` |
| `_views` build + sort | `server/src/MachineServer.ts` |
| getter + resolver | `src/lib/main/machine/MachineScheme.ts` `getFieldsForView` |
| consumers | `DataList.svelte`, `DataRecord.svelte` |
| seeding + `inferFieldGroup` | `server/src/bootstrap/deployModel.ts` |

---

## 3. Types (single shape, three locations)

`ViewFieldDef` is minimal — field identity + order, nothing presentational:

```ts
type ViewTypeCode = 'full' | 'flat' | 'fk' | 'focus' | (string & {});

interface ViewFieldDef { name: string; code: string; order?: number }

interface ViewFields {
  full?: ViewFieldDef[];
  flat?: ViewFieldDef[];
  fk?:   ViewFieldDef[];
  focus?: ViewFieldDef[];
  [key: string]: ViewFieldDef[] | undefined; // custom views
}
```

Defined in `src/lib/types/schema-types.ts` (canonical), mirrored in
`src/lib/types/machine-model.ts` and `server/src/models/AppScheme.ts`. The barrel
`src/lib/types/index.ts` excludes the `machine-model.ts` copies to avoid a clash.
`ViewOptions` was removed — formatting belongs to the template/screen layer.

---

## 4. Consumer coverage

| View | Built | Consumer |
|------|-------|----------|
| `full` | yes | `DataList.svelte` (default), `DataRecord.svelte` |
| `flat` | yes | `DataRecord.svelte` / `DataList view="flat"` |
| `fk`   | yes | `DataRecord.svelte` / `DataList view="fk"` |
| `focus` | yes | `DataRecord.svelte` / `DataList view="focus"` |

Both `DataList` and `DataRecord` accept a `view` prop
(`'full'|'flat'|'fk'|'focus'`, default `full`) plus an explicit `showFields`
override.

- `DataRecord`: `showFields` → `getFieldsForView(view)` (ordered) → all fields.
- `DataList`: `showFields` → `getFieldsForView(view)` → `presentationFields`
  (parsed from `template.presentation`).

FK labels in `InputSelect` still use `template.presentation` (not yet migrated
to `fk`).

---

## 5. What changed from the prior design

- `form` / `custom` removed — they are not view types. Custom views reachable
  only via the `[key: string]` index signature.
- Codes: partition `full` / `flat` / `fk` + curated `focus`. No back-compat — a
  fresh `deployModel` run rewrites the registry.
- The old non-fk view (once called `mini`) is now `flat`; the curated identity
  subset is `focus` (group `identification`, fallback `[code, name]`).
- Field defs carry `group` at runtime (`getModel`); `inferFieldGroup` reworked so
  identity fields (`code`/`name`/`label`/`title`…) land in `identification`.
- code/name coalesced upstream so both always exist.
- `ViewFieldDef` stripped to `{name, code, order}`; `ViewOptions` deleted.
- Central resolver `MachineScheme.getFieldsForView('full'|'flat'|'fk'|'focus')`
  owns lookup + derivation; consumers no longer re-implement fallback.

---

## 6. Open / next

1. **`InputSelect` FK labels** — migrate from `template.presentation` to the `fk`
   view (the remaining unmigrated consumer).
2. **Reactivity** — `_views` built once at model load; derivation covers most
   cases statelessly. Decide if runtime `appscheme_view` edits must refresh.
3. **`template.presentation` future** — permanent fallback, or retire once
   `InputSelect` migrates?
4. **User-configurable views** — per-user order/visibility in `appuser_prefs` —
   in scope? (Would be the main reason to keep `appscheme_view` rows.)

---

## 7. Tests

- `src/lib/main/machine/__tests__/viewFields.test.ts` — partition (`full`/`flat`/
  `fk`, `flat ∪ fk = full`) + `focus` subset + seeded-override-wins.
- `src/lib/main/api/__tests__/MachineApi.spec.ts` — scheme mock uses `full`.
- `server/src/__tests__/bootstrap.test.ts` — `appscheme_view_type` count = 3.
