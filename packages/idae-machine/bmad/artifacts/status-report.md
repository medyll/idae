# idae-machine — Status Report

> v2.0: A full-stack, schema-driven application framework with real-time sync, offline-first data, and enterprise RBAC — delivering zero-config CRUD, visual navigation, and multi-tenant support for developers building data-intensive apps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Product Overview

  Progress   [██████████] 100%   Phase: release

### Features & Capabilities

  | Feature | Status | What it means for users |
  |---------|--------|------------------------|
  | Schema-driven CRUD | ✅ Shipped | Define data models once — get API, UI, and validation automatically |
  | Offline-first sync | ✅ Shipped | Work without internet, data syncs when connection returns |
  | RBAC permissions | ✅ Shipped | Fine-grained access control with users, groups, roles, and grants |
  | Real-time WebSocket | ✅ Shipped | Live data updates across all connected clients |
  | Frame-based navigation | ✅ Shipped | Multi-window, tab-like UI with URL-driven state |
  | Unified Explorer | ✅ Shipped | Single component for list, table, card, and action views |
  | Image presets | ✅ Shipped | Dynamic image sizing and optimization from schema definitions |
  | File & mail services | ✅ Shipped | Upload/download files and send templated emails out of the box |
  | Schema validation | ✅ Shipped | Server-side data validation from schema rules, shared client/server |
  | IDB drift detection | ✅ Shipped | IndexedDB auto-adapts to server schema changes — no manual migrations |
  | DataList snippet API | ✅ Shipped | Composable list rendering with custom item, group, empty, and footer slots |
  | RBAC Matrix UI | ✅ Shipped | Visual grant editor — assign CRUDL permissions by group and collection |
  | Multi-database routing | ✅ Shipped | Data routed to correct MongoDB database per organization |
  | Server seed pipeline | ✅ Shipped | Bootstrap demo data and business entities on first run |
  | CORS & route ordering | ✅ Shipped | Express middleware correctly ordered before route handlers |
  | SCHEMA-FROM-SERVER | ✅ Shipped | Auto-fetch schema on start — eliminates manual schema declarations |
  | Client store hydration | ✅ Shipped | QOOLIE-SWR implemented in qoolie — transparent lazy SWR on cold IDB reads |

### What's Ready Now

- Zero-config CRUD from schema definitions with server-side validation
- Offline-first IndexedDB with automatic schema drift detection and upgrade
- RBAC system with users, groups, roles, grants, and visual matrix editor
- Real-time sync via WebSocket with conflict resolution
- Frame-based multi-window navigation with URL state and task bar
- Unified Explorer with list, table, card, and action modes
- File upload/download with image presets and optimization
- Email service with Markdown templates
- Multi-tenant data routing (org-scoped MongoDB databases)
- Bootstrap CLI and HTTP endpoints for demo data seeding
- DataList composable API with snippet-based customization
- Auto-fetch schema from server on `machine.start()` when `databaseHost` is set
- ADR-02 — `machine.store(name)` wraps `useQoolieCollection`; `reactiveStore.svelte.ts` deleted
- QOOLIE-SWR shipped — HydrationController, bulkUpsertSilent, revalidate, autoHydrate opt-out, lifecycle hooks
- BACK-03 closed — cold IDB hydrates transparently from server on first read; machine.ts has zero pull logic

### What's Coming Next

- **Sprint 36:** Playwright RBAC suite (3 remaining tests), Svelte 5 warning fixes, mobile-first auto-seed
- **Visual schema builder:** Drag-and-drop entity designers (far vision)
- **Plugin marketplace:** Custom field types and components (far vision)

### Risks & Blockers

- None identified for current development

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Development Details

  Sprint     S36 planned
  Role       scrum → next: developer
  Next cmd   `bmad-dev-story` (S36-01)
  Last update 2026-05-25 00:00

