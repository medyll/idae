# Test Results — S49-02: Menu pref scopes — zone→pref module + defaults + dev show-all

**Story:** S49-02 (BL-12)
**Date:** 2026-06-23
**Command:** `pnpm test -- --project server menuPrefs.test.ts` then `pnpm run test`

## Summary

✅ All tests passed

## Results

```
✓ server src/lib/data-ui/utils/__tests__/menuPrefs.test.ts (15 tests) 6ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
```

Full suite after S49-02:

```
Test Files  67 passed (67)
     Tests  717 passed (717)
```

## Coverage

New module: `src/lib/data-ui/utils/menuPrefs.ts`

Tests cover:

- Zone → prefix mapping (`MENU_ZONES`)
- `menuPrefsScope(zone, collection)` resolution
- `menuPrefsPrefix(zone)` resolution
- Empty prefs → all collections visible (default policy)
- Dev mode bypasses explicit false prefs
- Explicit true pref → visible
- Explicit false pref → hidden
- Unset collection pref → visible (default)
- Non-boolean pref coercion
- `filterMenuCollections` with and without `permittedCollections`
- Per-zone independence (same collection, different zones)

## Implementation notes

- Centralizes `app_menu`, `app_menu_start`, `app_menu_create`, `app_panel` mapping.
- No scattered `'app_menu_' + table` literals — consumers use `menuPrefsScope()`.
- Defaults are never persisted; missing pref ≠ hidden.
- Dev bypass uses `import.meta.env.DEV`, with explicit test-environment detection so
  vitest defaults to non-dev mode (tests can opt in via `isDev`).
- Exported from `src/lib/index.ts` for public consumption.
