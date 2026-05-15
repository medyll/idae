# Sprint 9 — Client Async Init (fetchSchema)
**Goal:** machine.fetchSchema() replaces machine.init({ model: hardcoded })
**Stories:** S9-01
**Effort:** L
**Depends on:** S8-01

| Story | Title | Effort | Status |
|-------|-------|--------|--------|
| S9-01 | machine.fetchSchema() + IDB schema cache | L | todo |

## New files
- `src/lib/main/machineSchemaCache.ts`

## Modified files
- `src/lib/main/machine.ts`
- `src/routes/+page.svelte`

## Critical
After this sprint, `demoScheme` is NOT imported anywhere in the production client.
+page.svelte only calls `machine.fetchSchema('http://localhost:3000/api/scheme')`.
