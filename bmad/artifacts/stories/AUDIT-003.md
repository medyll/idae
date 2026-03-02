# AUDIT-003 — Supprimer @ts-ignore/@ts-nocheck

**Status:** ✅ DONE (2026-03-02)
**Priority:** 🟠 Major
**Story:** Remplacer les suppressions aveugles `@ts-ignore` par `@ts-expect-error` documenté ou corriger le problème sous-jacent.

## Acceptance Criteria

- [x] Ajouter `@typescript-eslint/ban-ts-comment` au shared ESLint config
- [x] Tous les `@ts-ignore` nus (sans description) → convertis
- [x] Problèmes de typage simples → corrigés sans suppression
- [x] Suppressions légitimes → `@ts-expect-error` avec description ≥ 5 chars

## Implementation Notes

**Date:** 2026-03-02

### Contexte

Après suppression du dossier `_old/` (AUDIT-006), le nombre réel de suppressions était ~21 (et non 111 comme dans l'audit — les 90 autres étaient dans les fichiers supprimés).

### Règle ESLint ajoutée

`packages-config/idae-eslint-config/index.js` :
```json
"@typescript-eslint/ban-ts-comment": ["warn", {
  "ts-ignore": "allow-with-description",
  "ts-expect-error": "allow-with-description",
  "ts-nocheck": true,
  "minimumDescriptionLength": 5
}]
```

### Fixes par fichier

| Fichier | Type | Action |
|---|---|---|
| `idae-slotui/utils/engine/elem.ts` | 3× style indexing | Fixé: `elementStyle as unknown as Record<string, string>` |
| `idae-idbql/idbqlCore/idbqlCore.ts` | 3× `Object.defineProperty` dynamic | `@ts-expect-error` + description |
| `idae-idbql/idbqlCore/idbqlCore.test.ts` | 2× accès propriété dynamique | `@ts-expect-error` + description |
| `idae-socket/socketBridge/socketIoServer.ts` | 1× import sans types | `@ts-expect-error` + description |
| `idae-socket/tests/validator.test.ts` | 2× accès méthode privée | `@ts-expect-error` + description |
| `idae-slotui/ui/popper/actions.ts` | 1× Svelte 5 mount() props | `@ts-expect-error` + description |
| `idae-slotui/ui/chromeFrame/chromeFrame.store.ts` | 2× Map value `.zIndex` | `@ts-expect-error` + description |
| `idae-db/IdaeDbAdapter.ts` + `idaeDb.ts` | 3× (déjà `@ts-expect-error`) | Laissés tels quels ✅ |
| `idae-idbql/state/idbqlEvent.svelte.ts:184` | Rune Svelte 5 dans classe | Laissé: déjà exempté avec `eslint-disable-next-line` |

### Tests

- `idae-idbql`: 57/57 ✅
- `idae-query`: 81/81 ✅ (non impacté)
