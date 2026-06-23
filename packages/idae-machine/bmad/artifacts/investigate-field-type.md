# Investigation — inline `type:` on fields in non-core models

> 2026-06-23. Question (user): les models autres que idae-model-core portent une
> propriété `type` sur les fields — anormal d'après le plan de conception. Pourquoi /
> comment ? Pré-plan de correction.

---

## Constat (le quoi)

| Modèle | occurrences `type:` |
|--------|---------------------|
| idae-model-core (`server/src/idae/idae-model-core.ts`) | **9** (aucun sur un field — ce sont `isType`, fk type, etc.) |
| `server/src/idae/field-defs.ts` (FieldList catalog) | 222 |
| crfrScheme | 623 · idaenextScheme 492 · tactacScheme 479 · demo 155 · … (21 modèles) | inline sur chaque field |

- **Core** : chaque field = `{ required, readonly }` **seulement**. Pas de `type`.
  Ex `appscheme.fields.name = { required: true, readonly: false }`.
- **Business/org** : chaque field = `{ type: 'text', required: true }`. Type **inline**.
  Ex `demoScheme.category.fields.code = { type: 'text', required: true }`.

Deux conventions parallèles pour la même information (le type d'un field).

## Le plan de conception (l'intention)

Le type d'un field est **métadonnée de catalogue**, résolue par **relation**, pas inline :

- `field-defs.ts` en-tête : *"Server seed core — source of truth for field metadata
  (type/group/description)"*. Le catalogue `FieldList` est censé être LA source, keyé
  par code de field (`actorId → {type:'number',group:'audit',description}`).
- Core matérialise ça : `appscheme_field` + `appscheme_field_type` (FK) = le type vit
  dans une collection-type, pas sur le field. Core n'inline donc jamais `type`.
- C'est le même principe que les FK (bloc structuré, pas de magic-string) — cf mémoire
  projet `fk_render_rootcause` : le drift vient des encodages multiples d'une même info.

## Pourquoi le drift (le pourquoi)

1. **`BaseFieldDef.type` est requis** (`src/lib/types/machine-model.ts:23` → `type: string`).
   Tout modèle annoté `: MachineModel` (tous les business: `demoScheme: MachineModel`)
   est donc **forcé** d'inliner `type` par le typecheck. Core y échappe car il est
   déclaré `as const` (non annoté MachineModel) et part par un builder distinct.
2. **publishModel lit l'inline directement** : `publishModel.ts:346`
   `const rawType = fd.type ?? 'text'`. Le type publié vient du field def inline, **pas**
   de `FieldList[fieldName].type`. L'inline est donc devenu la source de fait.
3. **syncFieldList va à l'envers** : `syncFieldList.ts` *scanne les modèles* pour
   *backfiller* FieldList (models → catalogue). L'intention était l'inverse : modèles
   consomment le catalogue keyé par code. Le catalogue est alimenté par les modèles au
   lieu de les piloter → redondance + dérive possible (même field, type différent selon
   modèle, aucun garde-fou).

**Résumé** : le type TS impose l'inline, publishModel le consomme, syncFieldList le
ré-aspire dans le catalogue — la relation `appscheme_field_type` (plan core) est
court-circuitée pour les business models.

## Pré-plan de correction (phasé)

**P0 — Décision (ADR)** : source unique du type de field = catalogue `FieldList`
(keyé par code), matérialisé en `appscheme_field` / `appscheme_field_type`. `type` inline
= déprécié, au mieux override explicite. → `bmad-adr`.

**P1 — Type optionnel** : `BaseFieldDef.type` → `type?: string`
(machine-model.ts:23). Débloque l'omission sans casser l'existant. Effort S.

**P2 — Résolution catalogue-first** : `publishModel.ts:346` résout
`FieldList[fieldName]?.type` d'abord ; `fd.type` seulement en override ; `'text'` fallback
final. Garantir couverture FieldList (lancer syncFieldList une dernière fois pour combler
les manques **avant** d'inverser). Effort M.

**P3 — Inverser syncFieldList** : le catalogue devient autorité ; outil de *vérification*
(field dans modèle absent du catalogue = erreur) au lieu de backfill silencieux. Effort M.

**P4 — Codemod de purge** : retirer `type:` inline des 21 business models (crfr 623,
idaenext 492, tactac 479…). Automatisé (AST/regex), field par field, en confirmant que
chaque code existe dans FieldList avec le même type (sinon le préserver/loguer). Effort L.
Risque : types inline divergents du catalogue → P2/P3 doivent réconcilier d'abord.

**P5 — Garde-fou tests** : `demo-roundtrip.test.ts` + validate doivent passer avec type
sourcé du catalogue ; ajouter test "aucun field business n'inline type". Effort S.

Ordre : P0 → P1 → P2 → P3 → P5, P4 en dernier (gros, dépend de la réconciliation).
ADR candidat = P0 (où vit le type de field).
