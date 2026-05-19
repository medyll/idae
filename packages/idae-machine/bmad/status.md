# BMAD Status Report — idae-machine

**Last updated:** 2026-05-19  
**Phase:** development  
**Progress:** 100%

---

## Next Action

**Sprint 21 planned** — 4 stories ready, awaiting implementation. Start with S21-01 (entité core + registry).

---

## Sprint 21 — Image presets declarative system (planned)

Issu de l'intake `bmad/intake-sources/IMAGE-PRESETS-DESIGN.md` (audit 2026-05-19, post-S20-04).

Replace `VARIANTS` const TS hardcodée → entité système `appimage_preset` + auto-resolve `free-WxH`.

| Story | Title | Effort | Dep |
|-------|-------|--------|-----|
| S21-01 | `appimage_preset` core entity + seed + registry cache | M | — |
| S21-02 | URL resolver `/image/:preset` + free-notation + DOS bounds | M | S21-01 |
| S21-03 | Refactor `ImageService` — drop VARIANTS, use registry | S | S21-02 |
| S21-04 | `field('image')` extension + `FileMeta.image.focus` (UI-ready) | M | S21-01 |

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

---

## Sprint 20 Summary

**S20-01:** Created `HooksRegistry.ts` with `registerHook`/`dispatch`/`clearHooks`. Built-in hooks for audit, broadcast, domainActions. Refactored `data.ts` — zero direct calls to `logAudit`/`broadcastToTable`/`domainActions.*`. `HookContext` gained `details` field.

**S20-02:** Created `FileService.ts` + `routes/files.ts` + `middleware/upload.ts`. Multer for multipart uploads. Local disk storage at `data/files/{org}/{collection}/{recordId}/`. `appfile` MongoDB collection for metadata. Soft delete support.

**S20-03:** Created `MailService.ts` with nodemailer + marked. Markdown templates with YAML front-matter. Retry wrapper (3 attempts). Admin-only REST endpoints. `enabled=false` mode for dev.

**S20-04:** Created `ImageService.ts` with sharp. Probe metadata, 4 variants (thumb/small/medium/large), lazy caching. `FileService.uploadFile` enriches image metadata. `deleteFile(permanent)` invalidates variant cache. `/api/files/:fileId/image/:variant` endpoint.