### Current Sprint

  ✅ Done     Sprint 35: QOOLIE-SWR — HydrationController, bulkUpsertSilent, revalidate, autoHydrate. qoolie 206/206, idae-machine 472/472. BACK-03 closed.
  🔨 Planned  Sprint 36: Playwright RBAC (3 tests), I1 Svelte 5 warnings, BL-01 mobile-first auto-seed
  💡 Next     S36-01 — Playwright RBAC: group picker reveals matrix rows
  ⚠️ Blockers None

### Stories (Sprint 36 — Planned)

  | ID | Title | Status | Effort |
  |----|-------|--------|--------|
  | S36-01 | Playwright RBAC: group picker reveals matrix rows | ⬚ planned | M |
  | S36-02 | Playwright RBAC: cell toggle persists across reload | ⬚ planned | M |
  | S36-03 | Playwright RBAC: column bulk-toggle flips all cells | ⬚ planned | M |
  | S36-04 | Fix I1: ExplorerTableInline state_referenced_locally warnings | ⬚ planned | S |
  | S36-05 | BL-01: machine.init sync.seed — auto seedIfEmpty mobile-first | ⬚ planned | M |
  | S36-06 | Tests + check — full suite verification | ⬚ planned | S |

  Progress: 0/6 stories complete

### Recent Sprint History

  | Sprint | Goal | Status | Tests |
  |--------|------|--------|-------|
  | S35 | QOOLIE-SWR — transparent IDB hydration from server | ✅ done | qoolie 206/206 · machine 472/472 |
  | S34 | SCHEMA-FROM-SERVER + store hydration | ✅ done | 470/470 |
  | S33 | RBAC Matrix UI | ✅ done | 464/464 |
  | S32 | DataList snippet API refactor | ✅ done | 456/456 |
  | S31 | Server seed + qoolie sync server-first | ✅ done | pass |
  | S30 | machine.init(core+business) | ✅ done | pass |

### Roadmap to Release

  #### Planning ✅
  - PRD: done
  - Architecture: done
  - Tech Spec: done

  #### Development ✅
  - Sprint 1-5: Foundation, data layer, real-time, router, polish ✅
  - Sprint 6-12: Bootstrap, server API, validation, sync fixes ✅
  - Sprint 15-16: Release prep, actions layer, soft delete, audit ✅
  - Sprint 17-21: Schema validation, Explorer UX, hooks, files, mail, images ✅
  - Sprint 22-25: Navigation layer, structural refactor, Frame Manager, Unified Explorer ✅
  - Sprint 26-28: System rename, _views wiring, IDB drift detection ✅
  - Sprint 29-33: Explorer vars, DataList refactor, RBAC Matrix, CORS/dbn fixes ✅
  - Sprint 34: SCHEMA-FROM-SERVER + store hydration ✅
  - ADR-02: machine.store(name) function — implemented ✅
  - Sprint 35: QOOLIE-SWR — transparent IDB hydration ✅
  - Sprint 36: Polish & Playwright RBAC — planned 🔨

  #### Testing ✅
  - Unit tests: 472/472 passing (39 files)
  - E2E tests: Playwright golden path verified (6/9 RBAC), 3 remaining in S36

  #### Release ✅
  - Docs/README: ✅ updated for v2 features
  - CHANGELOG: ✅ updated for S29-S35
  - Publish: ready — all blockers cleared

### Artifacts

  | Artifact | Status |
  |----------|--------|
  | PRD | ✅ done |
  | Architecture | ✅ done |
  | Tech Spec | ✅ done |
  | Sprint artifacts (S1-S36) | ✅ done |
  | Test results (S35) | ✅ done — 472/472 |
  | Conventions | ✅ maintained |
  | INTENT.md | ✅ done |
  | README (v2) | ✅ updated |
  | CHANGELOG (v2) | ✅ updated |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  bmad continue   — execute next step
  bmad test       — run tests
  bmad audit      — code quality
  bmad doc        — generate docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
