# Image Presets — Design Intake

> **Origine** : conversation 2026-05-19 — visibilité manquante sur déclaration tailles images post-S20.
> **Reference legacy** : `D:/development/idae-legacy/IMAGE.md` (système GridFS PHP, 7 presets fixes + 4 builds).
> **Status** : design validé → Sprint 21 (S21-01 à S21-04).

---

## Constat (état post-S20-04)

- Variants hardcodés TS dans `server/src/services/ImageService.ts:18-23` (`thumb`/`small`/`medium`/`large`).
- Type `ImageVariant` = union littérale rigide.
- Collection `appfile` créée à la volée (FileService.ts:37), **pas déclarée** dans `idae-model-core.ts`.
- Aucun mécanisme pour qu'un domaine déclare ses presets (banner 21/9, avatar carré, etc.).
- Aucun lien `field('image')` → schéma.

**Conclusion** : pire que legacy. Legacy avait au moins `$IMG_SIZE_ARR` global accessible PHP.

## Décisions design (validées user)

### D1 — Niveau 1 : entité système DB

`appimage_preset` collection déclarée dans `idae-model-core.ts`, seedée au boot avec defaults. Éditable runtime via UI machine standard (CRUD via `/api/data/appimage_preset` + RBAC).

Rationale : multi-tenant, édition runtime, gouvernance par admin, traçable.

### D2 — Presets only, free notation pour tailles libres

**Ratios abandonnés** (trop complexe ce sprint).

Notation `free-*` :
- `free-WxH` → `cover` (intention crop)
- `free-wW`  → `inside` (largeur seule, hauteur auto, no enlarge)
- `free-hH`  → `inside` (hauteur seule, largeur auto)

URL `/api/files/:fileId/image/:preset` :
- Si preset existe en DB → utilise
- Si pattern `free-*` valide → **auto-insert** row preset avec `auto: true`
- Sinon → 404

**DOS bounds** : `MIN_DIM = 16`, `MAX_DIM = 4096`. Hors bornes → 400 sans insertion.

### D3 — Field `image` dans schéma

```ts
field('image', {
  presets: ['thumb', 'banner'],   // whitelist par code
  free:    false,                 // accepte free-WxH (default: false si presets, true sinon)
  maxSize: 10 * 1024 * 1024,
  preset:  'avatar',              // alt: mono-preset (xor avec presets)
})
```

### D4 — Focus point (réservé UI future)

`FileMeta.image.focus?: { x: number; y: number }` (0..1 normalisés).
- Persisté + retourné API ce sprint
- Resolver crop **n'utilise pas encore** ce champ
- UI future = pin drag sur preview, write via `PATCH /api/files/:id/focus`
- Future sprint câblera `sharp.extract` zone-of-interest pour `fit=cover`

### D5 — Convention `name` (pas `label`)

Aligne sur `appscheme_base` (idae-model-core.ts ligne 23-30) : `{id, code, name, color, icon, order}`.

## Architecture finale

```
URL /api/files/:fileId/image/:preset
  │
  ├─ ImageResolver.resolve(presetCode)
  │   ├─ ImagePresetRegistry.get(code) (cache mémoire)
  │   ├─ DB lookup `appimage_preset`
  │   ├─ Pattern free-* match → DOS check → insert auto row
  │   └─ Throw PresetError 400|404
  │
  ├─ FileService.getFileMeta(fileId)
  ├─ ImageService.getVariant(storedPath, preset, fmt?)
  │   ├─ Cache key: `{storedPath}.{preset.code}.{ext}`
  │   └─ sharp pipeline depuis preset config
  │
  └─ Stream cache fichier au client
```

```
Mutation appimage_preset via POST/PUT/DELETE /api/data/appimage_preset
  └─ Hook post:create/update/delete (S20-01 hooks)
       └─ ImagePresetRegistry.invalidate() — reload sur prochain get
```

## Presets seedés par défaut

| code   | width | height | fit    | usage typique |
|--------|-------|--------|--------|---------------|
| thumb  | 150   | 150    | cover  | grid vignette |
| square | 120   | 120    | cover  | bouton, badge |
| small  | 480   | —      | inside | preview liste |
| medium | 1024  | —      | inside | détail card   |
| large  | 2048  | —      | inside | full screen   |
| banner | 1920  | 480    | cover  | header page   |
| avatar | 256   | 256    | cover  | profil user   |

## Sprint 21 — stories issues de cette intake

- **S21-01** : entité core `appimage_preset` + seed + registry cache + hook invalidation
- **S21-02** : URL resolver `/image/:preset` + free-notation auto-create + DOS bounds + index unique
- **S21-03** : refactor `ImageService` — drop `VARIANTS`, signature preset-based, `invalidateCache` glob
- **S21-04** : `field('image')` extension + `FileMeta.image.focus` (UI-ready, non câblé crop ce sprint)

## Hors scope sprint 21

- UI focus-pin drag (sprint séparé quand front prêt)
- Sprite/atlas génération (multi-images combinées)
- EXIF strip sécurité
- GC orphelins (presets auto:true non utilisés depuis N jours)
- Scope par collection/field (champ `scope` présent mais toujours 'global')
- Multi-images sur un même champ (`multiple: true` accepté mais ignoré)
- GridFS storage option (FS local seul)
- Sprite WebP/AVIF négociation Accept header
