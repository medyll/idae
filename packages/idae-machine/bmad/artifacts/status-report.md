# idae-machine — Status Report

> v2.0: A full-stack, schema-driven application framework with real-time sync, offline-first data, and enterprise RBAC — delivering zero-config CRUD, visual navigation, and multi-tenant support for developers building data-intensive apps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Product Overview

  Progress   [██████████] 100%   Phase: development

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
  | SCHEMA-FROM-SERVER | 🔨 Building | Auto-fetch schema on start — eliminates manual schema declarations |

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

### What's Coming Next

- **SCHEMA-FROM-SERVER (BACK-07)**: machine.start() auto-fetches schema from server — drop manual appModelDeclaration import
- **Client store hydration (BACK-03)**: Fix empty client store after CORS/route fix — ensure data pulls correctly
- **Visual schema builder**: Drag-and-drop entity designers (far vision)
- **Plugin marketplace**: Custom field types and components (far vision)

### Risks & Blockers

- None identified. Sprint 33 complete, all tests passing (464/464). Open items are tracked backlog items, not blockers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Development Details

  Sprint     none (S33 completed)
  Role       developer → next: scrum
  Next cmd   `bmad-next`

### Current Sprint

  ✅ Done     Sprint 33: RBAC Matrix UI — grant editor, collection rows × CRUDLX cells, group dropdown, column bulk toggle. CORS fix (route ordering). mongooseConnectionManager dbName propagation fix. seedBusinessData multi-org rewrite. CollectionNav cleanup.
  🔨 Doing    Nothing active — between sprints
  💡 Next     Plan Sprint 34: SCHEMA-FROM-SERVER refactor (BACK-07) + client store hydration (BACK-03)
  ⚠️ Blockers None

### Stories (Recent Sprints)

  | ID | Title | Status | Effort |
  |----|-------|--------|--------|
  | S33-01 | Seed _views — auto-generated from template.presentation | ⏭ skipped | S |
  | S33-03 | RbacMatrix.svelte — composition glue, CRUDLX cells, group dropdown | ✅ done | M |
  | S33-06 | Tests — registry wiring, module resolves, grant payload, OPS shape | ✅ done | S |
  | S32-01 | Fix componentRegistryEntries.test.ts — expect 2 entries | ✅ done | S |
  | S32-02 | Validate all DataList consumers — migrate children() usage | ✅ done | M |
  | S32-03 | Fix Explorer.svelte:45 — currentMode initial-only capture | ✅ done | S |
  | S32-04 | Verify PaneRecents.svelte collection key | ✅ done | S |
  | S32-05 | Scope CSS — :global() on listClass/groupClass selectors | ✅ done | S |
  | S32-06 | Document DataList new API in conventions.md | ✅ done | S |
  | S32-07 | Tester — full suite + check after migration | ✅ done | S |
  | S30-01 | machine.init: model → core + business (deprecated shim) | ⬚ planned | S |
  | S30-02 | buildEffectiveModel(core?, business?) — fusion | ⬚ planned | S |
  | S30-03 | seed() unifié — même appel core et business | ⬚ planned | M |
  | S30-04 | demoScheme = business uniquement | ⬚ planned | S |
  | S30-05 | appModelDeclaration aligné format MachineModel business | ⬚ planned | S |
  | S30-06 | Tests — init/start, seed unifié, rétro-compat | ⬚ planned | M |

  Progress: 33 sprints completed, 1 sprint planned (S30 pending), 1 sprint active (none)

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
  - Sprint 30: machine.init(core+business) — planned, pending activation
  - Sprint 34: SCHEMA-FROM-SERVER + client store hydration — next

  #### Testing ✅
  - Unit tests: 464/464 passing (39 files)
  - E2E tests: Playwright golden path verified

  #### Release 🔨
  - Docs/README: needs update for v2 features
  - CHANGELOG: needs update for S29-S33
  - Publish: pending

### Artifacts

  | Artifact | Status |
  |----------|--------|
  | PRD | ✅ done |
  | Architecture | ✅ done |
  | Tech Spec | ✅ done |
  | Sprint artifacts (S1-S33) | ✅ done |
  | Test results (S33) | ✅ done — 464/464 |
  | Conventions | ✅ maintained |
  | INTENT.md | ✅ done |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  bmad continue   — execute next step
  bmad test       — run tests
  bmad audit      — code quality
  bmad doc        — generate docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
