
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


 RUN  v4.1.2 D:/development/idae/packages/idae-machine

19:56:33 [vite-plugin-svelte] src/lib/shell/explorer/Explorer.svelte:82:5 Non-interactive element `<li>` cannot have interactive role 'button'
https://svelte.dev/e/a11y_no_noninteractive_element_to_interactive_role
19:56:33 [vite-plugin-svelte] src/lib/shell/explorer/Explorer.svelte:109:8 Non-interactive element `<li>` cannot have interactive role 'button'
https://svelte.dev/e/a11y_no_noninteractive_element_to_interactive_role
19:56:33 [vite-plugin-svelte] src/lib/shell/explorer/Explorer.svelte:136:6 Non-interactive element `<li>` cannot have interactive role 'button'
https://svelte.dev/e/a11y_no_noninteractive_element_to_interactive_role
19:56:35 [vite-plugin-svelte] src/lib/data-ui/input/InputEmail.svelte:31:20 This reference only captures the initial value of `value`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally
19:56:35 [vite-plugin-svelte] src/lib/data-ui/input/InputCurrency.svelte:26:32 This reference only captures the initial value of `value`. Did you mean to reference it inside a derived instead?
https://svelte.dev/e/state_referenced_locally

 Test Files  38 passed (38)
      Tests  454 passed (454)
   Duration  3.55s

## Sprint 28 Test Results

**S28-01 to S28-05: IDB Schema Drift Detection**

✅ All 454 tests passed (38 files)
✅ 9 new tests added for drift detection edge cases
✅ 0 new type errors (check: 0 errors, 9 pre-existing warnings)

### Test Coverage
- `computeSchemaHash` — order-independent hashing
- `getCurrentIdbStores` — excludes internal stores
- `getStoredSchemaHash` / `storeSchemaHash` — persistence
- `upgradeIdb()` — fresh install handling
- `adaptIdbToSchema()` — public API
- `fetchSchema()` — drift integration point
- `_isProtectedStore` — __outbox__, __schema_meta__, __migrations__ protection

✅ All tests passed — Sprint 28 verified.

