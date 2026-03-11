# PRD – @medyll/idae-idbql

## Overview
A powerful and flexible IndexedDB query library for TypeScript and JavaScript applications, offering a MongoDB-like query interface, strong TypeScript support, reactive state management, and easy integration with front-end frameworks like Svelte.

## Goals & Success Metrics
| Goal | Metric | Target |
|---|---|---|
| Provide MongoDB-like query interface | Feature completeness | 100% parity with MongoDB query operators |
| Enable reactive state management | Integration tests | 100% passing in Svelte 5/idae-stator |
| Support Svelte 5 Runes and idae-stator | Community adoption | 10+ Svelte projects using idbql |
| Browser-side persistence | Test coverage | >90% unit test coverage |

## User Personas
### Persona 1 – Svelte Developer
- Role: Frontend engineer
- Needs: Reactive, type-safe DB queries
- Pain points: IndexedDB complexity, lack of reactivity

### Persona 2 – TypeScript App Builder
- Role: Full-stack developer
- Needs: Strong typing, easy integration
- Pain points: Boilerplate, weak type inference

### Persona 3 – JS Persistence User
- Role: Web app developer
- Needs: Simple browser-side storage
- Pain points: Manual IndexedDB, lack of query abstraction

## Use Cases
### UC-01 – Reactive User List
**Actor:** Svelte Developer
**Trigger:** User opens app
**Flow:**
1. App loads user collection
2. $derived creates reactive view
3. UI updates on DB change
**Expected outcome:** Always up-to-date user list
**Edge cases:** Large datasets, offline mode

### UC-02 – Bulk Update Tasks
**Actor:** TypeScript App Builder
**Trigger:** Admin updates task priorities
**Flow:**
1. Admin selects tasks
2. Calls updateWhere
3. DB updates, UI reflects changes
**Expected outcome:** Bulk update is atomic and reactive
**Edge cases:** Transaction failures, partial updates

### UC-03 – Simple Storage
**Actor:** JS Persistence User
**Trigger:** App saves settings
**Flow:**
1. User changes settings
2. App stores in IndexedDB via idbql
**Expected outcome:** Settings persist reliably
**Edge cases:** Storage quota, browser compatibility

## Functional Requirements
| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-01 | Support MongoDB-like queries | Must | $gt, $in, $or, etc. |
| FR-02 | Reactive state management | Must | Svelte 5 Runes, idae-stator |
| FR-03 | TypeScript generics | Should | Deep type inference |
| FR-04 | Bulk operations | Should | updateWhere, deleteWhere |
| FR-05 | Easy integration | Must | Svelte, vanilla JS |

## Non-Functional Requirements
| Category | Requirement | Acceptance Criteria |
|---|---|---|
| Performance | Fast queries | <50ms for typical queries |
| Security | Safe data handling | No XSS, no injection |
| Accessibility | Usable in all browsers | Works in Chrome, Firefox, Safari |

## Out of Scope
- Server-side DB abstraction
- Backend API design
- Non-browser environments

## Dependencies
- IndexedDB API
- Svelte 5
- idae-stator

## Open Questions
- [ ] Should we support legacy Svelte 4?
- [ ] Is full MongoDB operator parity required?
- [ ] How to handle browser storage limits?

## Revision History
| Date | Author | Change |
|---|---|---|
| 2026-03-07 | PM Agent | Initial draft |
