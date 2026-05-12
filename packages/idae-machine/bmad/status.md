# BMAD Status — idae-machine

**Project:** @medyll/idae-machine  
**Last Updated:** 2026-05-12

---

## Current State

| Area | Status |
|------|--------|
| Core machine (Machine, MachineDb, MachineScheme) | ✅ Stable |
| Schema field builder `field()` | ✅ Done |
| `TplFieldRulesObject` in idae-idbql | ✅ Done |
| MachineParserForge (string + object rules) | ✅ Done |
| UI hierarchy (explorer/card/field/input) | ✅ Done |
| FieldDisplay type dispatch | ✅ Done |
| Demo schemas migrated to `field()` | ✅ Done |
| Server (Express + MongoDB) | ✅ Built, untested |
| MachineFieldType registry wired to format() | ❌ TODO |
| Rights / `#checkAccess()` | ❌ TODO (stub) |
| FK show mode (display label not raw id) | ❌ TODO |
| Tests (most sprints) | ⚠️ Untested |

---

## Component rename map (old → new)

| Old | New | Folder |
|-----|-----|--------|
| `CollectionList` | `ExplorerCollections` | `explorer/` |
| `DataList` | `ExplorerList` | `explorer/` |
| `DataListActions` | `ExplorerActions` | `explorer/` |
| `FilterBar` | `ExplorerFilter` | `explorer/` |
| `CollectionCard` | `ExplorerCard` | `explorer/` |
| `CollectionTable` | `ExplorerTable` | `explorer/` |
| `DataForm` | `CardForm` | `card/` |
| `DataCreate` | `CardCreate` | `card/` |
| `DataEdit` | `CardEdit` | `card/` |
| `DataListFields` | `CardFields` | `card/` |
| `DataProvider` | `CardProvider` | `card/` |
| `DataPicker` | `CardPicker` | `card/` |
| `DataLinks` | `CardFk` | `card/` |
| `DataLinksBack` | `CardRfk` | `card/` |
| `FieldCurrency` | `InputCurrency` | `input/` |
| `FieldEmail` | `InputEmail` | `input/` |

---

## Next Actions (priority order)

1. Wire `MachineSchemeFieldType` registry into `MachineSchemeValues.format()`
2. Implement FK label display in `FieldDisplay` show mode
3. Run `pnpm run test` + `pnpm run check`
4. Implement `#checkAccess()` with user context
5. Publish npm

---

## Dependencies

| Package | Status |
|---------|--------|
| `@medyll/idae-idbql` | ✅ (extended with TplFieldRulesObject) |
| `@medyll/idae-slotui-svelte` | ✅ |
| `@medyll/idae-router` | ✅ |
| `@medyll/idae-socket` | ✅ |
