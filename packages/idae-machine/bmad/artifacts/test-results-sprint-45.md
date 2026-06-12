# Sprint 45 — Test Results

AI schema reconciliation (prereq) + Phase 1b agentic extensions (CHAT.md §12-14).
All 6 stories complete (S45-00..05, S45-05 stretch attempted and completed).

## New server test files (21/21)

- `agentLoop.test.ts` — 6/6 (text-only, tool-call round, RBAC denial w/ tool_result, maxRounds cap, eligibility-empty-tools)
- `agentRouter.test.ts` — 10/10 (resolveAgentContext, buildTools, route 404/400/200, tool_result persistence)
- `anthropicProvider.test.ts` — 3/3 (text stream, tool_use extraction, wire-format payload)
- `mistralProvider.test.ts` — 3/3 (text stream, incremental tool_calls accumulation, OpenAI-compatible wire-format payload)
- `ollamaProvider.test.ts` — 3/3 (text stream, tool_calls extraction, /api/chat wire-format payload incl. object-form tool args)

## Full server suite

`pnpm vitest run` (server): 247/248 passed across 31 test files.

- 5 pre-existing failures: `data.test.ts`, `demo-roundtrip.test.ts`, `domainActions.test.ts`,
  `scheme.test.ts`, `fetchSchemaE2E.test.ts` — all `@medyll/idae-api/server` module
  resolution (unchanged baseline, not introduced by Sprint 45).
- 1 flaky: `image.test.ts > delete permanent removes image variants cache` — failed in
  full-suite batch run, passes 14/14 in isolation. Pre-existing flakiness (consistent with
  prior `imagePresetRegistry` flakiness noted in project memory), not caused by Sprint 45.

## typecheck (server)

`tsc -p tsconfig.typecheck.json`: 16 pre-existing errors, unchanged (AiRouter.ts/OllamaService.ts
`@medyll/idae-api/*` resolution + `siveScheme.ts` `BaseFieldDef.default` errors). 0 new errors.

## Root suite (carried from S45-04, unchanged by S45-05 — server-only story)

`pnpm run test`: 590/590. `pnpm run check`: 34 pre-existing dist-only errors, unchanged.
