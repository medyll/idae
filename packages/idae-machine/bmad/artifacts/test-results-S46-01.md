# S46-01 — Test Results

AgentLoop suspends on HITL tool_calls: new `tool_pending` event, no `callTool`, loop ends.

## agentLoop.test.ts

```
✓ text-only turn: streams text then done, never calls callTool
✓ tool-call turn: executes via callTool then resolves on the next round
✓ RBAC denial surfaces as a tool result, loop does not crash
✓ caps rounds at maxRounds when the provider keeps requesting tools
✓ HITL tool: yields tool_pending and done, never calls callTool, loop ends
✓ eligibility from catalog: caller passes empty tools when ai_model.supports_tools is false

Test Files  1 passed (1)
     Tests  6 passed (6)
```

## Full server suite

`pnpm vitest run` (server): 250/250 passed across 26 test files (5 pre-existing
`@medyll/idae-api/server` module-resolution failures unchanged — `data.test.ts`,
`demo-roundtrip.test.ts`, `domainActions.test.ts`, `scheme.test.ts`,
`fetchSchemaE2E.test.ts`).

## typecheck (server)

`tsc -p tsconfig.typecheck.json`: 16 pre-existing errors, unchanged. 0 new.

✅ All tests passed
