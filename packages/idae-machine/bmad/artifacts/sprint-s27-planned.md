# Sprint 27 — Wire _views bout-en-bout

**Goal:** `getModel()` peuple `_views` depuis MongoDB → client reçoit les vues → Explorer les consomme pour piloter l'affichage par mode.

**Date:** planned (after S25 Explorer + S26 rename)
**Status:** planned

---

## Context

Infrastructure _views complète côté serveur depuis S8/S16:
- `appscheme_view_type` seedé (list/mini/form/custom/fk_label)
- `appscheme_view` peuplé par `deployModel()` (pivot appscheme × view_type × field)
- Types TS complets: `EntityViews`, `ViewFieldDef`, `AppScheme._views`

**Gap:** `MachineServer.getModel()` ne lit pas `appscheme_view` → `_views` absent du modèle retourné → client tourne sur `template.presentation` (fallback permanent).

## Target flow

```
deployModel()
  → MongoDB: appscheme_view rows (collection × view_type × field × order)
  
getModel()
  → query appscheme_view WHERE appscheme.code = collection
  → group by view_type.code
  → build _views: { list: [ViewFieldDef...], mini: [...], form: [...], fk_label: [...] }
  → MachineModel[collection]._views populated

client (machine.fetchSchema OR machine.init with model)
  → _views available on each collection

Explorer.svelte (S25)
  mode='list'    → _views.list    → columns to render
  mode='table'   → _views.list    → table headers
  mode='card'    → _views.form    → CardForm fields
  mode='actions' → _views.mini    → compact action rows

InputSelect (FK picker)
  → _views.fk_label → label fields for FK display
```

---

## Stories

### S27-01 — `getModel()` query + build `_views` (effort: M)

**File:** `server/src/MachineServer.ts`

**Acceptance:**
- After loading `appscheme` records, for each collection query `appscheme_view` joined with `appscheme_view_type` and `appscheme_field`
- Group by `view_type.code` → build `_views: Partial<EntityViews>`
- Each `ViewFieldDef`: `{ name, code, title, type, order, options }`
- `title` = field name humanized (or from appscheme_field.name if available)
- `_views` added to model entry alongside existing `fields`, `fks`, `template`
- `_views: {}` (empty object) if no appscheme_view rows found (graceful)

**Before:**
```ts
model[code] = { keyPath, base, model: {}, fields, fks, template };
```
**After:**
```ts
model[code] = { keyPath, base, model: {}, fields, fks, template, _views };
```

---

### S27-02 — Explorer.svelte consomme `_views` (effort: M)

**File:** `src/lib/shell/explorer/Explorer.svelte` (created in S25)

**Acceptance:**
- Read `machine.logic.collection(collection)._views` (or equivalent accessor)
- `mode='list'`    → use `_views.list` field order for row columns; fallback `template.presentation`
- `mode='table'`   → use `_views.list` for column headers; fallback `template.presentation`
- `mode='card'`    → pass `_views.form` field list to CardForm `showFields` prop; fallback all fields
- `mode='actions'` → use `_views.mini` for label; fallback `template.presentation[0]`
- If `_views` absent or empty → silently fall back to current `template.presentation` behavior
- No crash if `_views` undefined

**Accessor pattern:**
```ts
const scheme = $derived(machine.logic.collection(collection));
const views  = $derived(scheme?._views ?? {});
const listFields = $derived(
  views.list?.map(f => f.name) ?? scheme?.template?.presentation?.split(' ') ?? []
);
```

---

### S27-03 — MachineScheme expose `_views` accessor (effort: S)

**File:** `src/lib/main/machine/MachineScheme.ts`

**Acceptance:**
- Add getter `get views(): Partial<EntityViews> | undefined`
- Returns `(this.model[this.collectionName] as any)?._views ?? undefined`
- Typed correctly via `EntityViews` import from `schema-types.ts`
- Used by Explorer (S27-02) instead of casting `any`

---

### S27-04 — InputSelect uses `_views.fk_label` (effort: S)

**File:** `src/lib/data-ui/input/InputSelect.svelte`

**Acceptance:**
- Currently uses `template.presentation` to build FK option labels
- If `_views.fk_label` present → use those fields instead
- Fallback: current `template.presentation` behavior (no regression)

---

### S27-05 — demoScheme deploy + verify (effort: S)

**Acceptance:**
- Run `POST /api/admin/reset` steps: clear + deploy + seed
- Verify MongoDB `appscheme_view` has rows for all demo collections (vehicle, category, customer, rental, location_office, maintenance)
- Verify `GET /api/scheme` (or equivalent) returns model with `_views` populated
- Log sample: `vehicle._views.list = ['license_plate','model','brand','year','status']`

---

### S27-06 — Tests + Playwright (effort: M)

**Unit tests:**
- `server/src/__tests__/getModel.test.ts` — mock appscheme_view query, assert _views built correctly
- `src/lib/main/__tests__/machineScheme.test.ts` — assert `scheme.views` getter returns correct shape

**Playwright:**
- Deploy fresh (DevResetPanel full reset)
- Click "vehicle" → Explorer list mode → columns match `_views.list` fields
- Click record → card mode → CardForm shows `_views.form` fields only
- 0 console errors

**Full suite:** `pnpm run test` ≥ 439/439

---

## Invariants

- `template.presentation` kept as fallback — never removed
- `_views` optional everywhere — no crash if absent
- `appscheme_view_type` seed unchanged (list/mini/form/custom/fk_label)
- S27 depends on S25 (Explorer.svelte must exist) and S26 (clean model naming)
- Server-side only change for S27-01 — no IDB schema change needed
