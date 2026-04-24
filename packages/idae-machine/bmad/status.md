# BMAD Status — idae-machine v2

**Project:** @medyll/idae-machine  
**Version:** 2.0.0 (Next Generation)  
**Phase:** Planning  
**Progress:** 15%  
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
| Planning | 🔄 In Progress |
| Development | ⏳ Upcoming |
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
| idae-api | 🔴 Blocking | Server-side API and auth endpoints |
| idae-router | 🔴 Blocking | SPA routing with permission guards |
| qoolie | 🔴 Blocking | Real-time sync and offline-first |
| idae-db | 🟡 Optional | MongoDB integration |

---

## Sprints

### Sprint 1: Foundation 🔄
**Goal:** Server API, auth, schema endpoints
**Status:** Ready for Development

| Story | Status | Tests |
|-------|--------|-------|
| S1-01: Set up idae-api server with MongoDB | ⏳ Ready | — |
| S1-02: Build schema endpoints | ⏳ Pending | — |
| S1-03: Create MachineApi client class | ⏳ Pending | — |

### Sprint 2: Data Layer ⏳
**Goal:** CRUD with permissions, qoolie integration

### Sprint 3: Real-Time ⏳
**Goal:** Socket.IO, conflict resolution

### Sprint 4: Router & Navigation ⏳
**Goal:** SPA routing, menu generation

### Sprint 5: Polish ⏳
**Goal:** Field types, AppShell, advanced features

---

## Next Action

Start Sprint 1 development: S1-01 Set up idae-api server

**Command:** `bmad-dev-story S1-01`  
**Role:** dev

---

## Documents

- **PRD:** `bmad/artifacts/docs/PRD.md`
- **Architecture:** `bmad/artifacts/docs/ARCHITECTURE.md`
- **Tech Spec (S1):** `bmad/artifacts/docs/TECH-SPEC-S1.md`
- **Story S1-01:** `bmad/artifacts/stories/S1-01.md`
