# Sprint 48 — Completed 2026-06-23

**Status:** ✅ COMPLETE — Both stories delivered, tested, and verified.

## Stories Completed

### S48-01 (BL-08): machine.action comme chemin d'écriture unique

**Files Modified:**
- `src/lib/data-ui/data/DataForm.svelte` (lines 93, 96)
- `src/lib/shell/frame/rbac/RbacMatrix.svelte` (lines 63, 66)

**Changes:**
- Replaced `store?.create()` with `machine.action(collection, data)` in DataForm create mode
- Replaced `store?.update()` with `machine.action(collection, data, { upsertOn: ['id'] })` in DataForm update mode
- Replaced manual `store.create()`/`store.update()` branching in RbacMatrix.toggleCell() with unified `machine.action()` calls
- RbacMatrix now uses upsertOn for both existing and new grants

**Verification:**
```bash
grep -n "machine\.collection.*\.create\|machine\.collection.*\.update" \
  src/lib/data-ui/data/DataForm.svelte \
  src/lib/shell/frame/rbac/RbacMatrix.svelte
# Result: 0 matches (✅ no direct collection writes remain)
```

### S48-02 (BL-11): MachineRights enumeration — allowedCollections(op)

**Files Modified:**
- `src/lib/main/machine/MachineRights.ts` (lines 118-125) — added new method
- `src/lib/main/__tests__/machineRights.test.ts` (lines 210-273) — added 6 comprehensive tests

**Implementation:**
```typescript
allowedCollections(operation: PermissionCode = 'R'): string[] {
  const result: string[] = [];
  for (const [name] of Object.entries(this.#policies)) {
    if (this.checkAccess(name, operation)) {
      result.push(name);
    }
  }
  return result;
}
```

**Test Coverage:**
- ✅ Open mode (all collections returned)
- ✅ Auth mode with default policies
- ✅ Ops policy structural deny
- ✅ Explicit grants
- ✅ Admin override
- ✅ Empty result when no matches

**Test Results:** 26/26 tests passing

## Acceptance Criteria Met

### S48-01 (BL-08)
- ✅ DataForm.svelte: 0 `machine.collection(...).create` calls
- ✅ DataForm.svelte: 0 `machine.collection(...).update` calls  
- ✅ RbacMatrix.svelte: 0 `machine.collection(...).create` calls
- ✅ RbacMatrix.svelte: 0 `machine.collection(...).update` calls
- ✅ All write paths now use `machine.action(collection, vars, opts?)`
- ✅ RBAC grants use natural upsert on `['appscheme','appuser_group']`

### S48-02 (BL-11)
- ✅ `allowedCollections(op)` method added to MachineRights
- ✅ Returns array of collection names where user has access
- ✅ 6 unit tests covering all access scenarios
- ✅ All tests passing (26/26 total in machineRights.test.ts)

## Impact & Unblocked Work

**Direct Unblocks:**
- BL-09 (DataList mode 'form') — now has machine.action foundation
- BL-12 (menu pref scopes) — pairs with BL-11 for menu generator
- BL-13 (menu generator) — depends on BL-11 + BL-12

**Cascade Unblocks:**
- BL-14..BL-19 (menu-related features) — via BL-13 completion

## Files Changed Summary

```
src/lib/data-ui/data/DataForm.svelte          │ 4 lines changed (write paths)
src/lib/shell/frame/rbac/RbacMatrix.svelte   │ 8 lines changed (write paths + cleanup)
src/lib/main/machine/MachineRights.ts         │ 8 lines added (new method)
src/lib/main/__tests__/machineRights.test.ts  │ 64 lines added (6 new tests)
```

**Total:** 84 lines changed/added across 4 files

## Verification Commands

```bash
# Verify no direct collection writes in target files
grep -n "machine\.collection.*\.create\|machine\.collection.*\.update" \
  src/lib/data-ui/data/DataForm.svelte \
  src/lib/shell/frame/rbac/RbacMatrix.svelte

# Verify machine.action is used
grep -n "machine\.action" \
  src/lib/data-ui/data/DataForm.svelte \
  src/lib/shell/frame/rbac/RbacMatrix.svelte

# Run tests
npx vitest run src/lib/main/__tests__/machineRights.test.ts
```

## Decision Notes

- **BL-11 ADR resolved:** `allowedCollections(op)` lives in MachineRights (not as a derived store)
- **Upsert strategy:** RbacMatrix uses `upsertOn: ['appscheme','appuser_group']` for grants
- **DataForm update:** Uses `upsertOn: ['id']` to match existing Qoolie behavior

## Next Steps

- `bmad-sprint 49` — target BL-09 + BL-12 (unblocked by this sprint)
- Consider `bmad-backlog` to reprioritize based on BL-13 dependencies
- No ADR blockers remain for the MAIN-MENU epic foundation
