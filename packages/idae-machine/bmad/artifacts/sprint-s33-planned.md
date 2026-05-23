# Sprint 33 — RBAC Matrix UI

**Date:** 2026-05-23
**Goal:** Wire grant editor for existing RBAC schema. Schema + MachineRights already complete; missing UI to manage grants.
**Scope:** Matrix-only (audit explorer + assignments panel deferred).

## Context

- Collections RBAC déjà au schéma: `appuser`, `appuser_group`, `appuser_type`, `appuser_assignment`, `appuser_grant`, `appuser_session`, `appuser_audit`.
- `MachineRights.loadPoliciesFromModel()` + `checkAccess(collection, op)` opérationnels.
- Manque: UI éditeur permission matrix (collection × CRUDLX × group/type).

## Stories

### S33-01 — Seed `_views` pour collections RBAC (S)

`listView` et `formView` dans `appscheme_view` MongoDB pour:
- `appuser_group` (code, name, color, order, isSystem)
- `appuser_type` (code, name, color, typeLevel, isSystem)
- `appuser_assignment` (fks.appuser, assignmentType, isPrimary, validFrom, validUntil)
- `appuser_grant` (fks.appscheme.code, grantType, c/r/u/d/l/x, validFrom, validUntil)

**Verify:** Explorer ouvre chaque collection avec colonnes lisibles.

### S33-03 — RbacMatrix frame (M, composition)

- Nouveau composant `src/lib/shell/frame/rbac/RbacMatrix.svelte` (thin glue ~80 lignes).
- Itère `machine.logic.collections()` pour rows (pas DataList — pas une liste de records).
- Header table sticky + first col sticky (CSS).
- Cells = `<DataFields collection="appuser_grant" dataId={grantId} fields={['c','r','u','d','l','x']} editable />`. DataFields dispatche `boolean` → `InputBoolean` → persist via store.update.
- Helper `resolveGrantId(collectionCode, groupId)` — lookup `appuser_grant` where appscheme=code+appuser_group=groupId; create empty row au premier toggle si absent.
- Register `componentRegistry` clé `'rbac.matrix'`.
- Navigation: `machine.loadFrame('rbac.matrix', undefined, undefined, { groupId | typeId })`.
- CollectionNav entrée "Permissions" → loadFrame rbac.matrix.

**Reuse:** zero custom field logic. Validation/persist/sync free via DataFields existing pipeline.

**Out of scope:** temporal constraints UI (validFrom/Until), constraints JSON, multi-select bulk.

### S33-06 — Tests + Playwright (M)

- Unit: `rbacMatrix.test.ts` — toggle cell crée/supprime grant, bulk header toggle, filtre group.
- Playwright: ouvrir `/rbac.matrix?groupId=admin`, toggle 3 cells, vérifie persistance.
- `pnpm run check` 0 errors, full vitest pass.

## Non-Goals

- S33-02 nav grouping (reporté)
- S33-04 user assignments panel (reporté)
- S33-05 audit explorer (reporté)
- Constraints JSON editor
- Temporal validFrom/validUntil pickers
- Effective-rights preview

## Acceptance

- Naviguer vers RBAC matrix depuis sidebar
- Toggle permission → grant persiste en MongoDB (sync server-first)
- `MachineRights.checkAccess` reflète changement après reload
- Tests verts (459+ baseline)
