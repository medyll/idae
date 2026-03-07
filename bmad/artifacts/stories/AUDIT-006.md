# Story AUDIT-006 – Supprimer le dossier `_old/` de `idae-machine`

**Package**: `idae-machine`
**Sévérité**: 🟠 Major
**Source**: Audit full 2026-03-02

## Contexte

`packages/idae-machine/src/_old/` contient 9 fichiers obsolètes (Svelte 4 + vieilles classes SchemeModel).
Les mêmes classes (`SchemeModel.ts`, `schemeModelClass.ts`) existent en double dans :
- `packages/idae-mongo/src/lib/data/`
- `packages/idae-slotui/src/_data/`

## Acceptance Criteria

- [ ] `src/_old/` supprimé de `idae-machine`
- [ ] `coverage/idae-machine/src/_old/` supprimé
- [ ] Les doublons SchemeModel dans `idae-mongo` et `idae-slotui/_data/` sont analysés et soit consolidés dans un package shared, soit documentés comme intentionnels

## Implementation Notes

**Date:** 2026-03-02
**Files deleted:**
- `packages/idae-machine/src/_old/` — 9 fichiers supprimés (CollectionFieldGuess.svelte, CrudZone.svelte, Entity.ts, SchemeFieldClass.ts, SchemeModel.ts, schemeModelClass.ts, types.ts + 2 `.d.ts`). Zéro import détecté → suppression safe.
- `packages/idae-slotui/src/_data/` — 5 fichiers supprimés (SchemeModel.ts, schemeModelClass.ts, SchemeFieldClass.ts, Entity.ts, types.ts). Zéro import dans tout le monorepo.

**Canonical retenu:**
- `packages/idae-mongo/src/lib/data/` → canonical SchemeModel, exporté via `src/lib/index.ts` comme API publique de `@medyll/idae-mongo`.

**Vérification:** `grep src/_old|src/_data` → aucun résultat → aucun import cassé.

**Known limitations:**
- `coverage/` est gitignored — pas de suppression nécessaire côté git.

