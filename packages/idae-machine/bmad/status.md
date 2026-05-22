# idae-machine — Status Report

> Schema-driven full-stack framework: declare a schema once, get CRUD UI, validation, real-time sync and multi-frame navigation for free. Built for developers who want to ship data-driven apps without boilerplate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Product Overview

  Progress   [██████████] 100%   Phase: development (S32 complete)

### Sprint 32 — DataList API Refactor ✅ COMPLETE

  | Story | Status | Description |
  |-------|--------|-------------|
  | S32-01 | ✅ | componentRegistryEntries.test.ts — 2 entries |
  | S32-02 | ✅ | 4 consumers migrated, no straggler |
  | S32-03 | ✅ | Explorer mode binding — userMode + $derived |
  | S32-04 | ✅ | PaneRecents collection key verified identical |
  | S32-05 | ✅ | :global() on listClass/groupClass selectors |
  | S32-06 | ✅ | conventions.md DataList API documented |
  | S32-07 | ✅ | check 0 errors / 4 warnings, vitest 456/456 |

### Post-S32 Polish (commit c086ba00)

  - InputEmail/InputCurrency state init — local-capture warnings gone
  - Explorer `<li role=button>` → `<li><button>` a11y
  - **check: 0 errors / 0 warnings · vitest: 456/456**

### Features & Capabilities

  | Feature | Status | What it means for users |
  |---------|--------|------------------------|
  | Schema-driven CRUD | ✅ Shipped | Define fields once, get forms, lists and tables automatically |
  | Offline-first data | ✅ Shipped | Works without internet, syncs when back online |
  | Real-time sync | ✅ Shipped | Changes from other users appear instantly without refresh |
  | Field types library | ✅ Shipped | Text, number, date, email, currency, boolean, FK relations, images |
  | File & image upload | ✅ Shipped | Drag-drop uploads with automatic image resizing and presets |
  | Permission system | ✅ Shipped | Role-based access: users see only what they're allowed to |
  | Domain actions | ✅ Shipped | Business logic hooks run automatically on create/update/delete |
  | Schema validation | ✅ Shipped | Server-side rules enforced before any data is saved |
  | SPA navigation | ✅ Shipped | URL-driven navigation loads the right view in the right zone |
  | Multi-zone layout | ✅ Shipped | Content loads into named zones (main, modal, window) |
  | Component library | ✅ Shipped | Explorer (4 modes), DataList, SchemeList, CardForm — composable |
  | Multi-frame manager | ✅ Shipped | Open multiple records simultaneously, toggle between them |
  | Universal AppShell | ✅ Shipped | Snippet-based layout with operational defaults |
  | Entity Views (_views) | ✅ Shipped | Server-driven view definitions (list/form/mini/fk_label) consumed by Explorer |

### What's Ready Now

- Full CRUD for any collection declared in schema — no extra code
- Offline-first with IndexedDB + server sync via WebSocket
- Complete field type coverage including FK relations and image focus points
- Role-based permissions enforced client and server side
- Domain action hooks (validate, beforeDelete, afterCreate) per collection
- Composable data-ui components (DataList, SchemeList) for custom layouts
- Pagination, sort, groupBy on collection lists
- **Frame Manager**: `machine.loadFrame('card.form', 'vehicle', '42')` opens dynamic frames
- **AppShell**: universal frame template with `{#snippet navbar/sidebar/content}`
- **Explorer**: single component with 4 modes (list/table/card/actions), consumes `_views` for field ordering
- **Entity Views**: `getModel()` builds `_views` from MongoDB `appscheme_view` rows
- **System collections**: properly named `appuser_prefs`, `appuser_activity`, `appuser_history`

### What's Coming Next

- Visual schema builder (far vision)
- Plugin marketplace for custom field types
- AI-powered features (smart defaults, auto-generated validations)

### Risks & Blockers

- None identified.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Development Details

  Sprint     27 (complete)
  Role       scrum-master
  Next cmd   `bmad-status`

### Current Sprint

  ✅ Done     S27 complete — Wire _views bout-en-bout (6/6 stories, 442/442 tests)

### Stories — Sprint 27

  | ID | Title | Status | Effort |
  |----|-------|--------|--------|
  | S27-01 | getModel() query appscheme_view → build _views | ✅ done | M |
  | S27-02 | Explorer.svelte consomme _views par mode | ✅ done | M |
  | S27-03 | MachineScheme.views getter → Partial<EntityViews> | ✅ done | S |
  | S27-04 | InputSelect uses _views.fk_label for FK labels | ✅ done | S |
  | S27-05 | demoScheme deploy + verify _views in MongoDB | ✅ done | S |
  | S27-06 | Tests + Playwright golden path | ✅ done | M |

  Progress: 6/6 stories (100%)

### Roadmap to Release

  #### Planning ✅
  - PRD: done
  - Architecture/Spec: done

  #### Development ✅
  - Sprint 1–12: foundation, server, CRUD, auth, sync ✅
  - Sprint 13: schemelink, meta-collections, Pane ✅
  - Sprint 14: pagination, sort, FK labels ✅
  - Sprint 15: release prep, exports, build ✅
  - Sprint 16: soft delete, audit, domain actions ✅
  - Sprint 17: schema validation server-side ✅
  - Sprint 18: Explorer UX (sortBy, groupBy) ✅
  - Sprint 19: defaultSort per collection ✅
  - Sprint 20: hooks registry, file/mail/image services ✅
  - Sprint 21: image presets system ✅
  - Sprint 22: navigation layer (machine.loadIn, componentRegistry, SchemaRouter) ✅
  - Sprint 23: structural refactor (data-ui/ + shell/, DataList, SchemeList) ✅
  - Sprint 24: Frame Manager (MachineFrameManager, loadFrame, TaskBar) ✅
  - Sprint 25: Unified Explorer Architecture ✅
  - Sprint 26: System collection rename ✅
  - Sprint 27: Wire _views bout-en-bout ✅

  #### Testing ✅
  - Unit tests: 442/442 green (37 files)
  - E2E tests: Playwright smoke pass

  #### Release ⬚
  - Docs/README: pending
  - CHANGELOG: pending
  - Publish: pending

### Artifacts

  | Artifact | Status |
  |----------|--------|
  | PRD | ✅ done |
  | Architecture | ✅ done |
  | Tech-spec | ✅ done |
  | Sprint 25 artifact | ✅ done |
  | Sprint 26 artifact | ✅ done |
  | Sprint 27 artifact | ✅ done |
  | NAVIGATION.md | ✅ done |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  bmad-status     — show this report
  bmad-test       — run tests
  bmad-audit      — code quality
  bmad-doc        — generate docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
