# idae-machine — Status Report

> idae-machine is a schema-driven full-stack framework for building data-heavy apps with offline-first storage, real-time sync, and generated CRUD UI. The platform is already broadly functional; the current release sprint is hardening relational data views so linked records are easier to navigate and trust in production.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Product Overview

  Progress   [░░░░░░░░░░] 0%   Phase: release

### Features & Capabilities

  | Feature | Status | What it means for users |
  |---------|--------|------------------------|
  | Schema-driven CRUD platform | ✅ Shipped | Teams define collections once and immediately get consistent data screens, validation, and persistence behavior |
  | Offline-first data sync | ✅ Shipped | Users can keep working locally and let the system reconcile with the server when connectivity returns |
  | RBAC and admin controls | ✅ Shipped | Organizations can manage who sees and edits what through groups, roles, grants, and a visual matrix |
  | Frame-based navigation | ✅ Shipped | Complex back-office flows can open records, views, and tools in a multi-pane UI instead of a flat page flow |
  | Server-sourced schema delivery | ✅ Shipped | The app can boot from live schema definitions rather than hard-coded client declarations |
  | Reusable DataList rendering | ✅ Shipped | Product screens can show lists, tables, grouping, sorting, and navigation from one composable primitive |
  | FK/RFK related-record viewers | 🔨 Building | Users will be able to see linked records directly from a record context without wiring manual relation screens |

### What's Ready Now

- End-to-end schema-driven CRUD is already in place across client, server, and storage layers.
- Offline-first IndexedDB plus SWR-style hydration is already shipping, so cold local reads can recover transparently from the server.
- RBAC, Explorer navigation, frame management, and schema-from-server boot are already implemented.
- DataList already supports filtering, grouping, sorting, toolbar controls, and navigation hooks as a reusable UI foundation.

### What's Coming Next

- Deterministic FK-driven list views that ignore persisted user filters when they would hide related data incorrectly.
- Schema helpers that resolve the real FK field name behind relation metadata, enabling safer relation introspection.
- Forward and reverse linked-record viewers (`DataListFk`, `DataListRfk`) to surface related entities without custom screens.
- Sprint verification work: exports, `svelte-check`, and full test coverage for the new relation viewers.

### Risks & Blockers

- Persisted `DataList` user preferences can currently hide FK-filtered results; Sprint 40 starts by neutralizing that for relation viewers.
- Playwright RBAC backlog item `BACK-05` remains open, so release hardening is not fully closed yet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Development Details

  Sprint     40
  Role       scrum → next: developer
  Next cmd   `bmad-dev-story S40-01`

### Current Sprint

  ✅ Done     Sprint 39 completed the DataList navigation and `machine.framer` migration with passing targeted tests and `svelte-check`.
  🔨 Doing    Sprint 40 is in progress: FK/RFK data viewers, prerequisite DataList prefs isolation, schema helpers, wrapper components, then verification.
  💡 Next     S40-01 — add `usePrefs` / `prefsScope` control so relation viewers are not polluted by persisted `appuser_prefs`.
  ⚠️ Blockers None beyond the known FK-viewer correctness issue already scoped into S40-01.

### Stories

  | ID | Title | Status | Effort |
  |----|-------|--------|--------|
  | S40-01 | DataList opt-out prefs — prop usePrefs/prefsScope to disable user-prefs hydration | ⬚ todo | S |
  | S40-02 | MachineScheme.findFkField + parseReverseFkFields — schema helpers | ⬚ todo | S |
  | S40-03 | DataListFk.svelte — forward FK data viewer | ⬚ todo | M |
  | S40-04 | DataListRfk.svelte — reverse FK data viewer | ⬚ todo | M |
  | S40-05 | Tests unitaires — dataListFk.test.ts + dataListRfk.test.ts | ⬚ todo | M |
  | S40-06 | Exports + svelte-check + full suite verification | ⬚ todo | XS |

  Progress: 0/6 stories

### Roadmap to Release

  #### Planning ✅
  - PRD: done
  - Architecture/Spec: done

  #### Development 🔨
  - Sprint 34: SCHEMA-FROM-SERVER + startup hydration ✅
  - Sprint 35: QOOLIE-SWR and transparent cold-read hydration ✅
  - Sprint 36: Playwright RBAC polish + mobile-first seed ✅
  - Sprint 37: `machine.be` + input size support ✅
  - Sprint 38: DataList infinite scroll ✅
  - Sprint 39: DataList navigation + `machine.framer` migration ✅
  - Sprint 40: FK/RFK data viewers 0/6 stories 🔨

  #### Testing 🔨
  - Unit tests: previously green on completed stories; Sprint 40 verification pending
  - E2E tests: backlog item `BACK-05` still open

  #### Release 🔨
  - Docs/README: baseline docs present, release refresh pending Sprint 40 outcome
  - CHANGELOG: pending current release-hardening sprint
  - Publish: pending Sprint 40 verification and remaining release backlog

### Artifacts

  | Artifact | Status |
  |----------|--------|
  | `bmad/artifacts/docs/PRD.md` | ✅ done |
  | `bmad/artifacts/docs/ARCHITECTURE.md` | ✅ done |
  | `bmad/artifacts/docs/TECH-SPEC-S1.md` | ✅ done |
  | Historical sprint artifacts | ✅ done |
  | `bmad/artifacts/status-report.md` | ✅ done |
  | Sprint 40 story files | ⬚ pending |
  | Sprint 40 test results | ⬚ pending |

### Backlog

  | ID | Priority | Title |
  |----|----------|-------|
  | BACK-05 | high | Playwright RBAC golden-path — 3 tests encore à passer |
  | BL-02 | medium | explorerUtils.ts → data-ui/ — upward dependency to fix |
  | BL-06 | medium | Système état sélection via data-collection / data-collection-id |
  | BL-04 | low | shell/frame/index.ts — barrel to refresh |
  | BL-05 | low | MachineDb reactive from IDB:appscheme — long-term vision |
  | BACK-06 | low | FullInfo.svelte — implémenter le contenu (stub enregistré) |

### Architecture Decisions

  | ID | Status | Decision |
  |----|--------|----------|
  | ADR-01 | ✅ done | Pas de classes wrapper par collection système |
  | ADR-02 | ✅ implemented | `machine.store(name)` = reactive, `machine.collection(name)` = imperative |
  | ADR-03 | 🔲 decided | `DataList` autonome par défaut, `children` optionnel |
  | ADR-04 | ✅ implemented | Link parser DataList + navigation via `machine.framer`; `CollectionNav` supprimé |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  bmad continue   — execute next step
  bmad test       — run tests
  bmad audit      — code quality
  bmad doc        — generate docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
