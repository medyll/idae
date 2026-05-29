# View System — Verified State & Plan

> Rewritten 2026-05-30 against live code (claude-opus-4-8).
> Supersedes the prior 4-author accretion (Sonnet / Copilot / qwen ×2).
> Stale claims removed; every assertion below cross-checked against source.

---

## 1. What the view system is

`appscheme_view` rows bind a **field** to a **view type** for a **scheme**. At model
build the server groups those rows by view type and emits a `_views` object per
collection. The client reads it through `MachineScheme.viewFields`. UI consumers
pick fields from a named view (`fullView`, `miniView`, `fkView`).

`view -> fields` (not field -> views). The `ViewFields` naming reflects that.

---

## 2. Verified runtime chain

```
appscheme_view + appscheme_view_type   (MongoDB, seeded by deployModel.ts)
        ↓
server/src/MachineServer.ts  getModel()
        ↓  filter rows by scheme code
        ↓  _viewTypeToKey(view_type.code) → ViewFields key (null = dropped)
        ↓  sort each view by `order`
        ↓
collectionModel._views : Partial<ViewFields>
        ↓
src/lib/main/machine/MachineScheme.ts  get viewFields()
        ↓
src/lib/data-ui/data/DataList.svelte   (only active consumer)
```

**Evidence (line-checked):**

| Step | File | Lines |
|------|------|-------|
| view-type→key map | `server/src/MachineServer.ts` | 52-58 |
| `_views` build + sort | `server/src/MachineServer.ts` | 125-162 |
| getter | `src/lib/main/machine/MachineScheme.ts` | 97-100 |
| consumer fallback chain | `src/lib/data-ui/data/DataList.svelte` | 211-218 |
| seeding | `server/src/bootstrap/deployModel.ts` | 197-205, 398-448 |

---

## 3. Mapping contract (as shipped)

`_viewTypeToKey` (`MachineServer.ts:52`):

| `view_type.code` | runtime key | result |
|------------------|-------------|--------|
| `list`     | `fullView` | built |
| `mini`     | `miniView` | built |
| `fk_label` | `fkView`   | built |
| anything else | — | **dropped (returns null)** |

The builder fills each `ViewFieldDef` as:

```ts
{ name: fieldCode, code: fieldCode, group: '', title: fieldCode.replace(/_/g,' '), order: row.order ?? 0 }
```

So `group` is always empty, `title` is derived from the code, and `icon` /
`options` are **not** populated — regardless of what the prior proposals claimed.

---

## 4. Consumer coverage (verified)

| View key | Built by server | Consumer | Status |
|----------|-----------------|----------|--------|
| `fullView` | yes | `DataList.svelte` | **Active** |
| `miniView` | yes | none | built, unused |
| `fkView`   | yes | none (FK labels use `template.presentation`) | built, unused |

`DataList` resolution order (`:211-218`): `showFields` prop → `viewFields.fullView`
names → `presentationFields` (parsed from `template.presentation`).

---

## 5. Seeding — DONE (was wrongly flagged "Critical / missing")

Prior doc claimed no seed data and pointed at `bootstrap-demo.ts`. **False.**
`deployModel.ts` already seeds:

- `appscheme_view_type` from `VIEW_TYPES` (`:197-205`).
- `appscheme_view` rows for **every** collection (`:398-448`), derived from
  `template.presentation` (fallback: first N field names).

`viewDefs` currently emitted (`:402-407`): `list`, `mini`, `form`, `fk_label`.

No seeding work is required to exercise `fullView` / `miniView` / `fkView`
end-to-end. Proposal H from the old doc is obsolete and has been dropped.

---

## 6. Code drift to fix (flagged, not yet changed)

These are real mismatches found while verifying. Listed as planning inputs.

### 6.1 `form` is not a view type — remove it (misconception)
- `deployModel.ts:405` seeds `form` rows for every collection.
- `MachineServer._viewTypeToKey` returns `null` for `form` → those rows are
  written to Mongo then discarded at build. Dead data.
- `ViewTypeCode` union (`schema-types.ts`) lists `'form'` and `'custom'`.
- **Fix direction:** drop `form` from `deployModel` `viewDefs`; remove `'form'`
  from `ViewTypeCode`. Form field composition is `DataForm`'s concern, not a view
  type. (`custom` — see open question Q2.)

### 6.2 `fkView` comment / code mismatch
- `schema-types.ts:~1400` comments `fkView = view_type 'fk'`.
- Real mapping key is `fk_label`; `'fk'` maps to nothing.
- **Fix:** correct comment to `fk_label` (or decide `'fk'` is the intended code
  and align the seeder + map).

