# Test Results — S6-05

**Story:** engine/IdbState.ts — CollectionState + createIdbState  
**Date:** 2026-05-20  
**Runner:** vitest v4.1.2

## Engine Tests

```
 RUN  v4.1.2 D:/development/idae/packages/qoolie

 Test Files  4 passed (4)
      Tests  51 passed (51)
   Start at  23:25:30
   Duration  1.38s
```

### CollectionState Tests (10 tests)
- ✅ should initialize with empty dataState
- ✅ should getAll from dataState
- ✅ should reflect add in dataState immediately
- ✅ should where query dataState
- ✅ should get by id
- ✅ should delegate put to collection
- ✅ should delegate update to collection
- ✅ should delegate delete to collection
- ✅ should delegate count to collection

### createIdbState Tests (1 test)
- ✅ should create state map for multiple collections

### Cumulative (S6-01 through S6-05)
- pathResolver: 10 tests
- IdbEngine: 12 tests
- IdbCollection: 19 tests
- IdbState: 10 tests
- **Total: 51/51 passing**

## TypeScript Check

```
tsc --noEmit — ✅ No errors
```

## Acceptance Criteria

- ✅ Adapté depuis idbstate.svelte.ts — suppression de statorAdapter, suppression de $state
- ✅ getAll() → idbEventBus.dataState[collection]
- ✅ where(q) → filtre sur dataState[collection]
- ✅ Mutations délèguent à IdbCollection (qui émet sur le bus)
- ✅ Tests : add → getAll() retourne le nouveau record

✅ All tests passed
