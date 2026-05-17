# S15-02 Test Results — TypeScript check

## TypeScript check
- Command: `pnpm run check`
- Result: **26 errors, 11 warnings** (all pre-existing)
- New code: 0 errors introduced

## Pre-existing errors (not from sprint work):
- 3x Icon import errors (CardPicker, FieldEditor, Confirm) — @iconify/svelte API change
- 13x machineCRUD/machineSyncDestroy test errors — QoolieCollection type mismatch
- 3x skiller package errors — outside idae-machine scope
- 2x ExplorerActions errors — pre-existing
- 2x PaneRight errors — pre-existing
- 3x other warnings — pre-existing

## Client tests: 330/330 ✅
## Server tests: 82/82 ✅
