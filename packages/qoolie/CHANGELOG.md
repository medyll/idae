# Changelog

## [0.0.6] - 2026-08-07
**Bug Fixes:**
- drop the add-skill bin, which never had a source
- emit the svelte adapter so the "./svelte" export resolves
- build packages before publishing them

**Chores:**
- publish packages
- publish packages
- publish packages
- update dependencies across the workspace



## [0.0.5] - 2026-08-05
**Bug Fixes:**
- drop the add-skill bin, which never had a source
- emit the svelte adapter so the "./svelte" export resolves
- build packages before publishing them

**Chores:**
- publish packages
- publish packages
- update dependencies across the workspace



## [0.0.4] - 2026-08-05
**Bug Fixes:**
- emit the svelte adapter so the "./svelte" export resolves
- build packages before publishing them

**Chores:**
- publish packages
- update dependencies across the workspace



## [0.0.3] - 2026-08-05
**Bug Fixes:**
- build packages before publishing them

**Chores:**
- update dependencies across the workspace



## [0.0.2] - 2026-07-29
**Features:**
- update README with new package details and multi-database management example
- enhance query types with operator-keyed support and additional operator definitions
- update ExplorerTableInline to use $derived for store items
- S35-07 build qoolie dist, fix workspace-types stub
- S35-01/02/04/05 HydrationController, revalidate, autoHydrate
- S35-03 bulkUpsertSilent on IdbCollection
- Add planning details for Sprint 26 and Sprint 27; update status.yaml with new goals and stories
- Enhance idae-machine and idae-api with new features and improvements
- Refactor imports and enhance type definitions across multiple components
- Update status.yaml for Sprint 6 planning and add new stories for engine internalization
- remove signals.dataVersion + bumpDataVersion workaround
- adapters/svelte/ — useQoolieCollection + useQoolieSync
- rewire Qoolie to internal engine, remove @medyll/idae-idbql
- engine/IdbState.ts — CollectionState + createIdbState
- engine/IdbCollection.ts + engine/IdbEventBus.ts
- engine/IdbSchema.ts + engine/IdbEngine.ts
- engine/types.ts + engine/pathResolver.ts
- enhance slider functionality and improve touch event handling
- add Multi-Database Support
- add Conflict Resolution
- add Data Validation & Schema Enforcement
- add Sprint 5 - Advanced Data Management
- add Health Check & Status API
- add Svelte 5 Reactivity documentation and exports
- add Query Operators documentation and types from idae-query
- add Sprint 4 - Integration with idae-idbql and idae-api
- implement Sprint 3 - Advanced Features & Tooling
- add Sprint 3 - Advanced Features & Tooling
- Add JWT authentication support for sync operations in Qoolie
- Add QoolieCollection and SyncController for CRUD and sync operations

**Bug Fixes:**
- kill FK-multiple, converge fold into one qoolie primitive
- hydrate IDB from /api/data namespace with proper JWT auth
- prevent IDB store-creation races (D1/D2/D3) and let qoolie own schema upgrades
- dedup hydration on _id to stop autoIncrement duplication
- adapter svelte
- update test results and improve hydration handling in useQoolieCollection
- hydrate full collection by forwarding limit=0 through encoded params
- fix qoolie tsc build errors

**Documentation:**
- document idae-api client integration

**Refactoring:**
- single push transport via qoolie, close FABLE Phase 4
- update collection names and references in PaneRecents and PaneRight components

**Chores:**
- sprint 6 complete — 8/8 stories done
- update status after S6-07 completion
- update status after S6-06 completion
- update status after S6-05 completion
- update status after S6-03+S6-04 completion
- update status after S6-02 completion
- update status after S6-01 completion
- update dependencies and remove deprecated packages
- mark Sprint 4 as complete
- mark S2-03 QueryBuilder as skipped, Sprint 2 complete

**Other:**
- Refactor code structure for improved readability and maintainability
- fix : fix
- Refactor code structure for improved readability and maintainability


