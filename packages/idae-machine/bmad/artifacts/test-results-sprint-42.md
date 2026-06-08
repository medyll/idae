# Sprint 42 — Test Results

> Date: 2026-06-01
> Story: S42-01 — DataList mode unification

---

## Summary

Sprint 42 complete. TableInline.svelte removed, replaced with scheme-aware table rendering
using DataField pipeline. All acceptance criteria met.

---

## Test Results

### Client (vitest — jsdom)

| Metric | Result |
|--------|--------|
| Test files | 52 passed |
| Tests | **586/586 passed** |
| Duration | 41.76s |

### Server (vitest — node)

| Metric | Result |
|--------|--------|
| Test files | 18 passed, 1 failed (pre-existing) |
| Tests | **179 passed, 9 skipped, 1 failed** |
| Duration | 11.60s |

**Pre-existing failure:** `imagePresetRegistry.test.ts` — Mongo duplicate key error
(`E11000 dup key: { code: "small" }`). Cross-test pollution from prior test runs.
Unrelated to Sprint 42 changes. Same issue observed in Sprint 41.

### svelte-check

| Metric | Result |
|--------|--------|
| Errors | **0** |
| Warnings | **0** |

---

## Changes Made

| File | Action |
|------|--------|
| `src/lib/data-ui/data/DataList.svelte` | Added `tableColumns` derived, replaced TableInline with inline `<table>` + DataField, removed TableInline import, updated JSDoc |
| `src/lib/data-ui/data/TableInline.svelte` | **Deleted** |
| `src/styles/components.css` | Added `table.data-table` styles under `@layer components` |

---

## Acceptance Criteria

- [x] `TableInline.svelte` supprimé, `git grep TableInline src/` = 0 résultats
- [x] `mode='table'` rend une vraie `<table class="data-table">` avec `<thead>` depuis `getFieldsForView`
- [x] FK fields résolus dans les cellules via DataField (pas de valeurs brutes)
- [x] Private fields absents (DataField les gère silencieusement via `isPrivate`)
- [x] `view` prop passé au `getFieldsForView` dans `tableColumns`
- [x] Clic sur `<th>` → `prefs.set('sortBy', [...])` → tri appliqué via `effectiveSort`
- [x] `mode='list'` et `mode='grid'` — comportement inchangé (586 tests verts)
- [x] `pnpm check` 0 erreurs, 0 warnings
- [x] `pnpm test` 586/586 tests verts (client)
- [x] Server tests: 179/188 (1 pre-existing failure unrelated to this sprint)
