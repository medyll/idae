# Test Results: S11-04 — machine.sync + machine.destroy()

**Date:** 2026-05-17
**Command:** `pnpm vitest run src/lib/main/__tests__/machineSyncDestroy.test.ts`

## Result: ✅ All 10 tests passed

### Test breakdown

| Suite | Tests | Status |
|-------|-------|--------|
| machine.init({sync:false}) | 2 | ✅ |
| machine.init({sync: {...}}) | 1 | ✅ |
| machine.init({stateEngine}) | 1 | ✅ |
| machine.destroy() | 2 | ✅ |
| machine.sync before start() | 1 | ✅ |
| machine.collection(name) before/after start | 2 | ✅ |
| machine.init({hooks}) | 1 | ✅ |

### Acceptance criteria coverage

- ✅ machine.init({sync:false}) → start() OK, machine.sync throws 'not enabled'
- ✅ machine.init({sync:{databaseHost:'http://x',mode:'mobile-first'}}) → createQoolie called with sync config
- ✅ machine.init({stateEngine:'stator'}) → forwarded without error
- ✅ machine.destroy() après start() → machine._qoolie === undefined
- ✅ machine.destroy() avant start() → no-op, pas de throw
- ✅ machine.sync avant start() → throw 'Machine not started'
- ✅ machine.collection(name) avant start() → throw
- ✅ machine.collection(name) après start() → QoolieCollection avec les bons verbes

### Full client suite: 203/203 green (14 files)
