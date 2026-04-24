# BMAD Status — idae-machine v2

**Project:** @medyll/idae-machine  
**Version:** 2.0.0 (Next Generation)  
**Phase:** Development  
**Progress:** 45%  
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
| idae-api | 🟢 Ready | Server structure created with schema endpoints |
| idae-router | 🔴 Blocking | SPA routing with permission guards |
| qoolie | 🔴 Blocking | Real-time sync and offline-first |
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

### Sprint 2: Data Layer 🔄
**Goal:** CRUD with permissions, qoolie integration
**Status:** In Progress

| Story | Status | Tests |
|-------|--------|-------|
| S2-01: Implement CRUD endpoints with pagination | ⏳ Pending | — |
| S2-02: Build permission middleware | ⏳ Pending | — |
| S2-03: Integrate qoolie for offline-first | ⏳ Pending | — |

### Sprint 3: Real-Time ⏳
**Goal:** Socket.IO, conflict resolution

### Sprint 4: Router & Navigation ⏳
**Goal:** SPA routing, menu generation

### Sprint 5: Polish ⏳
**Goal:** Field types, AppShell, advanced features

---

## Recent Commits

```
feat(S1-03): create MachineApi client class

- Add MachineApi client with configurable baseUrl, timeout, retries
- Implement fetchAllSchemes() and fetchScheme() methods
- Add health() check method
- Implement retry logic with exponential backoff
- Add in-memory caching with TTL
- Create comprehensive unit tests
- Export all types and errors

BMAD: Sprint 1 complete - all 3 stories implemented
```

---

## What Was Built (Sprint 1)

### Server (`server/`)
- Express + idae-api setup
- MongoDB connection handling
- Health endpoint: `GET /health`
- Schema endpoints: `GET /api/scheme`, `GET /api/scheme/:table`
- AppScheme Mongoose model with `_views` registry
- Error handling and graceful shutdown

### Client (`src/lib/idae/api/`)
- MachineApi client class
- Methods: `health()`, `fetchAllSchemes()`, `fetchScheme()`
- Retry logic with exponential backoff
- In-memory caching with TTL
- TypeScript types and error classes

---

## Next Action

Start Sprint 2: CRUD endpoints with permissions

**Command:** `bmad-sprint 2`  
**Role:** scrum

---

## Documents

- **PRD:** `bmad/artifacts/docs/PRD.md`
- **Architecture:** `bmad/artifacts/docs/ARCHITECTURE.md`
- **Tech Spec (S1):** `bmad/artifacts/docs/TECH-SPEC-S1.md`
- **Stories:** `bmad/artifacts/stories/S1-01.md`, `S1-02.md`, `S1-03.md`
