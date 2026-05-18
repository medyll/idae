# BMAD Status Report — idae-machine v2

**Last Updated:** 2026-05-18  
**Phase:** Development  
**Progress:** 100%

---

## Current Status

**Active Sprint:** 16 — Actions Layer: soft delete, audit CRUD, domain actions pattern, validation serveur  
**Next Action:** Sprint 16 complete — evaluate next sprint or release  
**Active Role:** Developer

---

## Sprint 16 Progress

| Story | Title | Status | Tests |
|-------|-------|--------|-------|
| S16-01 | Soft delete — deletedAt + filter | ✅ Complete | ✅ 14/14 passed |
| S16-02 | CRUD audit trail via AuditService | ✅ Complete | ✅ 18/18 passed |
| S16-03 | Domain actions pattern | ✅ Complete | ✅ 10/10 passed |
| S16-04 | MachineSchemeValidate server-side | ✅ Complete | ✅ 33/33 passed |

**Sprint 16: ALL STORIES COMPLETE**

---

## Strategic Dimensions

### Marketing
- v2.0: Full-stack schema-driven framework with real-time sync
- Offline-first: Work without connection, sync when back online
- Enterprise-ready: RBAC permissions, audit trails, multi-tenant
- Zero-config CRUD: automatic API + UI from schema definitions

### Product
- Unified data model: _views registry replaces fieldModel/miniModel/columnModel
- RBAC v2: Users, groups, roles, grants with temporal constraints
- Real-time sync: WebSocket/SSE with conflict resolution
- SPA routing: Schema-driven navigation with permission guards

### Far Vision
- Visual schema builder: Drag-and-drop entity designer
- Plugin marketplace: Custom field types and components
- AI-powered features: Smart defaults, auto-generated validations
- Multi-database federation: Query across PostgreSQL, MongoDB, IndexedDB

---

## Recent Wins

**S16-04 Complete:** Shared validation module implemented:
- `src/lib/main/machine/validateRules.ts` — pure validation module with 7 legacy types ported from InputValidator.php
- Types: email, url, date, number, integer, cp (code postal FR), alpha, alphanum
- Also supports min/max, minLength/maxLength, pattern, custom type validators
- `MachineSchemeValidate` updated to use `validateFieldPure` for standard types
- Server domain actions now use `validateRecord` from shared module
- Same validation rules used client-side and server-side — no duplication
- Full test coverage: 33/33 unit tests, 364/364 client tests, 102/102 server tests

**S16-03 Complete:** Domain actions pattern implemented:
- `server/src/models/domainActions.ts` — interface + registry + registerDomainActions()
- `server/src/models/demo/actions.ts` — vehicule + reservation hooks registered
- Validation vehicule (kilométrage négatif → erreur, prix=0 → erreur) tested
- `afterCreate`/`beforeDelete` called from data.ts handlers
- Hook failure doesn't block response (fire-and-forget for afterCreate, throw for beforeDelete)
- Convention documented in `bmad/conventions.md`

**S16-02 Complete:** CRUD audit trail implemented:
- `createRecord`, `updateRecord`, `deleteRecord`, `restoreRecord` all log to `appuser_audit`
- Fire-and-forget pattern — audit failures never block responses
- userId, login, IP address, user agent captured from request context

**S16-01 Complete:** Soft delete implemented with:
- `deleteRecord` sets `deletedAt` timestamp by default
- `?permanent=true` flag for hard delete
- `listRecords` and `getRecord` filter out soft-deleted records
- `PATCH /api/data/:table/:id/restore` endpoint for recovery

---

## Dependencies

| Project | Status | Reason |
|---------|--------|--------|
| idae-router | ✅ Satisfied | SPA routing with permission guards |
| qoolie | ✅ Satisfied | Real-time sync and offline-first data layer |
| idae-socket | ✅ Satisfied | WebSocket/Socket.IO |
| idae-idbql | ✅ Satisfied | IndexedDB layer |

---

## Architecture Decisions

**ADR-01:** Pas de classes wrapper par collection système (pending refactor after Sprint 15 release)

---

*Generated automatically from status.yaml*
