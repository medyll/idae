# Sprint 47 — Test Results

Backlog grooming sprint. 1 story: S47-00 (BL-04 — refresh
`shell/frame/index.ts` barrel).

## svelte-check

`npx svelte-check`: COMPLETED 1313 FILES, 34 ERRORS, 0 WARNINGS, 1
FILES_WITH_PROBLEMS — unchanged (pre-existing `dist/main/machine.js` build
artifact). 0 new.

## Root package suite

`npx vitest run` (idae-machine): 52 files / 590 tests passed.

## Story summary

| Story | Title | Result |
|-------|-------|--------|
| S47-00 | Refresh shell/frame/index.ts barrel | pass |

## Backlog notes

- BACK-06 marked obsolete (Synthesis.svelte supersedes the FullInfo.svelte
  stub).
- BL-05 marked blocked — needs an ADR (bmad-adr) before it can be
  sprint-planned.

✅ All tests passed — Sprint 47 complete.
