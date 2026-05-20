# BMAD Status Report — idae-machine

**Last updated:** 2026-05-20  
**Phase:** development  
**Progress:** 100%

---

## Next Action

**S23-02 complete** — Starting S23-03: Extract DataForm from CardForm

---

## Sprint 23 — Refactor structurel: data-ui + shell 🔄

| Story | Title | Status | Tests |
|-------|-------|--------|-------|
| S23-01 | Créer data-ui/ — déplacer field/, input/, fragments/ | ✅ Complete | 387/387 |
| S23-02 | Restaurer DataList dans data-ui/data/ | ✅ Complete | 12/12 + 399/399 |
| S23-03 | Extraire DataForm depuis CardForm | 🔄 In Progress | — |
| S23-03 | Extraire DataForm depuis CardForm | ⏳ Todo | — |
| S23-04 | Extraire DataFields, DataFk, DataRfk | ⏳ Todo | — |
| S23-05 | Créer SchemeList + SchemeItem | ⏳ Todo | — |
| S23-06 | Créer shell/ — déplacer explorer/, card/, layout/ | ⏳ Todo | — |
| S23-07 | Refactor ExplorerList → compose DataList | ⏳ Todo | — |
| S23-08 | Refactor ExplorerActions → compose DataList | ⏳ Todo | — |
| S23-09 | Refactor PaneLeft → compose SchemeList | ⏳ Todo | — |
| S23-10 | Refactor PaneRecents → compose DataList | ⏳ Todo | — |
| S23-11 | Remplacer hydrate() par machine.loadIn() | ⏳ Todo | — |
| S23-12 | Mettre à jour componentRegistry + aliases | ⏳ Todo | — |
| S23-13 | Mettre à jour index.ts exports + alias compat | ⏳ Todo | — |
| S23-14 | Tests + vérification finale | ⏳ Todo | — |

---

## Sprint 22 — Navigation Layer ✅

| Story | Title | Status | Tests |
|-------|-------|--------|-------|
| S22-01 | componentRegistry singleton async | ✅ Complete | 9/9 |
| S22-02 | machine.loadIn() + URL builder | ✅ Complete | 6/6 |
| S22-03 | URL parser multi-cibles (+targetId) | ✅ Complete | 8/8 |
| S22-04 | SchemaRouter refactor — bugs §6, mount actions | ✅ Complete | 8/8 |
| S22-05 | Layout outlets + data-target-zone | ✅ Complete | goto removed |
| S22-06 | PaneLeft + ExplorerList → machine.loadIn() | ✅ Complete | smoke |

**Final suite:** 376/387 (11 pre-existing failures)

---

## Sprint 21 — Image presets declarative system ✅

| Story | Title | Status | Tests |
|-------|-------|--------|-------|
| S21-01 | appimage_preset core entity + seed + registry cache | ✅ Complete | 9/9 |
| S21-02 | URL resolver /image/:preset + free-notation + DOS bounds | ✅ Complete | 13/13 |
| S21-03 | Refactor ImageService — drop VARIANTS, use registry | ✅ Complete | 13/13 |
| S21-04 | field('image') extension + FileMeta.image.focus | ✅ Complete | 8/8 |

**Final suite:** 356/356 (26 files)

---

## Sprint 20 — Hooks registry, file service, mail service, image service ✅

| Story | Title | Status | Tests |
|-------|-------|--------|-------|
| S20-01 | Global hooks registry — pre:*/post:* unified via HooksRegistry | ✅ Complete | 125/125 |
| S20-02 | File service — upload/download/delete with local disk storage | ✅ Complete | 134/134 |
| S20-03 | Mail service — SMTP + transactional templates | ✅ Complete | 141/141 |
| S20-04 | Image service — resize + thumbnails + metadata | ✅ Complete | 152/152 |

**Final suite:** 152/152 (16 files)

---

## Strategic Dimensions

**Marketing:**
- v2.0: Full-stack schema-driven framework with real-time sync
- Offline-first: Work without connection, sync when back online
- Enterprise-ready: RBAC permissions, audit trails, multi-tenant
- Zero-config CRUD: Automatic API + UI from schema definitions

**Product:**
- Unified data model: _views registry replaces fieldModel/miniModel/columnModel
- RBAC v2: Users, groups, roles, grants with temporal constraints
- Real-time sync: WebSocket/SSE with conflict resolution
- SPA routing: Schema-driven navigation with permission guards

**Far Vision:**
- Visual schema builder: Drag-and-drop entity designer
- Plugin marketplace: Custom field types and components
- AI-powered features: Smart defaults, auto-generated validations
- Multi-database federation: Query across PostgreSQL, MongoDB, IndexedDB
