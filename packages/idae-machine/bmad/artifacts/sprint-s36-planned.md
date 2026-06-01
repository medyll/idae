# Sprint 36 — Polish & Playwright RBAC

> Date: 2026-05-25
> Goal: Close BACK-05 (Playwright RBAC suite), fix I1 (Svelte 5 warnings), implement mobile-first auto-seed (BL-01)

## Stories

### S36-01 — Playwright RBAC: group picker reveals matrix rows
- **Backlog:** BACK-05 (story 1/3)
- **Effort:** M
- **Detail:** Write Playwright test that selects a group in RbacMatrix and verifies collection rows appear. Dev server must be running with demo seed data. Test should navigate to permissions frame, pick "admins" group, assert matrix body renders rows for each collection.
- **Acceptance:** Playwright test passes against dev server with seeded RBAC data.

### S36-02 — Playwright RBAC: cell toggle persists across reload
- **Backlog:** BACK-05 (story 2/3)
- **Effort:** M
- **Detail:** Write Playwright test that toggles a CRUDLX cell in RbacMatrix, reloads the page, and verifies the toggle state is preserved. Requires server-side grant persistence to be functional.
- **Acceptance:** Test toggles cell → reloads → same cell remains checked.

### S36-03 — Playwright RBAC: column bulk-toggle flips all cells
- **Backlog:** BACK-05 (story 3/3)
- **Effort:** M
- **Detail:** Write Playwright test that uses the column header bulk-toggle checkbox in RbacMatrix and verifies all cells in that column flip state. Then reload and verify persistence.
- **Acceptance:** Test bulk-toggles "read" column → all rows reflect change → reload persists.

### S36-04 — Fix I1: ExplorerTableInline `state_referenced_locally` Svelte 5 warnings
- **Backlog:** I1 (from next_action)
- **Effort:** S
- **Detail:** ExplorerTableInline.svelte triggers Svelte 5 `state_referenced_locally` compiler warnings. Identify the offending `$state` declarations that are referenced locally without proper reactivity patterns. Fix using `$derived` or proper `$state` usage.
- **Acceptance:** `pnpm run check` produces zero `state_referenced_locally` warnings for ExplorerTableInline. Full test suite passes.

### S36-05 — BL-01: `machine.init` sync.seed — auto seedIfEmpty in mobile-first mode
- **Backlog:** BL-01
- **Effort:** M
- **Detail:** When `sync.mode = 'mobile-first'`, `machine.start()` should call `seedIfEmpty(sync.seed)` automatically. Config: `machine.init({ sync: { mode: 'mobile-first', seed: demoSeed } })`. This is the local-first logic — if IDB is empty, seed it.
- **Acceptance:** Fresh IDB + mobile-first mode → data seeded automatically. Existing IDB → no re-seed. Tests cover both paths.

### S36-06 — Tests + check — full suite verification
- **Backlog:** Standard closing story
- **Effort:** S
- **Detail:** Run `pnpm run check` (0 errors), `pnpm run test` (all pass), Playwright RBAC suite (9/9). Capture results to `bmad/artifacts/test-results-sprint-36.md`.
- **Acceptance:** check: 0 errors. vitest: all green. Playwright: 9/9 RBAC tests pass.

## Dependencies

- S36-01 → S36-02 → S36-03 (sequential Playwright RBAC stories, same test file)
- S36-04 independent
- S36-05 independent
- S36-06 depends on all above

## Capacity

- Total: 3M + 2S = ~2-3 days
- Sprint 36 is a polish sprint — focused, achievable, closes high-priority backlog items.
