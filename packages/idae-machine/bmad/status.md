# idae-machine — Status Report

> Schema-driven full-stack framework: declare a schema once, get CRUD UI, validation, real-time sync and multi-frame navigation for free. Built for developers who want to ship data-driven apps without boilerplate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Product Overview

  Progress   [██████████] 100%   Phase: development (S24 active)

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
  | Component library | ✅ Shipped | ExplorerList, CardForm, DataList, SchemeList — composable and reusable |
  | Multi-frame manager | 🔨 Building | Open multiple records simultaneously, toggle between them, taskbar navigation |

### What's Ready Now

- Full CRUD for any collection declared in schema — no extra code
- Offline-first with IndexedDB + server sync via WebSocket
- Complete field type coverage including FK relations and image focus points
- Role-based permissions enforced client and server side
- Domain action hooks (validate, beforeDelete, afterCreate) per collection
- URL-driven SPA: `machine.loadIn('explorer.list', 'main', 'vehicle')` navigates correctly
- Composable data-ui components (DataList, SchemeList) for custom layouts
- Pagination, sort, groupBy on collection lists

### What's Coming Next

- Open multiple records simultaneously (S24 — Frame Manager)
- Toggle/minimize open frames via TaskBar (legacy windowGui pattern, modernized)
- `machine.loadFrame('card.form', 'vehicle', '42')` opens a frame by content, not by zone name

### Risks & Blockers

- None identified.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Development Details

  Sprint     24
  Role       scrum-master → next: developer
  Next cmd   `bmad-continue`

### Current Sprint

  ✅ Done     S23 complete — data-ui/ + shell/ structure, DataList/SchemeList composable, 403/403 tests
  🔨 Doing    S24 — MachineFrameManager, machine.loadFrame(), <Frame> component, TaskBar
  💡 Next     S24-01: MachineFrameManager singleton + FrameControls interface
  ⚠️ Blockers none

### Stories — Sprint 24

  | ID | Title | Status | Effort |
  |----|-------|--------|--------|
  | S24-01 | MachineFrameManager singleton + FrameControls | ⬚ todo | S |
  | S24-02 | computeFrameId() — ID déterministique | ⬚ todo | S |
  | S24-03 | machine.loadFrame() | ⬚ todo | S |
  | S24-04 | `<Frame>` Svelte component | ⬚ todo | M |
  | S24-05 | Wire machine.loadIn() via frameManager | ⬚ todo | M |
  | S24-06 | `<TaskBar>` component | ⬚ todo | M |
  | S24-07 | Tests + intégration | ⬚ todo | M |

  Progress: 0/7 stories

### Roadmap to Release

  #### Planning ✅
  - PRD: done
  - Architecture/Spec: done

  #### Development 🔨
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
  - Sprint 24: Frame Manager (MachineFrameManager, loadFrame, TaskBar) 🔨

  #### Testing 🔨
  - Unit tests: 403/403 green
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
  | Sprint 22 artifact | ✅ done |
  | Sprint 23 artifact | ✅ done |
  | Sprint 24 artifact | ✅ done |
  | NAVIGATION.md | ✅ done |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  bmad continue   — execute next step (S24-01)
  bmad test       — run tests
  bmad audit      — code quality
  bmad doc        — generate docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
