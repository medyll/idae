# BMAD Status — idae-machine v2

**Project:** @medyll/idae-machine  
**Version:** 2.0.0  
**Phase:** Pre-Release  
**Progress:** 85%  
**Last Updated:** 2026-05-12 (rebuilt from actual code + git state)

---

## State: Code Complete — Tests Pending

All 5 sprints committed. Server implemented. Dependencies satisfied.  
**Blocker before release:** tests not run, build not verified, AppShell.svelte has uncommitted changes.

---

## Dependencies

| Package | Status |
|---------|--------|
| `@medyll/qoolie` | ✅ Satisfied (dependencies) |
| `@medyll/idae-router` | ✅ Satisfied (devDependencies) |
| `@medyll/idae-socket` | ✅ Satisfied (devDependencies) |
| `@medyll/idae-idbql` | ✅ Satisfied (dependencies) |

---

## Phase Status

| Phase | Status |
|-------|--------|
| Planning | ✅ Done |
| Development | ✅ Done |
| Testing | 🔄 In Progress |
| Release | ⏳ Upcoming |

---

## Sprints

### Sprint 1: Foundation ✅
- S1-01: Server with MongoDB ✅ (tested)
- S1-02: Schema endpoints ✅ (⚠ not tested)
- S1-03: MachineApi client ✅ (⚠ not tested)

### Sprint 2: Data Layer ✅
- S2-01: CRUD endpoints with pagination ✅ (⚠ not tested)
- S2-02: Permission middleware (requireDroit) ✅ (⚠ not tested)
- S2-03: Qoolie offline-first sync ✅ (⚠ not tested)

### Sprint 3: Real-Time ✅
- S3-01: Socket.IO server broadcast ✅ (⚠ not tested)
- S3-02: RealtimeClient WebSocket ✅ (⚠ not tested)
- S3-03: Conflict resolution strategies ✅ (⚠ not tested)

### Sprint 4: Router & Navigation ✅
- S4-01: SchemaRouter + idae-router ✅ (⚠ not tested)
- S4-02: Navigation component ✅ (⚠ not tested)
- S4-03: Breadcrumb dynamic path ✅ (⚠ not tested)

### Sprint 5: Polish ✅
- S5-01: AppShell layout ✅ (⚠ not tested, has uncommitted changes)
- S5-02: Field types (currency, email) ✅ (⚠ not tested)
- S5-03: FilterBar advanced filtering ✅ (⚠ not tested)

---

## What Was Built

### Server (`server/`)
- Express + idae-api, MongoDB/Mongoose
- CRUD endpoints with pagination
- Permission middleware (requireDroit)
- Socket.IO broadcast + conflict handler
- Health & schema endpoints
- Test suite: `server/src/__tests__/`

### Client (`src/lib/`)
- **MachineApi** — HTTP client with caching
- **RealtimeClient** — WebSocket subscriptions
- **SchemaRouter** — Route generation from schemas
- **ConflictResolver** — 4 strategies
- **Navigation** — Schema-driven menu
- **Breadcrumb** — Dynamic path
- **AppShell** — Responsive layout (modified, uncommitted)
- **FieldCurrency / FieldEmail** — Typed inputs
- **FilterBar** — Advanced filtering

---

## Pending Before Release

1. ⚠ Fix/commit `AppShell.svelte` changes
2. `pnpm run test` — server + client tests
3. `pnpm run check` — TypeScript validation
4. `pnpm run build` — build verification
5. Integration testing
6. Version bump → publish npm

---

## Next Action

**`bmad-test`** — Run full test suite and report results.

---

## Strategic Dimensions

### Marketing
- v2.0: Full-stack schema-driven framework with real-time sync
- Offline-first: Work without connection, sync when back online
- Enterprise-ready: RBAC permissions, audit trails, multi-tenant
- Zero-config CRUD: Automatic API + UI from schema definitions

### Product
- Unified data model: `_views` registry
- RBAC v2: Users, groups, roles, grants
- Real-time sync: WebSocket with conflict resolution
- SPA routing: Schema-driven navigation

### Far Vision
- Visual schema builder (future)
- Plugin marketplace (future)
- AI-powered features (future)
- Multi-database federation (future)

---

## Documents

- **PRD:** `bmad/artifacts/docs/PRD.md`
- **Architecture:** `bmad/artifacts/docs/ARCHITECTURE.md`
- **Tech Specs:** `bmad/artifacts/docs/TECH-SPEC-S1.md`
- **Sprints:** `bmad/artifacts/sprints/`
- **Stories:** `bmad/artifacts/stories/`

---

**Status:** 🔄 Pre-Release — Tests Required
