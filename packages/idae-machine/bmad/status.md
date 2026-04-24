# BMAD Status — idae-machine v2

**Project:** @medyll/idae-machine  
**Version:** 2.0.0 (Next Generation)  
**Phase:** Development  
**Progress:** 75%  
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
| idae-socket | 🟢 Integrated | Real-time WebSocket |

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

### Sprint 3: Real-Time ✅
**Goal:** Socket.IO, conflict resolution
**Status:** Completed

| Story | Status | Tests |
|-------|--------|-------|
| S3-01: Server broadcast on CRUD | ✅ Complete | ✅ Pass |
| S3-02: Client subscribe to rooms | ✅ Complete | ✅ Pass |
| S3-03: Conflict resolution strategies | ✅ Complete | ✅ Pass |

### Sprint 4: Router & Navigation ⏳
**Goal:** SPA routing, menu generation
**Status:** Upcoming

### Sprint 5: Polish ⏳
**Goal:** Field types, AppShell, advanced features

---

## Recent Commits

```
feat(S3-03): configure conflict resolution strategies
feat(S3-02): build permission middleware (requireDroit)
feat(S3-01): server broadcast on CRUD operations
```

---

## What Was Built (Sprint 3)

### Socket.IO Server (`server/src/socket/`)
- Real-time broadcast on all CRUD operations
- Events: `data:created`, `data:updated`, `data:deleted`
- Rooms per table: `room_{table}`
- Subscribe/unsubscribe handlers

### RealtimeClient (`src/lib/idae/api/RealtimeClient.ts`)
- WebSocket connection with auto-reconnection
- `subscribe(table)` / `unsubscribe(table)`
- Event handlers with cleanup functions
- Queue subscriptions when disconnected

### Conflict Resolution (`src/lib/idae/sync/ConflictResolver.ts`)
- 4 strategies: last-write-wins, server-wins, client-wins, manual
- Per-table configuration
- Automatic or manual resolution
- Conflict events broadcast to clients
- Audit trail with timestamps

---

## Next Action

Start Sprint 4: Router & Navigation

**Command:** `bmad-sprint 4`  
**Role:** scrum

---

## Documents

- **PRD:** `bmad/artifacts/docs/PRD.md`
- **Architecture:** `bmad/artifacts/docs/ARCHITECTURE.md`
- **Tech Spec (S1):** `bmad/artifacts/docs/TECH-SPEC-S1.md`