### 6.3 `ViewFieldDef` fields under-filled
- Builder hardcodes `group: ''` and never sets `icon` / `options`.
- `appscheme_field` carries real group + icon; `appscheme_view.options` exists in
  the schema but is ignored by the builder.
- **Fix direction:** join `appscheme_field` group/icon and pass through
  `row.options` when building `_views` (only if a consumer will read them).

### 6.4 Type duplication
- `ViewFields` / `ViewFieldDef` defined in `schema-types.ts` **and**
  `machine-model.ts`, plus a server copy in `server/src/models/AppScheme.ts`.
- `index.ts` barrel deliberately excludes the `machine-model.ts` versions to
  avoid a name clash — duplication is contained but remains a maintenance trap.
- **Fix direction:** single canonical source (`schema-types.ts`), re-export
  everywhere.

---

## 7. Proposals (the surviving ones)

Old Proposals A/B/C are moot — B effectively shipped server-side. Proposal H
(seed) is obsolete. What remains worth doing:

### P1 — Central resolver `getFieldsForView` on `MachineScheme`
Move DataList's fallback chain into one method so future consumers don't
re-implement it.

```ts
getFieldsForView(viewKey: keyof ViewFields): ViewFieldDef[] {
  const v = this.viewFields?.[viewKey];
  if (v?.length) return v;
  const pres = this.template?.presentation;
  if (!pres) return [];
  return pres.split(/\s+/).filter(Boolean)
    .map((name, i) => ({ name, code: name, group: '', title: name.replace(/_/g,' '), order: i }));
}
```

### P2 — Activate `miniView` consumer
Compact card / grid mode in `DataRecord` (or a `DataCard`). View is already built;
only a reader is missing.

### P3 — Activate `fkView` consumer
`InputSelect` FK labels read `fkView` before falling back to
`template.presentation`. Enables per-collection FK label composition.

### P4 — `viewFields` = official field-selection layer; `template.presentation` = fallback only
State the contract so the two stop overlapping silently.

---

## 8. Roadmap (re-ranked on verified state)

### Phase 0 — Fix drift (small)
- 6.1 drop `form` (seeder + `ViewTypeCode`).
- 6.2 fix `fkView` comment.
- 6.4 dedup types to single source.

### Phase 1 — Resolver + tests
- P1 `getFieldsForView`.
- Point `DataList` at it.
- Unit tests: `list`/`mini`/`fk_label` mapping, ordering, fallback with/without `_views`.

### Phase 2 — Activate the built-but-unused views
- P2 `miniView` consumer.
- P3 `fkView` consumer.
- Integration tests for view-based rendering.

### Phase 3 — Richer metadata (only if consumers need it)
- 6.3 fill `group`/`icon`/`options` in builder.
- Decide `custom` semantics (Q2).

---

## 9. Open questions

1. **Reactivity** — `_views` is built once at model load. If `appscheme_view`
   changes at runtime, should `viewFields` refresh? (Needs reactive wrap.)
2. **`custom` view type** — keep it in `ViewTypeCode`? Namespaced
   (`custom.<name>`) or free-form via the `[key: string]` index signature?
3. **`ViewOptions` reach** — `width`/`sortable`/`visible`/`editable` exist in the
   type but are never built or read. Wire them, extend (`component`,
   `conditional`, `transform`), or trim the type to what's real?
4. **Deprecate `template.presentation`?** Once `viewFields` is the source, is
   `presentation` a permanent lightweight fallback or a migration target?
5. **User-configurable views?** Per-user field order/visibility persisted in
   `appuser_prefs` — in scope or out?

---

## 10. Summary

- ✅ Types defined, consistently named (`ViewFields`).
- ✅ Server builder works; `_views` populated at model load.
- ✅ Seeding done in `deployModel.ts` (prior "missing seed" claim was false).
- ✅ `fullView` consumed by `DataList`.
- ⚠️ `miniView` / `fkView` built but unconsumed.
- ⚠️ `form` seeded but dropped — it is **not** a view type; remove it.
- ⚠️ Builder under-fills `ViewFieldDef` (empty `group`, no `icon`/`options`).
- ⚠️ Types duplicated across 3 files.
- ⚠️ Fallback logic lives in `DataList`, not centralized.

Foundation is real and operational for lists. Remaining work = drift cleanup +
two consumers + a resolver, not a rebuild.
