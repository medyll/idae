# Test Results — S6-03 (+ S6-04 early)

**Story:** engine/IdbCollection.ts (+ IdbEventBus.ts as dependency)  
**Date:** 2026-05-20  
**Runner:** vitest v4.1.2

## Engine Tests

```
 RUN  v4.1.2 D:/development/idae/packages/qoolie

 Test Files  3 passed (3)
      Tests  41 passed (41)
   Start at  23:21:12
   Duration  1.28s
```

### IdbCollection CRUD Tests (19 tests)
- ✅ add — should add a record
- ✅ add — should emit add event
- ✅ get — should get a record by id
- ✅ getAll — should return all records
- ✅ put — should upsert a record
- ✅ update — should merge data into existing record
- ✅ delete — should delete a record
- ✅ where — should filter by direct equality
- ✅ where — should filter with gt operator
- ✅ where — should filter with in operator
- ✅ where — should filter with contains operator
- ✅ where — should support sorting
- ✅ where — should support first/last
- ✅ updateWhere — should update all matching records
- ✅ deleteWhere — should delete all matching records
- ✅ count — should count all records without query
- ✅ count — should count matching records with query
- ✅ batchAdd — should add multiple records in one transaction
- ✅ silent mode — should not emit events when silent=true

### pathResolver (10 tests) + IdbEngine (12 tests) — from S6-01/S6-02
- ✅ 22/22 passing

## TypeScript Check

```
tsc --noEmit — ✅ No errors
```

## Acceptance Criteria

- ✅ Adapté depuis collection.svelte.ts → .ts pur (aucun .svelte.ts)
- ✅ Méthodes: getAll(), where(q), get(id), add(d), put(d), update(id, d), delete(id), updateWhere(q,d), deleteWhere(q), count(q)
- ✅ Sur chaque mutation : appelle eventBus.emit(collection, op, data) (injection de dépendance)
- ✅ Tests CRUD avec fake-indexeddb (19/19)

✅ All tests passed
