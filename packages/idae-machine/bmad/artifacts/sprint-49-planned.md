# Sprint 49 — Form mode for DataList + menu pref scopes

**Goal:** Pull BL-09 (now unblocked by S48-01) and BL-12 (no dep) in parallel. Both feed BL-13 (menu generator) next.

## Stories

| ID | Backlog | Title | Effort | Files | Depends on |
|----|---------|-------|--------|-------|------------|
| S49-01 | BL-09 | DataList per-item edit — drive DataRecord's existing `update` mode per record, no new layout mode | L | `src/lib/data-ui/data/DataList.svelte` | BL-08 (done) |
| S49-02 | BL-12 | Menu pref scopes — zone→pref module + défauts + dev show-all | M | new module (zone→pref mapping), `useMachinePrefs.svelte.ts` | none |

No file overlap: S49-01 touches DataList's mode dispatch; S49-02 touches the prefs-scope module. Safe parallel.

## S49-01 detail (BL-09) — REVISED 2026-06-23

**Correction:** original plan added `mode='form'` to DataList — wrong. DataRecord/DataField already define the real record-state vocabulary: `mode?: 'show' | 'create' | 'update' | 'row'` (DataRecord.svelte:36, DataField.svelte:40). Per ADR-06, DataRecord is the ONLY component allowed to iterate fields — DataList must never grow a parallel "form" concept that duplicates/collides with that enum.

Target: DataList gains a prop to select which DataRecord mode each item renders with (e.g. `itemMode?: 'show' | 'update'`, default `'show'`), in `list`/`table`/`grid` layout exactly as today — `mode` (the layout dimension: list/table/grid) stays untouched. Renders existing DataRecord with `mode={itemMode}` per record instead of the current hardcoded `'show'`/`'row'`. RbacMatrix becomes `<DataList collection="appuser_grant" itemMode="update" ...>` filtered by group — no manual `<table>`/`<select>`, no DataForm-per-record wrapper, no new componentRegistry entry. Writes already flow through `machine.action` (S48-01) so DataRecord mode='update' fields commit the same way.

Acceptance: `itemMode` prop forwards to DataRecord per item in all 3 layouts without breaking existing `mode='row'` (table) path; zero new field-iteration logic outside DataRecord; test coverage for itemMode='update' rendering + write round-trip; grep confirms no `'form'` added to DataList's mode union.

## S49-02 detail (BL-12)

Centralize zone→pref key mapping (`app_menu`, `app_menu_start`, `app_menu_create`, `app_panel`) in ONE module — `app*_` is convention not contract (memory: machine_app_naming), no scattered `'app_menu_'+table` literals. Critical: empty `appuser_prefs` → default = show all PERMITTED collections (no app_menu_* pref set ≠ hidden); dev mode (`import.meta.env.DEV`) bypasses pref filter entirely. Don't persist defaults as prefs.

Acceptance: module exports zone→pref resolver, unit tests for empty-pref-default and dev-bypass paths, no regression in existing useMachinePrefs consumers.

## Excluded / flagged again

- BL-05, BL-23 — still ADR-blocked, unchanged.
- BL-20 (groupBy all modes) — also touches DataList.svelte; do NOT run alongside S49-01 in the same sprint (same-file risk). Candidate for sprint 50 once S49-01 lands.
- BL-22/BL-24 — still same-file overlap (ContextMenuContent.svelte), sequence separately.

## Next after this sprint

S49-01 + S49-02 done → BL-13 (menu generator, depends on BL-11+BL-12, both will be satisfied) becomes sprint-eligible. BL-13 then cascades BL-14..BL-19.
