# Test Results — S50-02

**Story:** groupBy fonctionne pour TOUS les modes DataList (table + grid inclus)  
**Backlog ref:** BL-20  
**Date:** 2026-06-23  
**Command:** `pnpm run test` + `pnpm run check`

## Summary

- `pnpm run check`: 0 errors, 4 pre-existing warnings (Synthesis.svelte unused CSS selectors)
- `pnpm run test`: 69 test files / 730 tests passed
- New tests: 4 added to `src/lib/data-ui/data/DataRelations.svelte.test.ts`
  - groups items in list mode
  - groups items in table mode
  - groups items in grid mode
  - falls back to flat rendering when groupBy is absent

## Changes

- `src/lib/data-ui/data/DataList.svelte`
  - Factored group rendering out of the list-only path.
  - Table mode: one `<tbody>` per group with a `<th colspan>` group header row.
  - Grid mode: one `.grid-list` per group under a `.data-list-group-header`.
  - List mode: unchanged grouped behavior, now using shared `renderGroupHeader` snippet.
  - Added table-specific group header styling.

- `src/lib/data-ui/data/DataRelations.svelte.test.ts`
  - Extended `testCore` with `appscheme_view_type`, `appscheme_field_type`, `appscheme_field`, `appscheme_view`.
  - Added `seedViewFields()` helper for table/grid view resolution.
  - Added `DataList groupBy across modes` describe block with 4 tests.

## Blocker fixed during story

S50-01 (menu generator) had uncommitted broken code that crashed module load (`machineMenuManager` singleton importing `machine` directly, violating AGENTS.md invariants). Fixed the module-load crash so S50-02 tests could run:

- Removed module-level `machineMenuManager` singleton from `MachineMenuManager.ts`.
- Made `Machine` own the menu manager instance (`this._menuManager`).
- Exported `MachineRights` class.
- Cleaned up menu store/manager type exports and test mock signatures.
- Left reactive store wiring as a skeleton for S50-01 completion.

## Result

✅ All tests passed
