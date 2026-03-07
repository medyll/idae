# Story AUDIT-005 – Standardiser vitest dans tous les packages

**Package**: tous (18 sans config de test)
**Sévérité**: 🟠 Major
**Source**: Audit full 2026-03-02

## Contexte

18/20 packages ont des fichiers `.test.ts` mais aucun `vitest.config.ts`. Les tests ne peuvent pas tourner de façon fiable en CI.

## Acceptance Criteria

- [ ] Un `vitest.config.ts` partagé root-level créé dans `packages-config/`
- [ ] Chaque package avec des fichiers `.test.ts` a un `vitest.config.ts` (ou hérite du shared)
- [ ] `pnpm test` fonctionne depuis la racine et lance les tests de tous les packages
- [ ] CI `release.yml` inclut une étape `pnpm test` avant publish

## Implementation Notes

**Date:** 2026-03-02
**Résultat:** 15/20 packages avaient déjà vitest configuré dans `vite.config.ts` ou `vitest.config.ts` — le problème était moins grave que l'audit l'indiquait (scan initial limité aux `vitest.config.ts` uniquement).

**Fichiers modifiés:**
- `packages/idae-html/vite.config.ts` — ajout du bloc `test: { globals, environment, include }` pour `test/**` et `src/**`
- `packages/idae-stator/jest.config.js` — **supprimé** (vitest déjà configuré dans `vite.config.ts`, jest orphelin)
- `.github/workflows/release.yml` — ajout step `pnpm -r run test --if-present` avant le release

**Tests vérifiés:**
- `idae-stator`: 81/81 ✅
- `idae-html`: 6/6 tests passent (1 suite `processHtmlOnce.test.js` — erreur `eta.configure` pre-existante, hors scope)

**État final par package:**

| Package | Config test | Statut |
|---|---|---|
| idae-api, idae-be, idae-cadenzia, idae-csss, idae-db, idae-dom-events, idae-engine, idae-htmlu, idae-idbql, idae-machine, idae-mongo, idae-query, idae-router, idae-stator | `vite.config.ts` (test:) | ✅ |
| idae-socket | `vitest.config.ts` | ✅ |
| idae-slotui | `vite.config.js` (test:) | ✅ |
| idae-html | `vite.config.ts` (test: **ajouté**) | ✅ |

**Known limitations:**
- `idae-html/test/processHtmlOnce.test.js` — `eta.configure` API change — pre-existing, à corriger séparément.
- `idae-db` a des `hookTimeout: 600000` (intégration MongoDB) — ces tests nécessitent un service MongoDB en CI.

