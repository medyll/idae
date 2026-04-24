# BMAD Status — idae-machine v2

**Project:** @medyll/idae-machine  
**Version:** 2.0.0 (Next Generation)  
**Phase:** Development  
**Progress:** 60%  
**Last Updated:** 2026-04-24

---

## Vision

Full-stack schema-driven application framework with offline-first sync, enterprise RBAC, and real-time collaboration.

---

## Strategic Dimensions

### Marketing
- v2.0: Full-stack schema-driven framework with real-time sync
- Offline-first: Work without connection, sync when back online
- Enterprise-ready: RBAC permissions, audit trails, multi-tenant
- Zero-config CRUD: Automatic API + UI from schema definitions

### Product
- Unified data model: `_views` registry replaces fieldModel/miniModel/columnModel
- RBAC v2: Users, groups, roles, grants with temporal constraints
- Real-time sync: WebSocket/SSE with conflict resolution
- SPA routing: Schema-driven navigation with permission guards

### Far Vision
- Visual schema builder: Drag-and-drop entity designer
- Plugin marketplace: Custom field types and components
- AI-powered features: Smart defaults, auto-generated validations
- Multi-database federation: Query across PostgreSQL, MongoDB, IndexedDB

---

## Phase Status

| Phase | Status |
|-------|--------|
| Planning | ✅ Done |
| Development | 🔄 In Progress |
| Testing | ⏳ Upcoming |
| Release | ⏳ Upcoming |

---

## Artifacts

| Artifact | Status |
|----------|--------|
| PRD | ✅ Done |
| Architecture | ✅ Done |
| Tech Spec (S1) | ✅ Done |

---

## Dependencies

| Project | Status | Reason |
|---------|--------|--------|
| idae-api | 🟢 Ready | Server with CRUD + permissions |
| idae-router | 🔴 Blocking | SPA routing with permission guards |
| qoolie | 🟢 Integrated | Offline-first sync layer |
| idae-db | 🟡 Optional | MongoDB integration |

---

## Sprints

### Sprint 1: Foundation ✅
**Goal:** Server API, auth, schema endpoints
**Status:** Completed

| Story | Status | Tests |
|-------|--------|-------|
| S1-01: Set up idae-api server with MongoDB | ✅ Complete | ✅ Pass |
| S1-02: Build schema endpoints | ✅ Complete | ✅ Pass |
| S1-03: Create MachineApi client class | ✅ Complete | ✅ Pass |

### Sprint 2: Data Layer ✅
**Goal:** CRUD with permissions, qoolie integration
**Status:** Completed

| Story | Status | Tests |
|-------|--------|-------|
| S2-01: CRUD endpoints with pagination | ✅ Complete | ✅ Pass |
| S2-02: Permission middleware | ✅ Complete | ✅ Pass |
| S2-03: Qoolie offline-first sync | ✅ Complete | ✅ Pass |

### Sprint 3: Real-Time ⏳
**Goal:** Socket.IO, conflict resolution
**Status:** Upcoming

### Sprint 4: Router & Navigation ⏳
**Goal:** SPA routing, menu generation

### Sprint 5: Polish ⏳
**Goal:** Field types, AppShell, advanced features

---

## Recent Commits

```
feat(S2-03): integrate qoolie for offline-first sync
feat(S2-02): build permission middleware (requireDroit)
feat(S2-01): implement CRUD endpoints with pagination
```

---

## What Was Built (Sprint 2)

### CRUD Endpoints (`server/src/routes/data.ts`)
- `GET /api/data/:table` — List with pagination, sorting, filtering
- `GET /api/data/:table/:id` — Single record
- `POST /api/data/:table` — Create
- `PUT /api/data/:table/:id` — Update
- `DELETE /api/data/:table/:id` — Delete
- Response metadata: total, page, limit, pages

### Permission Middleware (`server/src/middleware/permission.ts`)
- `requireDroit(permission)` factory
- Support: C, R, U, D, L, X, A
- JWT token extraction
- Role-based permission checks
- 401/403 error responses
- `GET /api/permissions/check` endpoint

### Qoolie Integration
- @medyll/qoolie package integrated
- SyncController for bidirectional sync
- Outbox pattern for offline operations
- Conflict resolution (last-write-wins)
- Auto-detect server URL

---

## Next Action

Start Sprint 3: Real-Time with Socket.IO

**Command:** `bmad-sprint 3`  
**Role:** scrum

---

## Documents

- **PRD:** `bmad/artifacts/docs/PRD.md`
- **Architecture:** `bmad/artifacts/docs/ARCHITECTURE.md`
- **Tech Spec (S1):** `bmad/artifacts/docs/TECH-SPEC-S1.md`
- **Stories:** `bmad/artifacts/stories/S2-01.md`, `S2-02.md`
