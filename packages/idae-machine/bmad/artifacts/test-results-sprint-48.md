# Test Results — Sprint 48

**Sprint:** 48 — RBAC write-path unification + menu rights foundation
**Date:** 2026-06-23
**Command:** pnpm run test

## Summary

✅ All tests passed

- Test files: 66 passed
- Tests: 702 passed

## Notes

- S48-01: DataForm.svelte and RbacMatrix.svelte use machine.action for writes.
- S48-02: MachineRights.allowedCollections(op) implemented and tested.
- Fixed stale componentRegistryEntries.test.ts — updated expected registry count from 15 to 16 and added contextmenu entry.

## Raw output

> @medyll/idae-machine@0.136.0 test D:\development\idae\packages\idae-machine
> npm run test:unit -- --run

npm warn config ignoring workspace config at D:\development\idae\packages\idae-machine/.npmrc
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "overrides". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "_medyll-registry". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> @medyll/idae-machine@0.136.0 test:unit
> vitest --run


[1m[46m RUN [49m[22m [36mv4.1.2 [39m[90mD:/development/idae/packages/idae-machine[39m

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/componentRegistryEntries.test.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 8[2mms[22m[39m
[90mstdout[2m | src/lib/ai/streamIntoRecord.test.ts[2m > [22m[2mstreamIntoRecord[2m > [22m[2mshould handle abort signal
[22m[39m[streamIntoRecord] Stream aborted

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/ai/streamIntoRecord.test.ts [2m([22m[2m5 tests[22m[2m)[22m[33m 345[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineRouter.test.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 204[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineMobileSeed.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineFkFeed.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/rbacMatrix.test.ts[2m > [22m[2mRbacMatrix ÔÇö registry wiring[2m > [22m[2mrbac.matrix resolves to RbacMatrix.svelte module
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/rbacMatrix.test.ts[2m > [22m[2mRbacMatrix ÔÇö registry wiring[2m > [22m[2mrbac.matrix resolves to RbacMatrix.svelte module
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineMobileSeed.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineFkFeed.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö init + boot (fake-indexeddb)[2m > [22m[2mstarts without error and exposes logic
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineMobileSeed.test.ts[2m > [22m[2mS36-05: BL-01 mobile-first auto-seed[2m > [22m[2mcalls seed with onlyIfEmpty on boot when mode=mobile-first and seed provided
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineMobileSeed.test.ts[2m > [22m[2mS36-05: BL-01 mobile-first auto-seed[2m > [22m[2mdoes NOT call seed when mode=server-first
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineMobileSeed.test.ts[2m > [22m[2mS36-05: BL-01 mobile-first auto-seed[2m > [22m[2mdoes NOT call seed when mode=mobile-first but no seed provided
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineMobileSeed.test.ts[2m > [22m[2mS36-05: BL-01 mobile-first auto-seed[2m > [22m[2mdoes NOT call seed when sync is false
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mshould create named instance and store in registry
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö init + boot (fake-indexeddb)[2m > [22m[2mmachine.store is a function after boot
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mshould retrieve instance by name using instance
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineMobileSeed.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 8[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineFkFeed.test.ts[2m > [22m[2mFK denorm feed on write (machine.collection)[2m > [22m[2mcreate() folds the FK target snapshot into record.fks.<field>
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö init + boot (fake-indexeddb)[2m > [22m[2mmachine.collection(vehicle) exposes where() and getAll()
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts[2m > [22m[2mMachineSchemeValidate - FK required[2m > [22m[2mmissing required FK fails in form
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mshould create collections and store on boot
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts[2m > [22m[2mS11-04: machine.sync + machine.destroy()[2m > [22m[2mmachine.init({sync:false})[2m > [22m[2mstarts without error
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mmachine.boot() with demoScheme ÔÇö zero errors[2m > [22m[2mstarts without throwing
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineFkFeed.test.ts[2m > [22m[2mFK denorm feed on write (machine.collection)[2m > [22m[2mpresentation() resolves the target template once fed
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mshould expose accessors for logic and store (qoolie-backed)
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö init + boot (fake-indexeddb)[2m > [22m[2mmachine.logic.collection(vehicle) resolves schema
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts[2m > [22m[2mS11-04: machine.sync + machine.destroy()[2m > [22m[2mmachine.init({sync:false})[2m > [22m[2mmachine.sync throws "not enabled"
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mmachine.boot() with demoScheme ÔÇö zero errors[2m > [22m[2mexposes all 6 collections via machine.collection()
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineFkFeed.test.ts[2m > [22m[2mFK denorm feed on write (machine.collection)[2m > [22m[2mupdate() re-folds when the FK scalar changes
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts[2m > [22m[2mMachineSchemeValidate - FK required[2m > [22m[2mnon-required FK relation does not block form
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mmachine.store() (S35-00)[2m > [22m[2mreturns an object with an items property
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö init + boot (fake-indexeddb)[2m > [22m[2mmachine.logic.collection(vehicle).field(license_plate) parses type
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts[2m > [22m[2mMachineSchemeValidate - FK required[2m > [22m[2mflat scalar FK value satisfies required check
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö init + boot (fake-indexeddb)[2m > [22m[2mmachine.logic.collection(vehicle).parseFks() returns category
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts[2m > [22m[2mMachineSchemeValidate - FK required[2m > [22m[2mnested fks.{relation}_{id} value satisfies required check
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö init + boot (fake-indexeddb)[2m > [22m[2munknown collection throws MachineError
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts[2m > [22m[2mMachineSchemeValidate - FK required[2m > [22m[2mnested fks.{relation} object value satisfies required check
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/rbacMatrix.test.ts [2m([22m[2m4 tests[22m[2m)[22m[33m 8147[2mms[22m[39m
     [33m[2mÔ£ô[22m[39m rbac.matrix resolves to RbacMatrix.svelte module [33m 8115[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineSchemeValidate.test.ts[2m > [22m[2mMachineSchemeValidate - FK required[2m > [22m[2mignoreFields skips required FK check
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineFkFeed.test.ts[2m > [22m[2mFK denorm feed on write (machine.collection)[2m > [22m[2mleaves non-FK collections untouched (no fks key added)
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mmachine.boot() with demoScheme ÔÇö zero errors[2m > [22m[2mthrows for nonexistent collection
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mcategory collection ÔÇö full CRUD[2m > [22m[2mcreate returns doc with id
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineSchemeValidate.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 211[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineFkFeed.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 171[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mcategory collection ÔÇö full CRUD[2m > [22m[2mgetAll returns created doc
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö boot with remote schema (mocked fetch)[2m > [22m[2mboot fetches model and starts machine
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mcategory collection ÔÇö full CRUD[2m > [22m[2mupdate returns modified doc
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts[2m > [22m[2mS11-04: machine.sync + machine.destroy()[2m > [22m[2mmachine.init({sync: {...}})[2m > [22m[2mforwards sync config to createQoolie
[22m[39mIdaeUserScopePolicy initialized with machine instance

stderr | src/lib/main/__tests__/machine.test.ts > Machine > boot() remote schema loading > fetches schema, sets business model, and starts machine
[idae-machine] Schema cache read failed ÔÇö will fetch fresh: ReferenceError: indexedDB is not defined
    at D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:13:15
    at new Promise (<anonymous>)
    at openCacheDb (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:12:9)
    at readSchemaCache (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:24:23)
    at loadSchema (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaLoader.ts:24:24)
    at Machine.boot (D:/development/idae/packages/idae-machine/src/lib/main/machine.ts:261:10)
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at D:/development/idae/packages/idae-machine/src/lib/main/__tests__/machine.test.ts:122:4
    at file:///D:/development/idae/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:20

stderr | src/lib/main/__tests__/machine.test.ts > Machine > boot() remote schema loading > fetches schema, sets business model, and starts machine
[idae-machine] Schema cache write failed: ReferenceError: indexedDB is not defined
    at D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:13:15
    at new Promise (<anonymous>)
    at openCacheDb (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:12:9)
    at writeSchemaCache (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:49:23)
    at loadSchema (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaLoader.ts:47:9)
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at Machine.boot (D:/development/idae/packages/idae-machine/src/lib/main/machine.ts:261:4)
    at D:/development/idae/packages/idae-machine/src/lib/main/__tests__/machine.test.ts:122:4
    at file:///D:/development/idae/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2mgetAll[2m > [22m[2mreturns all records for a valid collection
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mboot() remote schema loading[2m > [22m[2mfetches schema, sets business model, and starts machine
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts[2m > [22m[2mS11-04: machine.sync + machine.destroy()[2m > [22m[2mmachine.init({stateEngine})[2m > [22m[2mforwards stateEngine:stator without error
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö boot with remote schema (mocked fetch)[2m > [22m[2mboot ÔåÆ collection(vehicle) accessible
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mcategory collection ÔÇö full CRUD[2m > [22m[2mdelete returns true, getAll no longer contains it
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts[2m > [22m[2mS11-04: machine.sync + machine.destroy()[2m > [22m[2mmachine.destroy()[2m > [22m[2mafter boot() ÔåÆ machine._qoolie === undefined
[22m[39mIdaeUserScopePolicy initialized with machine instance

stderr | src/lib/main/__tests__/machine.test.ts > Machine > boot() auto-loads remote schema (S34-01) > starts immediately with local model when databaseHost is set
[idae-machine] Schema cache read failed ÔÇö will fetch fresh: ReferenceError: indexedDB is not defined
    at D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:13:15
    at new Promise (<anonymous>)
    at openCacheDb (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:12:9)
    at readSchemaCache (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:24:23)
    at loadSchema (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaLoader.ts:24:24)
    at Machine.boot (D:/development/idae/packages/idae-machine/src/lib/main/machine.ts:261:10)
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at D:/development/idae/packages/idae-machine/src/lib/main/__tests__/machine.test.ts:139:4
    at file:///D:/development/idae/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö boot with remote schema (mocked fetch)[2m > [22m[2mboot ÔåÆ logic.collection(vehicle) resolves
[22m[39mIdaeUserScopePolicy initialized with machine instance

stderr | src/lib/main/__tests__/machine.test.ts > Machine > boot() auto-loads remote schema (S34-01) > starts immediately with local model when databaseHost is set
[idae-machine] Schema cache write failed: ReferenceError: indexedDB is not defined
    at D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:13:15
    at new Promise (<anonymous>)
    at openCacheDb (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:12:9)
    at writeSchemaCache (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:49:23)
    at loadSchema (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaLoader.ts:47:9)
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at Machine.boot (D:/development/idae/packages/idae-machine/src/lib/main/machine.ts:261:4)
    at D:/development/idae/packages/idae-machine/src/lib/main/__tests__/machine.test.ts:139:4
    at file:///D:/development/idae/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2mgetAll[2m > [22m[2mreturns empty array when no records exist
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö boot with remote schema (mocked fetch)[2m > [22m[2mboot resolves without error on subsequent calls
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mboot() auto-loads remote schema (S34-01)[2m > [22m[2mstarts immediately with local model when databaseHost is set
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2mwhere[2m > [22m[2mfilters records by field value
[22m[39mIdaeUserScopePolicy initialized with machine instance

stderr | src/lib/main/__tests__/machine.test.ts > Machine > boot() auto-loads remote schema (S34-01) > throws when no local model and fetch fails (databaseHost set)
[idae-machine] Schema cache read failed ÔÇö will fetch fresh: ReferenceError: indexedDB is not defined
    at D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:13:15
    at new Promise (<anonymous>)
    at openCacheDb (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:12:9)
    at readSchemaCache (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:24:23)
    at loadSchema (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaLoader.ts:24:24)
    at Machine.boot (D:/development/idae/packages/idae-machine/src/lib/main/machine.ts:261:10)
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at D:/development/idae/packages/idae-machine/src/lib/main/__tests__/machine.test.ts:154:4
    at file:///D:/development/idae/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts[2m > [22m[2mS11-04: machine.sync + machine.destroy()[2m > [22m[2mmachine.collection(name)[2m > [22m[2mafter boot() returns QoolieCollection with CRUD verbs
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mcategory collection ÔÇö full CRUD[2m > [22m[2mcount returns correct integer
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mboot() auto-loads remote schema (S34-01)[2m > [22m[2mstarts normally without databaseHost (no auto-fetch)
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2msort[2m > [22m[2msorts items ascending
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineClient.test.ts[2m > [22m[2mMachine ÔÇö boot with remote schema (mocked fetch)[2m > [22m[2mboot resolves without error on subsequent calls
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mboot() auto-loads remote schema (S34-01)[2m > [22m[2mstarts normally with sync: false (no auto-fetch)
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mvehicle collection ÔÇö CRUD + where filter[2m > [22m[2mcreate returns doc with id
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSyncDestroy.test.ts[2m > [22m[2mS11-04: machine.sync + machine.destroy()[2m > [22m[2mmachine.init({hooks})[2m > [22m[2mforwards hooks without error
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2msort[2m > [22m[2msorts items descending
[22m[39mIdaeUserScopePolicy initialized with machine instance

stderr | src/lib/main/__tests__/machine.test.ts > Machine > boot() auto-loads remote schema (S34-01) > pulls data from server when databaseHost is set (mocked fetch)
[idae-machine] Schema cache read failed ÔÇö will fetch fresh: ReferenceError: indexedDB is not defined
    at D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:13:15
    at new Promise (<anonymous>)
    at openCacheDb (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:12:9)
    at readSchemaCache (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:24:23)
    at loadSchema (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaLoader.ts:24:24)
    at Machine.boot (D:/development/idae/packages/idae-machine/src/lib/main/machine.ts:261:10)
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at D:/development/idae/packages/idae-machine/src/lib/main/__tests__/machine.test.ts:212:4
    at file:///D:/development/idae/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mvehicle collection ÔÇö CRUD + where filter[2m > [22m[2mwhere filters correctly
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2msort[2m > [22m[2msupports multi-sort chain
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineClient.test.ts [2m([22m[2m11 tests[22m[2m)[22m[33m 427[2mms[22m[39m
stderr | src/lib/main/__tests__/machine.test.ts > Machine > boot() auto-loads remote schema (S34-01) > pulls data from server when databaseHost is set (mocked fetch)
[idae-machine] Schema cache write failed: ReferenceError: indexedDB is not defined
    at D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:13:15
    at new Promise (<anonymous>)
    at openCacheDb (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:12:9)
    at writeSchemaCache (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaCache.ts:49:23)
    at loadSchema (D:/development/idae/packages/idae-machine/src/lib/main/machineSchemaLoader.ts:47:9)
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at Machine.boot (D:/development/idae/packages/idae-machine/src/lib/main/machine.ts:261:4)
    at D:/development/idae/packages/idae-machine/src/lib/main/__tests__/machine.test.ts:212:4
    at file:///D:/development/idae/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:20

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineSyncDestroy.test.ts [2m([22m[2m10 tests[22m[2m)[22m[33m 381[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mvehicle collection ÔÇö CRUD + where filter[2m > [22m[2mupdate modifies vehicle
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mboot() auto-loads remote schema (S34-01)[2m > [22m[2mpulls data from server when databaseHost is set (mocked fetch)
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mintegration: MachineDb/MachineScheme[2m > [22m[2mshould access a collection and its template
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2mgroup[2m > [22m[2mgroups items by field value
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mvehicle collection ÔÇö CRUD + where filter[2m > [22m[2mdelete removes vehicle
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mintegration: MachineDb/MachineScheme[2m > [22m[2mshould access a field and parse its metadata
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mvehicle collection ÔÇö CRUD + where filter[2m > [22m[2mcount returns correct number
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mintegration: MachineDb/MachineScheme[2m > [22m[2mshould parse all fields of a collection
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2mpagination[2m > [22m[2mslices items by page size
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mintegration: MachineDb/MachineScheme[2m > [22m[2mshould validate a valid field value
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2merror handling[2m > [22m[2mthrows for unknown collection
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mcustomer collection ÔÇö CRUD[2m > [22m[2mfull CRUD cycle
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machine.test.ts[2m > [22m[2mMachine[2m > [22m[2mintegration: MachineDb/MachineScheme[2m > [22m[2mshould throw MachineError for invalid field
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2merror handling[2m > [22m[2msafeCollection returns null for unknown collection
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mrental collection ÔÇö CRUD with FK references[2m > [22m[2mcreate rental with FK ids
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/dataList.test.ts[2m > [22m[2mDataList data operations[2m > [22m[2mdefaultSort[2m > [22m[2minfers defaultSort from schema
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mrental collection ÔÇö CRUD with FK references[2m > [22m[2mwhere filters by status
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mrental collection ÔÇö CRUD with FK references[2m > [22m[2mupdate and delete
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mlocation_office collection ÔÇö CRUD[2m > [22m[2mfull CRUD cycle
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mmaintenance collection ÔÇö CRUD with FK reference[2m > [22m[2mfull CRUD cycle
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2mall 6 collections ÔÇö data survives full cycle[2m > [22m[2mcreate + getAll on every collection
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2medge cases[2m > [22m[2mcount with query filter
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machine.test.ts [2m([22m[2m23 tests[22m[2m)[22m[33m 422[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/dataList.test.ts [2m([22m[2m11 tests[22m[2m)[22m[33m 342[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2medge cases[2m > [22m[2mdelete non-existent id returns true (IndexedDB idempotent)
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineCRUD.test.ts[2m > [22m[2mS11-01: machine.collection() IDB CRUD round-trip[2m > [22m[2medge cases[2m > [22m[2mupdate non-existent id upserts
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineCRUD.test.ts [2m([22m[2m23 tests[22m[2m)[22m[33m 584[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineActivity.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 37[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineHistory.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 33[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/idae/fieldcatalog/__tests__/defaultFieldTypesDef.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/idae/rights/__tests__/RightsPolicy.test.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 11[2mms[22m[39m
Warning: A vi.mock("$lib/main/machine.js") call in "D:/development/idae/packages/idae-machine/src/lib/data-ui/fragments/ContextMenuContent.svelte.test.ts" is not at the top level of the module. Although it appears nested, it will be hoisted and executed before any tests run. Move it to the top level to reflect its actual execution order. This will become an error in a future version.
See: https://vitest.dev/guide/mocking/modules#how-it-works
Warning: A vi.mock("$lib/main/machine.js") call in "D:/development/idae/packages/idae-machine/src/lib/data-ui/fragments/ContextMenu.svelte.test.ts" is not at the top level of the module. Although it appears nested, it will be hoisted and executed before any tests run. Move it to the top level to reflect its actual execution order. This will become an error in a future version.
See: https://vitest.dev/guide/mocking/modules#how-it-works
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineRights.test.ts [2m([22m[2m26 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m client [49m[39m src/__tests__/mcp-client.svelte.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 31[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/machine/__tests__/validateRules.test.ts [2m([22m[2m38 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/frameManager.test.ts [2m([22m[2m24 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machinePrefs.test.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/presentationFkSuffix.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 15[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineRelationHelpers.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineValidationStress.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 11[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineRelationHelpers.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineRelationHelpers.test.ts[2m > [22m[2mMachine relation helpers
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineRelationHelpers.test.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/MachineFieldType.test.ts [2m([22m[2m23 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/storage/__tests__/storage-adapters.test.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 11[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/schemeList.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineSchemaFromModel.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/schemeList.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineSchemaFromModel.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/schemeList.test.ts[2m > [22m[2mSchemeList logic[2m > [22m[2mcollections()[2m > [22m[2mreturns all collections from the schema
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineSchemaFromModel.test.ts[2m > [22m[2mMachineDb constructed from getModel() output
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/schemeList.test.ts[2m > [22m[2mSchemeList logic[2m > [22m[2mgrouping by type[2m > [22m[2mgroups collections by isType/isGroup/standard
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/schemeList.test.ts[2m > [22m[2mSchemeList logic[2m > [22m[2mRBAC filtering[2m > [22m[2mcheckAccess returns boolean for collections
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/schemeList.test.ts[2m > [22m[2mSchemeList logic[2m > [22m[2msearch filtering[2m > [22m[2mfilters collections by query string
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/schemeList.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineSchemaFromModel.test.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineParserForge.test.ts [2m([22m[2m43 tests[22m[2m)[22m[32m 8[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineIdbUpgrade.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineIdbUpgrade.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineIdbUpgrade.test.ts[2m > [22m[2mS28-02: upgradeIdb()[2m > [22m[2mhandles fresh install without error
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/__tests__/machineIdbUpgrade.test.ts[2m > [22m[2mS28-03: upgradeIdb() public surface[2m > [22m[2mexposes upgradeIdb on the public API
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineIdbUpgrade.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/explorerSortGroup.test.ts [2m([22m[2m16 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/idae/meta/__tests__/MetaModelProvider.test.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 6[2mms[22m[39m
stderr | src/lib/data-ui/fragments/ContextMenu.svelte.test.ts > ContextMenu > should open when openContextMenu is called
Failed to load context menu content: [TypeError: Component is not a function]

 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/fragments/ContextMenuContent.svelte.test.ts [2m([22m[2m4 tests[22m[2m)[22m[33m 459[2mms[22m[39m
     [33m[2mÔ£ô[22m[39m should render menu items based on permissions [33m 311[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineSeed.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 6[2mms[22m[39m
stderr | src/lib/data-ui/fragments/ContextMenu.svelte.test.ts > ContextMenu > should close when closeContextMenu is called
Failed to load context menu content: [TypeError: Component is not a function]

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/componentRegistry.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/fieldBuilder.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/machine/ext/__tests__/hooks.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineValidationEdgeCases.test.ts [2m([22m[2m25 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/idae/capabilities/__tests__/Capabilities.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 7[2mms[22m[39m
stderr | src/lib/data-ui/fragments/ContextMenu.svelte.test.ts > ContextMenu > should close when clicking outside
Failed to load context menu content: [TypeError: Component is not a function]

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/frameIntegration.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineErrorPaths.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineSchemeDefaultSort.test.ts [2m([22m[2m18 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/linkParser.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineFieldDefaultValues.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/fieldBuilderImage.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 6[2mms[22m[39m
stderr | src/lib/data-ui/fragments/ContextMenu.svelte.test.ts > ContextMenu > should close when pressing Escape
Failed to load context menu content: [TypeError: Component is not a function]

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/urlParser.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/data-ui/utils/dataGroupFk.test.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/storage/demo/storage-demo.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/fragments/ContextMenu.svelte.test.ts [2m([22m[2m5 tests[22m[2m)[22m[33m 1185[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/idae/codefield/__tests__/CodeFieldConvention.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/dataListNavigate.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/frameUtils.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 3[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineLoadFrame.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineLoadFrame.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/machineLoadFrame.test.ts[2m > [22m[2mmachine.framer.loadFrame ÔÇö URL-driven[2m > [22m[2mpushes hash URL with /+zone/modulePath/collection
[22m[39m[FrameManager] navigate: explorer in zone "main" for vehicle:

[90mstdout[2m | src/lib/main/__tests__/machineLoadFrame.test.ts[2m > [22m[2mmachine.framer.loadFrame ÔÇö URL-driven[2m > [22m[2mincludes collectionId in URL
[22m[39m[FrameManager] navigate: explorer in zone "main" for vehicle:42

[90mstdout[2m | src/lib/main/__tests__/machineLoadFrame.test.ts[2m > [22m[2mmachine.framer.loadFrame ÔÇö URL-driven[2m > [22m[2mserializes vars as query string
[22m[39m[FrameManager] navigate: explorer in zone "main" for vehicle:42

[90mstdout[2m | src/lib/main/__tests__/machineLoadFrame.test.ts[2m > [22m[2mmachine.framer.loadFrame ÔÇö URL-driven[2m > [22m[2muses explicit zone when provided
[22m[39m[FrameManager] navigate: explorer in zone "main.modal" for vehicle:

[90mstdout[2m | src/lib/main/__tests__/machineLoadFrame.test.ts[2m > [22m[2mmachine.framer.loadFrame ÔÇö URL-driven[2m > [22m[2momits vars query when empty
[22m[39m[FrameManager] navigate: explorer in zone "main" for vehicle:42

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineLoadFrame.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 4[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineDb.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineDb.test.ts
[22m[39mIdaeUserScopePolicy initialized

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineScheme.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineDb.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 3[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineLoadIn.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineLoadIn.test.ts
[22m[39mIdaeUserScopePolicy initialized

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineLoadIn.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 3[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/machineBe.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/machineBe.test.ts
[22m[39mIdaeUserScopePolicy initialized

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/machineBe.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 2[2mms[22m[39m
[90mstdout[2m | src/lib/main/__tests__/explorerListPagination.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/explorerTableSort.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/__tests__/explorerListPagination.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/__tests__/explorerTableSort.test.ts
[22m[39mIdaeUserScopePolicy initialized

 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/explorerListPagination.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m server [49m[39m src/lib/main/__tests__/explorerTableSort.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 2[2mms[22m[39m
[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/main/machineStore.svelte.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/data-ui/utils/useViewFields.svelte.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/data-ui/data/DataRecord.core.svelte.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/data-ui/fragments/dialog/Dialog.svelte.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/data-ui/utils/useViewFields.core.svelte.test.ts
[22m[39mIdaeUserScopePolicy created, ready for initialization

[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/machineStore.svelte.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/data-ui/fragments/dialog/Dialog.svelte.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/data-ui/data/DataRecord.core.svelte.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/data-ui/utils/useViewFields.svelte.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/data-ui/utils/useViewFields.core.svelte.test.ts
[22m[39mIdaeUserScopePolicy initialized

[90mstdout[2m | src/lib/main/machineStore.svelte.test.ts[2m > [22m[2mmachine.store ÔÇö Option A (ResultSet + reactivity)[2m > [22m[2mexposes ResultSet methods on items
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/utils/useViewFields.svelte.test.ts[2m > [22m[2museViewFields ÔÇö fieldKinds projection[2m > [22m[2mtags scalar fields kind:scalar and fk fields kind:fk
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/utils/useViewFields.core.svelte.test.ts[2m > [22m[2museViewFields ÔÇö core collections via appscheme_view[2m > [22m[2mreturns FK fields for core collections with view="fk" from appscheme_view
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/main/machineStore.svelte.test.ts[2m > [22m[2mmachine.store ÔÇö Option A (ResultSet + reactivity)[2m > [22m[2mre-runs $derived when an item is created (reactive snapshot)
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/main/machineStore.svelte.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 130[2mms[22m[39m
[90mstdout[2m | src/lib/data-ui/utils/useViewFields.core.svelte.test.ts[2m > [22m[2museViewFields ÔÇö core collections via appscheme_view[2m > [22m[2mreturns empty array when no appscheme_view entries exist
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/utils/useViewFields.svelte.test.ts[2m > [22m[2museViewFields ÔÇö fieldKinds projection[2m > [22m[2mreturns an empty fieldKinds map when no collection is given
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/utils/useViewFields.svelte.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 135[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/utils/useViewFields.core.svelte.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 142[2mms[22m[39m
 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/fragments/dialog/Dialog.svelte.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 246[2mms[22m[39m
[90mstdout[2m | src/lib/data-ui/data/DataRecord.core.svelte.test.ts[2m > [22m[2mDataRecord ÔÇö core collections with view="fk"[2m > [22m[2mrenders FK fields for core collections with view="fk"
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts[2m > [22m[2mDataRecord data source contract[2m > [22m[2mreads the record reactively from machine.store via collectionId
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRecord.core.svelte.test.ts[2m > [22m[2mDataRecord ÔÇö core collections with view="fk"[2m > [22m[2mrenders FK fields for core collections with view="fk"
[22m[39m{ records: [] } [90mundefined[39m
{
  records: [
    {
      code: [32m'john'[39m,
      name: [32m'John Doe'[39m,
      appuser_role_code: [32m'admin'[39m,
      fks: [36m[Object][39m,
      id: [33m1[39m
    }
  ]
} [90mundefined[39m
stack trace
  
  
  Error: 
      at $effect (D:/development/idae/packages/qoolie/src/adapters/svelte/useQoolieCollection.svelte.ts:69:25)
      at mountModern (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/mount.js:34:10)
      at mount (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/mount.js:85:44)
      at Module.render (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/render.js:16:28)
      at render (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte@5.3_454b0f8a396466cb035db6786e485868/node_modules/[4m@testing-library/svelte[24m/src/pure.js:49:73)
      at D:/development/idae/packages/idae-machine/src/lib/data-ui/data/DataRecord.core.svelte.test.ts:112:25
  [90m    at runNextTicks (node:internal/process/task_queues:64:5)[39m
  [90m    at processImmediate (node:internal/timers:472:9)[39m
      at file:///D:/development/idae/node_modules/[4m.pnpm[24m/@vitest+runner@4.1.2/node_modules/[4m@vitest/runner[24m/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataList prefs gating[2m > [22m[2mignores persisted finder prefs when usePrefs is false
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/data/DataRecord.core.svelte.test.ts [2m([22m[2m1 test[22m[2m)[22m[33m 407[2mms[22m[39m
     [33m[2mÔ£ô[22m[39m renders FK fields for core collections with view="fk" [33m 398[2mms[22m[39m
[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts[2m > [22m[2mDataRecord data source contract[2m > [22m[2mreads the record reactively from machine.store via collectionId
[22m[39m{ records: [] } [90mundefined[39m
{
  records: [
    {
      license_plate: [32m'AA-111-BB'[39m,
      model: [32m'Clio'[39m,
      brand: [32m'Renault'[39m,
      year: [33m2018[39m,
      status: [32m'available'[39m,
      fks: {},
      id: [33m1[39m
    }
  ]
} [90mundefined[39m
stack trace
  
  
  Error: 
      at $effect (D:/development/idae/packages/qoolie/src/adapters/svelte/useQoolieCollection.svelte.ts:69:25)
      at mountModern (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/mount.js:34:10)
      at mount (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/mount.js:85:44)
      at Module.render (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/render.js:16:28)
      at render (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte@5.3_454b0f8a396466cb035db6786e485868/node_modules/[4m@testing-library/svelte[24m/src/pure.js:49:73)
      at D:/development/idae/packages/idae-machine/src/lib/data-ui/data/DataRecord.svelte.test.ts:101:3
  [90m    at runNextTicks (node:internal/process/task_queues:64:5)[39m
  [90m    at processImmediate (node:internal/timers:472:9)[39m
      at file:///D:/development/idae/node_modules/[4m.pnpm[24m/@vitest+runner@4.1.2/node_modules/[4m@vitest/runner[24m/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts[2m > [22m[2mDataRecord data source contract[2m > [22m[2mskips fields absent from a sparse record without throwing FIELD_NOT_FOUND
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataList prefs gating[2m > [22m[2muses a custom prefsScope instead of the default collection scope
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts[2m > [22m[2mDataRecord data source contract[2m > [22m[2mskips fields absent from a sparse record without throwing FIELD_NOT_FOUND
[22m[39m{ records: [] } [90mundefined[39m
{
  records: [
    {
      license_plate: [32m'CC-222-DD'[39m,
      model: [32m'Megane'[39m,
      status: [32m'available'[39m,
      fks: {},
      id: [33m1[39m
    }
  ]
} [90mundefined[39m
stack trace
  
  
  Error: 
      at $effect (D:/development/idae/packages/qoolie/src/adapters/svelte/useQoolieCollection.svelte.ts:69:25)
      at mountModern (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/mount.js:34:10)
      at mount (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/mount.js:85:44)
      at Module.render (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte-core@1.0.0_svelte@5.55.1/node_modules/[4m@testing-library/svelte-core[24m/src/render.js:16:28)
      at render (D:/development/idae/node_modules/[4m.pnpm[24m/@testing-library+svelte@5.3_454b0f8a396466cb035db6786e485868/node_modules/[4m@testing-library/svelte[24m/src/pure.js:49:73)
      at D:/development/idae/packages/idae-machine/src/lib/data-ui/data/DataRecord.svelte.test.ts:120:3
  [90m    at runNextTicks (node:internal/process/task_queues:64:5)[39m
  [90m    at processImmediate (node:internal/timers:472:9)[39m
      at file:///D:/development/idae/node_modules/[4m.pnpm[24m/@vitest+runner@4.1.2/node_modules/[4m@vitest/runner[24m/dist/chunk-artifact.js:1893:20

[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts[2m > [22m[2mDataRecord data source contract[2m > [22m[2muses the data prop as-is when provided (controlled, no fetch)
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataList prefs gating[2m > [22m[2mhydrates persisted finder prefs by default
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRecord.svelte.test.ts[2m > [22m[2mDataRecord data source contract[2m > [22m[2muses the data prop as-is when provided (controlled, no fetch)
[22m[39m[1mnull[22m [90mundefined[39m

 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/data/DataRecord.svelte.test.ts [2m([22m[2m3 tests[22m[2m)[22m[33m 679[2mms[22m[39m
     [33m[2mÔ£ô[22m[39m reads the record reactively from machine.store via collectionId [33m 506[2mms[22m[39m
[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataList prefs gating[2m > [22m[2mforces stack layout in list mode even when a grid listClass is provided
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataListFk[2m > [22m[2mrenders forward related collections for a source record
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataListFk[2m > [22m[2mfilters to a single FK relation
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataListFk[2m > [22m[2mdoes not inherit persisted target prefs by default
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataListRfk[2m > [22m[2mrenders reverse related collections for a source record
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataListRfk[2m > [22m[2mfilters to a single reverse relation
[22m[39mIdaeUserScopePolicy initialized with machine instance

[90mstdout[2m | src/lib/data-ui/data/DataRelations.svelte.test.ts[2m > [22m[2mDataList relation components[2m > [22m[2mDataListRfk[2m > [22m[2mdoes not inherit persisted reverse-target prefs by default
[22m[39mIdaeUserScopePolicy initialized with machine instance

 [32mÔ£ô[39m [30m[42m client [49m[39m src/lib/data-ui/data/DataRelations.svelte.test.ts [2m([22m[2m10 tests[22m[2m)[22m[33m 842[2mms[22m[39m
       [33m[2mÔ£ô[22m[39m ignores persisted finder prefs when usePrefs is false [33m 334[2mms[22m[39m

[2m Test Files [22m [1m[32m66 passed[39m[22m[90m (66)[39m
[2m      Tests [22m [1m[32m702 passed[39m[22m[90m (702)[39m
[2m   Start at [22m 22:26:49
[2m   Duration [22m 19.50s[2m (transform 147.93s, setup 69.88s, import 156.84s, tests 15.91s, environment 24.93s)[22m


