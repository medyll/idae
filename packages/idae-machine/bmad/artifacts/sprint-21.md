# Sprint 21 — Image presets declarative system

**Date:** 2026-05-19
**Goal:** Remplacer la const TS hardcodée `VARIANTS` de `ImageService` par un système déclaratif piloté par l'entité système `appimage_preset` (modèle core), avec auto-création des presets via notation `free-WxH`, et extension du `field('image')` côté schéma domain.

---

## Context

Sprint 20 a livré `ImageService` avec 4 variants hardcodés (`thumb`/`small`/`medium`/`large`) dans une const TypeScript. **Régression vs legacy** : legacy PHP avait au moins `$IMG_SIZE_ARR` global accessible et 7 presets. Aucune entité d'images n'est déclarée dans `idae-model-core.ts`.

Décision design (cf. `bmad/intake-sources/IMAGE-PRESETS-DESIGN.md`) :
- **Niveau 1 DB** : entité système `appimage_preset` éditable runtime, multi-tenant
- **Presets only** (pas de ratios séparés). Tailles libres encodées dans notation : `free-125x88`, `free-w800`, `free-h420`
- **Free notation auto-resolve** : URL `/image/free-125x88` insère automatiquement un row preset si absent, avec flag `auto: true`
- **Field image** : `field('image', { presets: [...], free: bool })` whitelist côté schéma
- **Focus point** : champ optionnel sur `FileMeta.image.focus` — provisionné pour UI future, non câblé ce sprint
- **Ratios séparés** : abandonnés (trop complexes ce sprint)

## Stories

| ID | Title | Effort | Dep |
|----|-------|--------|-----|
| S21-01 | `appimage_preset` entité core + seed defaults + `imagePresetRegistry` cache | M | — |
| S21-02 | URL resolver `/image/:preset` — DB lookup + free-notation auto-create + DOS bounds | M | S21-01 |
| S21-03 | Refactor `ImageService` — drop `VARIANTS`, utiliser registry | S | S21-02 |
| S21-04 | `field('image')` extension + `FileMeta.image.focus` field (UI-ready) | M | S21-01 |

## Decisions

- **Convention nommage** : `name` (pas `label`) — aligne sur `appscheme_base` (cf. `idae-model-core.ts` ligne 23-30).
- **Bornes DOS** : `MIN_DIM=16`, `MAX_DIM=4096`. Hors bornes → 400 sans insertion DB.
- **Cache registry** : Map mémoire `code → Preset`, invalidé via hook `post:create/update/delete` sur `appimage_preset` (S20-01 hook system réutilisé).
- **Auto-flag** : presets free-* portent `auto: true`. Permet GC futur (sprint séparé).
- **Pas de scope par collection ce sprint** : champ `scope` ajouté à l'entité mais toujours `'global'`. Branche collection/field scope = sprint futur.
- **Format `auto`** : si original PNG-alpha → output PNG/WebP. Sinon JPEG. Variant accepte override `?fmt=webp`.
- **`fit` defaut** : `inside` (no enlarge) si free-w*/free-h*. `cover` si `free-WxH` (les 2 dimensions fournies = intention crop). Override possible via preset row.

## Output files (récap)

- `src/lib/types/idae-model-core.ts` — entité `appimage_preset` ajoutée
- `server/src/services/ImagePresetRegistry.ts` — **NEW** cache + resolver
- `server/src/bootstrap/seedImagePresets.ts` — **NEW** seed defaults
- `server/src/routes/files.ts` — endpoint `/image/:preset` réécrit
- `server/src/services/ImageService.ts` — `VARIANTS` remplacé
- `server/src/types/imageMeta.ts` — `focus?` field ajouté
- `src/lib/main/machine/fieldBuilder.ts` — extension type `image`
- Tests : `imagePresetRegistry.test.ts`, `imageResolver.test.ts`, update `image.test.ts`
