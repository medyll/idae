# Sprint 48 — RBAC write-path unification + menu rights foundation

**Goal:** Land BL-08 (machine.action comme chemin d'écriture unique) and BL-11 (MachineRights.allowedCollections) in parallel — two independent, no-dep, no-ADR backlog items, zero file overlap. Unblocks BL-09/BL-10 (RBAC-VIA-DATALIST epic) and BL-13 (MAIN-MENU epic).

## Stories

| ID | Backlog | Title | Effort | Files | Depends on |
|----|---------|-------|--------|-------|------------|
| S48-01 | BL-08 | machine.action comme chemin d'écriture unique (DataForm + RbacMatrix) | M | `src/lib/data-ui/data/DataForm.svelte`, `src/lib/shell/frame/rbac/RbacMatrix.svelte` | none |
| S48-02 | BL-11 | MachineRights enumeration — allowedCollections(op) | S | `src/lib/main/.../MachineRights.ts` | none |

Total estimated effort: M + S — within 1-sprint capacity for 2 parallel agents.

## S48-01 detail (BL-08)

DataForm writes via `machine.collection().create/update` (DataForm.svelte:93-96). RbacMatrix writes via `machine.collection('appuser_grant').create/update` in dur (RbacMatrix.svelte:58-80). Neither uses `machine.action`, violating CLAUDE.md invariant #8/action-dispatcher contract.

Target: both submit paths go through `machine.action(collection, vars, { upsertOn, ... })`. RBAC grant becomes a natural upsert on `['appscheme','appuser_group']` — removes manual existing/create/update branching in `toggleCell`.

Acceptance: grep `machine.collection(...).create` / `.update` in DataForm.svelte and RbacMatrix.svelte → 0 results for the write path (reads via `machine.store`/`machine.collection` unaffected). Full test suite green.

## S48-02 detail (BL-11)

`MachineRights.checkAccess(collection, op)` answers for ONE collection. Menu generator (BL-13) needs "all collections where L=true" for the current user.

Target: add `allowedCollections(op): string[]` to MachineRights — iterate `machine.logic.collections()` × `checkAccess` (note ADR-candidate: lives in MachineRights vs a derived store — pick MachineRights for this story, flag the derived-store alternative as `> Assumed:` if revisited).

Acceptance: new method + unit test (mock rights config: some collections allowed, some denied for a given op → exact-match returned array). Full test suite green.

## Dependencies between stories

None — S48-01 and S48-02 touch disjoint files and disjoint subsystems (write dispatcher vs rights enumeration). Safe to run as 2 parallel agents.

## Explicitly excluded from this sprint (blockers / sequencing)

- **BL-05** — blocked, needs ADR (architectural ownership of runtime model). Not sprint-eligible.
- **BL-23** — needs ADR P0 first (source unique du type de field) per `bmad/artifacts/investigate-field-type.md`. Phased plan (P0→P5), not a single sprint story as-is.
- **BL-22 / BL-24** — both touch `ContextMenuContent.svelte` (BL-22: include RecordToolbar; BL-24: useRecordData extraction). Do NOT run in parallel with each other — sequence in a future sprint, coordinate ownership.

## Next after this sprint

- BL-09 (DataList mode 'form') unlocked by S48-01 — pull next.
- BL-12 (menu pref scopes) — independent, no-dep, pairs well with another story once S48-02 lands; together with S48-02 these two unlock BL-13 (menu generator), which cascades to BL-14..BL-19.
