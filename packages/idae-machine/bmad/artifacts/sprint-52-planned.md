# Sprint 52 — MAIN-MENU: recent-history panel + waffle/start overlay

> Source: `bmad/artifacts/epic-main-menu.md` §5 leaf stories BL-19 / BL-15

## Goal

Implement the right-zone recent-history panel (BL-19) and the TaskBar-driven waffle/start overlay (BL-15), both consuming the BL-13 menu generator (`useMenuTree`) and `menuPrefs.ts`. Keep BL-15 and BL-18 in different sprints (TaskBar contention rule).

## Stories

| ID | Backlog | Title | Effort | Status |
|----|---------|-------|--------|--------|
| S52-01 | BL-19 | Right recent-history panel (appuser_history 30d/15, pref app_panel) | M | in_progress |
| S52-02 | BL-15 | Waffle / start overlay (type→collection launch + launch_all) | L | planned |

## Capacity

Total effort: **M + L** (2 stories, 1 agent sequential — BL-15 cannot run before BL-19 in the same sprint because they share no files, but capacity suggests one at a time).

## Dependencies

- Sprint 50 (BL-13 menu generator) → must be complete. ✅
- S52-01 has **no file overlap** with S52-02 (RecentPanel/TemplateShell right zone vs WaffleMenu/TaskBar).
- S52-02 (BL-15) must **not** run in the same sprint as BL-18 (gear) — both touch `TaskBar.svelte`. Scheduled apart in Sprint 53. ✅
- S52-01 (BL-19) must **not** run in the same sprint as BL-14 (sidebar) — both touch `TemplateShell.svelte`. Scheduled apart in Sprint 51. ✅

## Implementation notes

- Reads via `machine.store`, writes via `machine.action` (CLAUDE.md invariants 8/10).
- Consume `useMenuTree(zone)` + `filterMenuCollections` from `menuPrefs.ts` — no inline rights/prefs joins, no `'app_*_'+table` literals.
- Every custom tag needs explicit `display` CSS (invariant 7). Run `pseudo-html` then `css-base` before building.
- New exports added to `src/lib/index.ts`.
- Gate: `pnpm run check` 0 errors, `pnpm run test` green, full suite captured to test artifact.
