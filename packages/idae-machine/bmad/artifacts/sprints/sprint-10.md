# Sprint 10 — Tests + Cleanup
**Goal:** All tests green, demoScheme relocated, no prod imports of demoScheme
**Stories:** S10-01
**Effort:** M
**Depends on:** S9-01

| Story | Title | Effort | Status |
|-------|-------|--------|--------|
| S10-01 | Tests adaptation + demoScheme → bootstrap/ | M | todo |

## Moves
- `src/lib/demo/demoScheme.ts` → `src/lib/bootstrap/demoScheme.ts`
- `src/lib/demo/demoInit.ts`   → `src/lib/bootstrap/demoInit.ts`
- `src/lib/demo/seedData.ts`   → `src/lib/bootstrap/seedData.ts`

## New files
- `src/lib/main/__tests__/helpers/mockSchemaFetch.ts`
- `src/lib/main/__tests__/machineFetchSchema.test.ts`
- `server/src/__tests__/bootstrap.test.ts`

## Definition of done for full epic
- [ ] `pnpm vitest run` → all pass
- [ ] `pnpm run check` → 0 new errors
- [ ] `+page.svelte` has no demoScheme import
- [ ] Server routes to correct MongoDB DB per collection
- [ ] Offline boot uses cached schema (no network)
