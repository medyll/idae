# BMAD Open Space — idae-machine v2

Inter-role communication log.

---

## 2026-04-24 — Reset to v2 Planning

**[Scrum]** Project reset to planning phase for v2.0 development.

**Source:** `IDAE-MACHINE-NEXT.md` — comprehensive roadmap with 5 implementation phases.

**Key Decisions:**
- v1 (current): Client-side IndexedDB library — **MAINTENANCE MODE**
- v2 (target): Full-stack framework with server, auth, sync — **ACTIVE DEVELOPMENT**

**Critical Path:**
1. idae-api integration (blocking)
2. idae-router integration (blocking)
3. qoolie integration (blocking)

**Architecture Shift:**
```
v1: MachineDb → IDBQL → IndexedDB (client-only)
v2: MachineApi → idae-api → MongoDB + Qoolie → IndexedDB (sync)
```

---

## Open Threads

### Thread: Permission Model
**Status:** Design complete in IDAE-MACHINE-NEXT.md Section 3.2
**Next:** Architect to review RBAC v2 model

### Thread: _views Registry
**Status:** Spec defined, needs implementation
**Next:** Developer to add to MachineScheme

### Thread: External Dependencies
**Status:** All 3 critical deps unverified
**Next:** Check idae-api, idae-router, qoolie availability in monorepo

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-24 | Reset to v2 planning | IDAE-MACHINE-NEXT.md provides clear roadmap |
| 2026-04-24 | Use Qoolie over direct IDBQL | Offline-first requirement |
| 2026-04-24 | RBAC v2 over simple roles | Enterprise requirements from legacy |

---

## Breaking Changes (Expected in v2)

| Change | Migration |
|--------|-----------|
| `fieldModel/miniModel/columnModel` → `_views` | Auto-migration on load |
| Direct IDBQL → Qoolie | Wrapper maintains compatibility |
| No auth → Auth required | Optional auth mode for simple apps |
