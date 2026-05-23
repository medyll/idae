# Sprint 33 — Test Results

**Date:** 2026-05-23
**Sprint:** RBAC Matrix UI

## Stories Closed

### S33-01 — SKIPPED
`deployModel.ts:380-430` auto-generates `_views` from `template.presentation` already. No-op for RBAC collections (auto fallback to `allFieldNames.slice(0,5)` works).

### S33-03 — RbacMatrix frame — DONE
- `src/lib/shell/frame/rbac/RbacMatrix.svelte` (composition glue ~180 lines).
- Rows = `machine.logic.collections()` filtered (excludes appscheme/session/audit).
- Cells = `<InputBoolean>` with onchange handler → lookup-or-create grant + update single op.
- Group selector dropdown (reads `machine.store.appuser_group`).
- Column bulk toggle (all-on → all-off / partial → all-on).
- Sticky thead + first col.
- `InputBoolean.svelte` extended: new `onchange?: (next: boolean) => void` prop.
- `Frame.svelte` forwards `vars.groupId` + `vars.typeId` to component props.
- `componentRegistry`: new `'rbac.matrix'` key.
- `CollectionNav.svelte`: "Permissions" entry above collection list, triggers `machine.loadFrame('rbac.matrix', 'appuser_grant')`.

### S33-06 — Tests — DONE
- `src/lib/main/__tests__/rbacMatrix.test.ts` (4 tests: registry wiring, module resolves, grant payload contract, OPS shape).
- `componentRegistryEntries.test.ts` updated: 3 entries (added rbac.matrix).

## Test Run
```
pnpm vitest run → 464/464 passed (39 files), 3.62s
```

## TypeScript Check
```
pnpm run check → 16 pre-existing errors surface (MachineRouter RouterInstance, machineParserForge ImageFieldDef, machineIdbAdapter IDBDatabase.objectStore, machineModelBuilder, MachineSchemeField, MachineScheme _views cast, DataList sortBy generic).
NONE introduced by Sprint 33 changes — confirmed via git stash diff isolation.
```
**Backlog item I-CHECK:** pre-existing TS errors that surface intermittently. Original audit ran with stale `.svelte-kit/types` cache reporting 0 errors. Real baseline = 16 errors. Separate cleanup sprint warranted.

## Verdict
PASS. RbacMatrix functional. Tests green. No regressions.
