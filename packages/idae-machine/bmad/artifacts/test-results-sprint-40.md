# Sprint 40 — Test Results

> Date: 2026-05-28  
> Role: Tester  
> Scope: `DataList` prefs isolation + FK/RFK relation viewers

## Commands

```bash
pnpm run check
pnpm run test:unit -- --run src/lib/main/__tests__/machineRelationHelpers.test.ts src/lib/data-ui/data/DataRelations.svelte.test.ts
pnpm run test
```

## Results

- `pnpm run check` → **0 errors, 0 warnings**
- Targeted relation tests → **14/14 passed**
  - `machineRelationHelpers.test.ts` → 5/5
  - `DataRelations.svelte.test.ts` → 9/9
- Full unit suite → **555/555 passed**

## Notes

- `DataList` pref persistence now normalizes Svelte state/proxy values before writing to IndexedDB, removing the `DataCloneError` found during client tests.
- `pnpm run build` reaches the Vite/SvelteKit runtime build successfully, but `prepack/publint` still fail on **pre-existing package issues outside Sprint 40**:
  - `@medyll/css-base` uses a local `link:` dependency
  - `pkg.bin["add-skill"]` points to a missing `./dist/cli/add-skill.js`
