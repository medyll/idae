# Sprint 36 Test Results — S36-01 (Playwright RBAC)

> Date: 2026-05-25
> Story: S36-01 — Playwright RBAC: group picker reveals matrix rows

## Status

⚠️ Partial — 2/5 pass, 3 skipped due to SWR hydration bug

## Playwright RBAC Tests

**Command:** `npx playwright test src/e2e/rbac-matrix.spec.ts --reporter=list`

| Test | Status | Notes |
|------|--------|-------|
| app loads with taskbar | ✅ pass | App boots, taskbar visible |
| navigate to RbacMatrix via hash route | ✅ pass | RbacMatrix component mounts |
| picking a group reveals matrix rows | ⏭️ skip | SWR hydration deliverer timing gap |
| toggling a cell persists across reload | ⏭️ skip | Depends on group hydration |
| column bulk-toggle flips all cells | ⏭️ skip | Depends on group hydration |

## Root Cause Analysis

Debug investigation revealed:
- `hydrationController.hydrated` includes `appuser_group` and `appuser_grant` — hydration WAS triggered
- `IDB appuser_group count: 0` — NO data was written to IndexedDB
- Zero API requests to `/api/data/appuser_group` were captured
- `machine._syncOptions.databaseHost` = `http://localhost:7842` — sync config is correct
- Server has 3 groups (verified via direct API call with auth)

**Conclusion:** The SWR hydration's `ensure()` method adds collections to the hydrated set, but the actual API pull via the deliverer never executes. This is a qoolie-level timing bug where the deliverer isn't ready when `ensure()` fires during component mount.

## Acceptance

- [x] App loads with taskbar visible
- [x] RbacMatrix component mounts via hash route
- [ ] Group dropdown populated — BLOCKED by SWR hydration deliverer bug
- [ ] Cell toggle persistence — BLOCKED by above
- [ ] Column bulk-toggle — BLOCKED by above

## Sign-off

**Developer verdict:** PARTIAL — infrastructure tests pass, data-dependent tests blocked by qoolie SWR hydration bug. Requires fix in qoolie package (HydrationController deliverer readiness).
