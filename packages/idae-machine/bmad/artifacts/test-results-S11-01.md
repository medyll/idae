# Test Results: S11-01 — IDB CRUD round-trip via machine.collection()

**Date:** 2026-05-17
**Command:** `pnpm vitest run src/lib/main/__tests__/machineCRUD.test.ts`

## Result: ✅ All 23 tests passed

### Test breakdown

| Suite | Tests | Status |
|-------|-------|--------|
| machine.start() with demoScheme | 3 | ✅ |
| category collection — full CRUD | 5 | ✅ |
| vehicle collection — CRUD + where filter | 5 | ✅ |
| customer collection — CRUD | 1 | ✅ |
| rental collection — CRUD with FK references | 3 | ✅ |
| location_office collection — CRUD | 1 | ✅ |
| maintenance collection — CRUD with FK reference | 1 | ✅ |
| all 6 collections — data survives full cycle | 1 | ✅ |
| edge cases | 3 | ✅ |

### Acceptance criteria coverage

- ✅ machine.start() with demoScheme + fake-indexeddb — zero errors
- ✅ machine.collection('category').create({code:'x',name:'X'}) returns doc with id
- ✅ machine.collection('category').getAll() returns the created doc
- ✅ machine.collection('vehicle').where({status:'available'}) filters correctly
- ✅ machine.collection('category').update(id, {name:'Y'}) returns modified doc
- ✅ machine.collection('category').delete(id) returns true, getAll no longer contains it
- ✅ machine.collection('vehicle').count() returns correct integer
- ✅ machine.collection('nonexistent') throws
- ✅ All 6 collections tested: vehicle, category, customer, rental, location_office, maintenance

### Full suite regression: 193 tests pass (13 files)
