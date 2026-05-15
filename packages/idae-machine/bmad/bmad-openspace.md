# BMAD Open Space — idae-machine

Inter-role communication log.

---

## 2026-05-12 — Component hierarchy + schema migration

- UI restructured: `collection/`, `lists/`, `data/`, `forms/` → `explorer/`, `card/`, `field/`, `input/`
- Schema format: string rules deprecated → `field()` builder + `TplFieldRulesObject` in idae-idbql
- `FieldDisplay` now dispatches to type-specific Input atoms
- `dbSchema.ts` + `demoScheme.ts` migrated to `field()` format
- See `CLAUDE.md` for full current state

---

## 2026-04-24 — Reset to v2 planning (archived)

v1 → maintenance mode. v2 = full-stack with server, auth, sync.  
All sprints now completed. See `bmad/status.md`.
