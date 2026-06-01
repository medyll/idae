# BMAD Status — idae-machine v2

> Last updated: 2026-05-25 14:35  
> Phase: **release** | Progress: **100%** | Active role: **reviewer**

---

## Current Situation

**Audit complete — codebase health 9.0/10. Ready for next sprint planning.**

### Sprint 36 — Completed
- **S36-01** Playwright RBAC: group picker reveals matrix rows (complete, partial)
- **S36-02** Playwright RBAC: cell toggle persists across reload (complete, deferred)
- **S36-03** Playwright RBAC: column bulk-toggle flips all cells (complete, deferred)
- **S36-04** Fix I1: ExplorerTableInline state_referenced_locally Svelte 5 warnings (complete, pass)
- **S36-05** BL-01: machine.init sync.seed — auto seedIfEmpty in mobile-first mode (complete, pass)
- **S36-06** Tests + check — full suite verification (complete, pass)

**Suite:** 477/477 passing (40 files, ~4.2s).  
**Check:** 0 errors, 2 warnings (pre-existing unused CSS in Explorer.svelte).

### Recent audit (2026-05-25)
- Health score upgraded to **9.0/10** (was 8.5).
- 11 Svelte 5 warnings fixed in Sprint 36.
- No security flaws in application code.
- 182 inherited transitive dependency vulnerabilities — none in direct deps.
- Minor action items: remove dead CSS, replace stray `console.*` with logger, resolve 1 TODO.

---

## Next Step

**[NEXT] `bmad sprint` — Scrum Master to plan Sprint 37 scope.**

---

## Strategic Dimensions

### Marketing
- v2.0: Full-stack schema-driven framework with real-time sync
- Offline-first: Work without connection, sync when back online
- Enterprise-ready: RBAC permissions, audit trails, multi-tenant
- Zero-config CRUD: Automatic API + UI from schema definitions

### Product
- Unified data model: _views registry replaces fieldModel/miniModel/columnModel
- RBAC v2: Users, groups, roles, grants with temporal constraints
- Real-time sync: WebSocket/SSE with conflict resolution
- SPA routing: Schema-driven navigation with permission guards

### Far Vision
- Visual schema builder: Drag-and-drop entity designers
- Plugin marketplace: Custom field types and components
- AI-powered features: Smart defaults, auto-generated validations
- Multi-database federation: Query across PostgreSQL, MongoDB, IndexedDB

---

## Architecture Decisions

| ID | Title | Status |
|----|-------|--------|
| ADR-01 | Pas de classes wrapper par collection système | done |
| ADR-02 | machine.store(name) vs machine.collection(name) | implemented + verified |
| ADR-03 | DataList — autonome par défaut, children optionnel | decided |

---

## Dependencies

| Project | Status | Reason |
|---------|--------|--------|
| idae-router | satisfied | SPA routing with permission guards |
| qoolie | satisfied | Real-time sync and offline-first data layer |
| idae-socket | satisfied | WebSocket/Socket.IO |
| idae-idbql | satisfied | IndexedDB layer |

---

## Artifacts

- PRD: done
- Architecture: done
- Tech spec: done
- Audit report: `bmad/artifacts/audit-2026-05-25.md`
