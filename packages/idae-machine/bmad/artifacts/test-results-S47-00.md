# S47-00 — Test Results

`src/lib/shell/frame/index.ts` barrel refreshed (BL-04). Was stale —
only exported `Explorer`, pre-dating the explorer/+card/ reorg. Now exports
all current `shell/frame/*` components, matching the `ai/frame/index.ts`
pattern: `Explorer`, `ExplorerContent`, `Synthesis`, `RbacMatrix`, `Diagram`,
`Dashboard`, `Space`.

No consumers of this barrel found (`grep` for `shell/frame/index` and
`from '$lib/shell/frame'` — 0 matches); `src/lib/index.ts` exports each
component directly from its own path. Kept for consistency with
`ai/frame/index.ts`.

## svelte-check

`npx svelte-check`: COMPLETED 1313 FILES, 34 ERRORS, 0 WARNINGS, 1
FILES_WITH_PROBLEMS — unchanged (34 pre-existing errors in
`dist/main/machine.js`, build artifact). 0 new.

## Root package suite

`npx vitest run` (idae-machine): 52 files / 590 tests passed.

✅ All tests passed
