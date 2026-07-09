# Test Results — S48-02: MachineRights enumeration — allowedCollections(op)

**Story:** S48-02 (BL-11)
**Date:** 2026-06-23
**Command:** `pnpm test -- --project server machineRights.test.ts`

## Summary

✅ All tests passed

## Results

```
✓ server src/lib/main/__tests__/machineRights.test.ts (26 tests) 9ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
```

## S48-02 coverage

The `allowedCollections` describe block adds 6 new assertions:

- returns all collections in open mode
- filters collections by operation in auth mode
- respects ops policy structural deny
- includes collections with explicit grants
- includes collections with admin override
- returns empty array when no collections match

## Implementation notes

- Added `MachineRights.allowedCollections(operation: PermissionCode = 'R'): string[]` in `src/lib/main/machine/MachineRights.ts`.
- Enumerates known rights policies and filters via existing `checkAccess()` so all resolution rules (ops, public, grants, admin, default) are respected.
- > Assumed: keeping enumeration scoped to registered rights policies is sufficient for the menu-generator use case; collections without a policy entry are not returned. This matches the existing `loadPoliciesFromModel` contract and avoids coupling `MachineRights` to `machine.logic`.

## Full suite note

A full `pnpm run test` run shows one unrelated pre-existing failure in `src/lib/main/__tests__/componentRegistryEntries.test.ts` (expects 15 registry entries, currently 16). This failure is outside S48-02 scope.
