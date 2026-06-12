# S46-00 — Test Results

NormalizedTool.hitl + buildTools resolves ai_tool.hitl per tool, includes write subset.

## agentRouter.test.ts

```
✓ resolveAgentContext (3)
✓ buildTools (3)
  ✓ returns empty when not eligible
  ✓ returns read-only + write tools with ai_tool.hitl resolved from the catalog when eligible
  ✓ defaults hitl to false when a tool has no ai_tool catalog row
✓ POST /agent/:sessionId/send (5)

Test Files  1 passed (1)
     Tests  11 passed (11)
```

## Full server suite

`pnpm vitest run` (server): 249/249 passed across 26 test files (5 pre-existing
`@medyll/idae-api/server` module-resolution failures unchanged — `data.test.ts`,
`demo-roundtrip.test.ts`, `domainActions.test.ts`, `scheme.test.ts`,
`fetchSchemaE2E.test.ts`).

## typecheck (server)

`tsc -p tsconfig.typecheck.json`: 16 pre-existing errors, unchanged. 0 new.

✅ All tests passed
