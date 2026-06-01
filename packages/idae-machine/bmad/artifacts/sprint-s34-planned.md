# Sprint 34 — SCHEMA-FROM-SERVER + Client Store Hydration

**Goal:** Eliminate manual `business: demoScheme` declaration — `machine.start()` auto-fetches schema from server when `sync.databaseHost` is set, and client store hydrates correctly from server data.

**Date:** 2026-05-23
**Depends on:** Sprint 33 (CORS fix, route ordering, dbName propagation — all complete)

---

## Stories

### S34-01: start() auto-fetchSchema when databaseHost is set
**Effort:** M
**Description:** When `sync.databaseHost` is configured in `init()`, `start()` should automatically trigger `fetchSchema()` in the background. Local model (if provided) serves as initial fallback; server schema replaces it when fetched.

**Acceptance criteria:**
- `start()` detects `sync.databaseHost` → calls `fetchSchema(databaseHost + '/api/scheme')` asynchronously
- If local `_business` model exists → machine starts immediately with it, server schema replaces on fetch
- If no local model → machine waits for fetchSchema to complete before starting
- `fetchSchema()` reuses existing `loadSchema()` SWR logic (cache → start immediately, bg refresh)
- No breaking changes to existing `fetchSchema(url)` public API
- `_scheduleDrift()` still runs after schema is set

**Files:** `src/lib/main/machine.ts`

---

### S34-02: +layout.svelte drops demoScheme import
**Effort:** S
**Description:** Clean up `+layout.svelte` to rely on auto-fetchSchema. Remove `import { demoScheme }` and `business: demoScheme` from `machine.init()`.

**Acceptance criteria:**
- `+layout.svelte` has zero references to `demoScheme` or `$lib/demo/`
- `machine.init()` called with only `{ org, domain, version, sync: { mode: 'server-first', databaseHost: apiUrl, ... } }`
- App still boots correctly — schema fetched from server automatically
- Dev auto-login logic unchanged

**Files:** `src/routes/+layout.svelte`

---

### S34-03: Client store hydration — ensure data pulls from server
**Effort:** M
**Description:** Fix BACK-03 — after CORS fix, client store is empty. Ensure qoolie sync in `server-first` mode correctly pulls data from server into IndexedDB and reactive store.

**Acceptance criteria:**
- After `machine.start()` + schema fetch, `machine.store[vehicle]` (or any business collection) contains server data
- `server-first` sync mode: qoolie fetches from server → populates IDB → reactive store updates
- Verify via browser console: `machine.store.vehicle.getAll()` returns records
- No regression in `offline-first` or `local-only` sync modes

**Files:** `src/lib/main/machine.ts`, qoolie sync layer (verify, not modify)

---

### S34-04: Tests — auto-fetchSchema, layout cleanup, store hydration
**Effort:** M
**Description:** Update existing tests and add new ones for the auto-fetchSchema flow.

**Acceptance criteria:**
- `machine.test.ts`: new test — `start()` with `databaseHost` triggers fetchSchema
- `machine.test.ts`: new test — `start()` with `databaseHost` + local model starts immediately, updates on fetch
- `machineClient.test.ts`: verify fetchSchema flow still works (no regression)
- `machineCRUD.test.ts`: no regression — demoScheme tests still pass
- Full suite: all green (464+ tests)
- `pnpm run check`: 0 errors

**Files:** `src/lib/main/__tests__/machine.test.ts`, `src/lib/main/__tests__/machineClient.test.ts`

---

## Capacity

| Story | Effort | Total |
|-------|--------|-------|
| S34-01 | M | M |
| S34-02 | S | |
| S34-03 | M | |
| S34-04 | M | |

**Total:** ~3M — achievable in one session

## Dependencies

- S34-02 depends on S34-01 (can't drop demoScheme until auto-fetch works)
- S34-03 depends on S34-01 (store hydration requires schema from server)
- S34-04 depends on all above

## Risks

- **qoolie server-first sync**: If the issue is in qoolie itself (not idae-machine), S34-03 may require changes in the qoolie package. Scope: diagnose first, fix in idae-machine if possible, file qoolie issue if not.
- **Test mocking**: `fetchSchema` tests need mocked HTTP responses. Existing `machineClient.test.ts` already has mocked fetch patterns — reuse those.
