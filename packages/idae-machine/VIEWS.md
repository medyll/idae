# View System

> Implemented 2026-05-30 (claude-opus-4-8). Reflects shipped code.
> History: this file began as a 4-author analysis; that accretion is superseded.

---

## 0. Principle

A **view is only a list of fields** — no layout, formatting, component, or screen.
Views are decoupled from templates/screens. `template.presentation` is a SEPARATE
legacy display string, **not** a view; it remains a fallback only.

---

## 1. The three canonical views

Partitioned purely by FK-ness (`mini ∪ fk = full`):

| View | Membership |
|------|------------|
| `full` | all fields, incl. FKs |
| `mini` | non-FK fields only |
| `fk`   | FK fields only |

Because they are functions of the field set, they are **derivable** — no
`appscheme_view` rows are strictly required for the defaults. Rows that do exist
act as explicit overrides (custom views / explicit ordering).

---

## 2. Runtime chain

```
appscheme_view + appscheme_view_type   (MongoDB, seeded by deployModel.ts)
        ↓
server/src/MachineServer.ts  getModel()
        ↓  _viewTypeToKey(view_type.code) → 'full' | 'mini' | 'fk' (null = dropped)
        ↓  sort each view by `order`
        ↓
collectionModel._views : Partial<ViewFields>
        ↓
src/lib/main/machine/MachineScheme.ts  getFieldsForView(view)
        ↓  seeded _views[view]  →  else derive by fk-ness
        ↓
src/lib/data-ui/data/DataList.svelte   getFieldsForView('full')
```

| Step | File | Lines |
|------|------|-------|
| view-type→key map | `server/src/MachineServer.ts` | 52-58 |
| `_views` build + sort | `server/src/MachineServer.ts` | 125-160 |
| getter + resolver | `src/lib/main/machine/MachineScheme.ts` | 96-118 |
| consumer | `src/lib/data-ui/data/DataList.svelte` | 211-215 |
| seeding (partition by `fk-`) | `server/src/bootstrap/deployModel.ts` | 56, 398-407 |

---

## 3. Types (single shape, three locations)

`ViewFieldDef` is minimal — field identity + order, nothing presentational:

```ts
type ViewTypeCode = 'full' | 'mini' | 'fk' | (string & {});

interface ViewFieldDef { name: string; code: string; order?: number }

interface ViewFields {
  full?: ViewFieldDef[];
  mini?: ViewFieldDef[];
  fk?:   ViewFieldDef[];
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
| `full` | yes | `DataList.svelte` (active) |
| `mini` | yes | none yet |
| `fk`   | yes | none yet (FK labels still use `template.presentation`) |

`DataList` order: `showFields` prop → `getFieldsForView('full')` →
`presentationFields` (parsed from `template.presentation`).

---

## 5. What changed from the prior design

- `form` / `custom` removed — they are not view types. Custom views reachable
  only via the `[key: string]` index signature.
- Codes renamed: `list`→`full`, `fk_label`→`fk` (`mini` unchanged). No back-compat
  — a fresh `deployModel` run rewrites the registry.
- Seeder now partitions by `fk-` field-type prefix instead of arbitrary slices.
- `ViewFieldDef` stripped to `{name, code, order}`; `ViewOptions` deleted.
- Central resolver `MachineScheme.getFieldsForView('full'|'mini'|'fk')` owns the
  lookup + fk-ness derivation; consumers no longer re-implement fallback.

---

## 6. Open / next

1. **`mini` consumer** — compact list/card rendering reads `mini`.
2. **`fk` consumer** — `InputSelect` FK labels read `fk` before
   `template.presentation`.
3. **Reactivity** — `_views` built once at model load; derivation covers most
   cases statelessly. Decide if runtime `appscheme_view` edits must refresh.
4. **`template.presentation` future** — permanent fallback, or retire once `fk`/
   `mini` consumers land?
5. **User-configurable views** — per-user order/visibility in `appuser_prefs` —
   in scope? (Would be the main reason to keep `appscheme_view` rows.)

---

## 7. Tests

- `src/lib/main/machine/__tests__/viewFields.test.ts` — partition (`full`/`mini`/
  `fk`, `mini ∪ fk = full`) + seeded-override-wins.
- `src/lib/main/api/__tests__/MachineApi.spec.ts` — scheme mock uses `full`.
- `server/src/__tests__/bootstrap.test.ts` — `appscheme_view_type` count = 3.
