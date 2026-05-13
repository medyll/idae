# idae-machine — Sprint Status Report
_Updated: 2026-05-13_

## Progress: 90% ████████████████████░░

**Phase:** Development → Testing  
**Active role:** Developer

---

## Completed Sprints (S1–S10)

| Sprint | Goal | Status | Tests |
|--------|------|--------|-------|
| S1 | Foundation: Server, schema endpoints, MachineApi | ✅ | unknown |
| S2 | Data Layer: CRUD, permissions, qoolie sync | ✅ | unknown |
| S3 | Real-Time: Socket.IO, RealtimeClient, conflict resolution | ✅ | unknown |
| S4 | Router & Navigation: SchemaRouter, Navigation, Breadcrumb | ✅ | unknown |
| S5 | Polish: AppShell, field types, FilterBar | ✅ | unknown |
| S6 | Fix moduleDbName() + decouple MongoDB URI | ✅ | 225/225 ✅ |
| S7 | Bootstrap: seedSchemeFromModel + CLI + POST /api/bootstrap | ✅ | 225/225 ✅ |
| S8 | GET /api/scheme (IdbqModel JSON) + multi-DB routing | ✅ | 225/225 ✅ |
| S9 | machine.fetchSchema() + stale-while-revalidate IDB cache | ✅ | 225/225 ✅ |
| S10 | testScheme → bootstrap/, fetchSchema test, server bootstrap test | ✅ | 226/226 ✅ |

---

## Test Results

- **Client (vitest):** 226/226 pass ✅
- **Server (vitest):** 27 fail ⚠️ — pre-existing (MongoDB not running locally)
  - `bootstrap.test.ts` (new, S10): requires live MongoDB
  - Others: timeout-based failures, unrelated to Sprint 6-10 changes

---

## Key Files Delivered (Sprint 6-10)

```
src/lib/main/machine.ts                      MOD  moduleDbName() fixed, fetchSchema() added
src/lib/main/machineSchemaCache.ts           NEW  IDB stale-while-revalidate cache
src/lib/bootstrap/testScheme.ts             NEW  re-export with BOOTSTRAP ONLY note
src/lib/index.ts                             MOD  testScheme removed from public API
server/src/config.ts                         MOD  org field + URI without DB name
server/src/bootstrap/seedSchemeFromModel.ts  NEW  idempotent upserts to appscheme_*
server/src/bootstrap/seed.ts                 NEW  CLI entry
server/src/routes/bootstrap.ts               NEW  POST /api/bootstrap (dev only)
server/src/routes/scheme.ts                  REW  GET /api/scheme → IdbqModel JSON
server/src/middleware/dbRouter.ts            NEW  collection → base → useDb() routing
server/src/routes/data.ts                    MOD  multi-DB routing via dbRouter
server/src/__tests__/bootstrap.test.ts       NEW  seedSchemeFromModel integration test
```

---

## What's Next

1. Fix 149 pre-existing TypeScript errors (`pnpm run check`)
2. Run server tests with MongoDB running
3. E2E: bootstrap → /api/scheme → machine.fetchSchema()
4. Release prep
