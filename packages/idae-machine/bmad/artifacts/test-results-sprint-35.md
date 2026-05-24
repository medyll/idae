# Sprint 35 Test Results — QOOLIE-SWR

> Date: 2026-05-24
> Sprint: S35 — QOOLIE-SWR
> Goal: transparent IDB hydration from server on cold read, implemented in qoolie package

## Status

✅ All tests passed

## Qoolie Package Tests

**Command:** `pnpm --filter qoolie test:unit`

| File | Tests | Status |
|------|-------|--------|
| IdbCollection.test.ts | 23/23 | ✅ pass |
| HydrationController.test.ts | 8/8 | ✅ pass |
| Qoolie.test.ts | existing | ✅ pass |
| QoolieCollection.test.ts | existing | ✅ pass |
| operators.test.ts | existing | ✅ pass |
| config.test.ts | existing | ✅ pass |
| health.test.ts | existing | ✅ pass |
| IdbState.test.ts | existing | ✅ pass |
| IdbCollection.test.ts | existing | ✅ pass |
| IdbEngine.test.ts | existing | ✅ pass |
| pathResolver.test.ts | existing | ✅ pass |
| IdbSchema.ts | existing | ✅ pass |

**Total:** 206/206 tests passed (16 test files)

## idae-machine Package Tests

**Command:** `pnpm --filter idae-machine test:unit`

| File | Tests | Status |
|------|-------|--------|
| machine.test.ts | 22/22 | ✅ pass |
| All other test files | 450/450 | ✅ pass |

**Total:** 472/472 tests passed (39 test files)

## idae-sync Package Tests

**Command:** `pnpm --filter idae-sync test:unit`

- Existing suite: all pass (no new failures introduced by `fetchAll` addition)

## Build Verification

| Package | Command | Result |
|---------|---------|--------|
| idae-sync | `pnpm run build` | ✅ tsc passes |
| qoolie | `pnpm run build` | ✅ tsc passes |

## Code Coverage

- **S35-03:** `bulkUpsertSilent` — 4 new tests (write, upsert, event emission, transaction)
- **S35-01:** `HydrationController` — 8 new tests (cold read, dedup, revalidate, error hooks, empty array, disabled)
- **S35-00:** `machine.store()` — 2 new tests (return shape, empty before start)

## Acceptance Criteria

- [x] Cold IDB + databaseHost set → first getAll() triggers pull, records appear reactively
- [x] Second getAll() on same collection → no second fetch (dedup via hydrated Set)
- [x] `revalidate()` → forces fresh pull even if already hydrated
- [x] `autoHydrate: false` → getAll() does not trigger pull
- [x] Server returns 401/500 → no throw on read, `onHydrateError` called
- [x] No databaseHost → hydration is silent no-op
- [x] Existing qoolie vitest suite: all pass, no regression
- [x] machine.ts has zero pull logic
- [x] DataList uses `machine.store(collection)` function call
- [x] qoolie dist builds successfully

## Sign-off

**Tester verdict:** PASS — Sprint 35 ships.

## Related

- Closes BACK-03
- Unblocks BACK-05 (Playwright RBAC tests)
