# Test Report — S1-02: Fix inconsistent reactivity on multi-store updates

**Date:** 2026-04-06  
**Tester:** Léo (Developer mode)  
**Result:** ✅ PASS

---

## Summary

Fixed inconsistent reactive state updates when multiple stores are modified by:
1. **Removing duplicate event emission** — The proxy wrapper was firing events AND the methods were firing events, causing duplicate entries in reactive state
2. **Adding `whereClause` support** — `updateWhere` and `deleteWhere` now properly use the `whereClause` property to match items for updates/deletes
3. **Adding batch operation support** — `batchAdd` and `batchPut` events are now handled correctly in both `idbqlEvent.svelte.ts` and `statorAdapter.ts`

---

## Root Cause Analysis

**Problem:** Reactive state had duplicate entries and inconsistent updates when:
- Multiple stores were updated in parallel
- `updateWhere`/`deleteWhere` were called (events used wrong matching logic)
- Batch operations were performed (events weren't handled)

**Root Causes Identified:**
1. **Double event emission:** The `createIDBStoreProxy` wrapper fired events for write operations, but the methods themselves ALSO fired events internally → 2x events → 2x entries in reactive state
2. **Wrong matching logic:** `updateWhere`/`deleteWhere` used the `data` payload for matching instead of the `whereClause`
3. **Missing event handlers:** `batchAdd`/`batchPut` event types weren't defined or handled

---

## Test Results

### Multi-store Reactivity Tests (9/9 pass)

| Test | Result | Duration |
|------|--------|----------|
| Sequential multi-store updates | ✅ Pass | 4ms |
| Parallel updates to multiple stores | ✅ Pass | 2ms |
| Update same entity across stores | ✅ Pass | 1ms |
| deleteWhere across multiple stores | ✅ Pass | 2ms |
| Rapid updateWhere on multiple stores | ✅ Pass | 3ms |
| Batch operations across stores | ✅ Pass | 8ms |
| Event order for causal operations | ✅ Pass | 1ms |
| No event loss under high concurrency | ✅ Pass | 3ms |
| Mixed read/write without race conditions | ✅ Pass | 3ms |

**Total test duration:** 27ms

### Full Collection Test Suite (35/35 pass)

- collection.test.ts: 14/14 ✅
- collection.stress.test.ts: 9/9 ✅
- collection-multistore.test.ts: 9/9 ✅
- collection.svelte.unit.test.ts: 3/3 ✅

---

## Code Changes

### File: `src/lib/collection/collection.svelte.ts`

**Changes:**
1. Simplified `createIDBStoreProxy` to passthrough only (no event emission)
2. All methods emit events directly with correct payloads
3. `batchAdd` and `batchPut` now include full `data` array in events

### File: `src/lib/state/idbqlEvent.svelte.ts`

**Changes:**
1. Added `batchAdd` and `batchPut` to `EventType`
2. Added `whereClause` and `count` to `EventData` interface
3. Fixed `updateWhere` to use `whereClause` for matching when available
4. Fixed `deleteWhere` to use `whereClause` for matching when available
5. Added `batchAdd` handler — pushes array of items to state
6. Added `batchPut` handler — upserts array of items to state

### File: `src/lib/state/statorAdapter.ts`

**Changes:**
1. Added `batchAdd` and `batchPut` to `IdbqlEventPayload.op` type
2. Fixed `updateWhere` to use `whereClause` for matching
3. Fixed `deleteWhere` to use `whereClause` for matching
4. Added `batchAdd` handler
5. Added `batchPut` handler

---

## Acceptance Criteria Verification

- [x] Reproduce the inconsistency scenario ✅
- [x] Fix event propagation (removed duplicate emission) ✅
- [x] Add test case for multi-store update reactivity ✅
- [x] Verify Svelte components react correctly to cross-store changes ✅

---

## Impact

**Before fix:**
- Duplicate entries in reactive state (2x items after each operation)
- `updateWhere`/`deleteWhere` didn't update reactive state correctly
- Batch operations didn't update reactive state at all

**After fix:**
- Reactive state stays in sync with IndexedDB
- Multi-store operations maintain consistency
- All 35 tests pass

---

## Next Steps

Story S1-02 is **COMPLETE**. Moving to S1-03: Add comprehensive unit tests for CollectionCore CRUD.
