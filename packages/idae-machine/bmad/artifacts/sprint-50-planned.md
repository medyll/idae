# Sprint 50 — Menu generator + DataList groupBy fix

**Goal:** BL-13 (menu generator, now eligible — BL-11+BL-12 both done) and BL-20 (DataList groupBy bug, no dep). Zero file overlap.

## Stories

| ID | Backlog | Title | Effort | Files | Depends on |
|----|---------|-------|--------|-------|------------|
| S50-01 | BL-13 | Menu generator (framer enrichi) — arbre réactif rights∩prefs∩appscheme | M | new module (menu derived store), `MachineFrameManager.ts` (enrichment) | BL-11 ✅, BL-12 ✅ |
| S50-02 | BL-20 | groupBy fonctionne pour TOUS les modes DataList (table + grid) | M | `src/lib/data-ui/data/DataList.svelte` | none |

No file overlap: S50-01 lives in a new store/framer layer, S50-02 is scoped to DataList's group-rendering branches (lines ~306-380, untouched by S49-01's crudMode/as work).

## S50-01 detail (BL-13)

Pièce perdue du legacy. Store `$derived` joining `machine.rights.allowedCollections('L')` (BL-11), `appuser_prefs` via `menuPrefsScope`/`filterMenuCollections` (BL-12, `src/lib/data-ui/utils/menuPrefs.ts`), and `appscheme`/`appscheme_type` (label/icon/color/type) → typed tree grouped by type. Reactive: pref/right change re-filters. Framer carries the menu model + launch verbs (Espace=loadFrame explorer, Créer=loadInDialog form, etc.) — keep the builder pure/reactive, don't bloat the singleton's UI state.

ADR candidate noted in backlog (framer ownership of menu model) — not a blocker, proceed and flag `> Assumed:` if revisited.

Acceptance: derived store produces correct tree from mocked rights+prefs+appscheme fixtures; re-derives on pref/right change; unit tests for empty-prefs-default and dev-bypass paths (reuses menuPrefs.ts semantics).

## S50-02 detail (BL-20)

Bug: `{:else if groups}` branch (DataList.svelte, was line 367 pre-S49-01 edits) only reached in list mode — `currentMode === 'table'` and `currentMode === 'grid'` branches short-circuit first, so groupBy is silently ignored in table/grid. Target: `effectiveGroupBy` applies to all 3 modes. Table = one `<tbody>` (or section) per group with a group-header row (colspan); grid = one grid per group under the groupHeader. Factor grouped rendering out of the list-only path.

Acceptance: groupBy renders grouped sections in table and grid modes identically to list mode; existing groupBy tests + new table/grid group tests pass.

## Excluded / flagged again

- BL-05, BL-23 — still ADR-blocked.
- BL-22 / BL-24 — still same-file overlap (ContextMenuContent.svelte), not in this sprint, sequence separately when picked up.
- BL-21 (snippet rename item→dataRecord) — ready (no dep), held back only for capacity (2 agents, 2 stories this round); good candidate for sprint 51 alongside BL-22 or BL-24 (pick one, not both).

## Next after this sprint

S50-01 done → BL-14 (sidebar tree), BL-15 (waffle/start), BL-16 (today dashboard), BL-17 (context-menu launch verbs), BL-18 (gear settings), BL-19 (recent history panel) all become sprint-eligible — epic MAIN-MENU cascade. Pick 2 disjoint ones per future sprint (e.g. BL-14 + BL-16 — sidebar vs dashboard frame, likely disjoint files).
