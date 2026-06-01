# Test Results — S6-02

**Story:** engine/IdbSchema.ts + engine/IdbEngine.ts  
**Date:** 2026-05-20  
**Runner:** vitest v4.1.2

## Engine Tests

```
 RUN  v4.1.2 D:/development/idae/packages/qoolie

 Test Files  2 passed (2)
      Tests  22 passed (22)
   Start at  23:09:16
   Duration  1.27s
```

### IdbSchema Tests
- ✅ should create an object store
- ✅ should create schema with multiple stores
- ✅ should handle auto-increment key paths

### IdbEngine Tests
- ✅ should create engine instance
- ✅ should expose collection accessors
- ✅ should open database and create stores
- ✅ should support transactions
- ✅ should throw if transaction called before open
- ✅ should close database connection
- ✅ should return collection info

### createDb Factory Tests
- ✅ should return createDb result with all fields
- ✅ should allow data operations after open

### pathResolver Tests (from S6-01)
- ✅ 10/10 passing

## TypeScript Check

```
tsc --noEmit — ✅ No errors
```

## Acceptance Criteria

- ✅ IdbSchema.ts — crée/migre la structure IndexedDB (version, keyPath, indexes)
- ✅ IdbEngine.ts — createDb(model, version) retourne { idbDatabase, idbql }
- ✅ Zéro import @medyll/idae-idbql
- ✅ Test: createDb avec fake-indexeddb → collections accessibles

✅ All tests passed
