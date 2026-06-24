# ADR — Field `type` source of truth (BL-23 P0)

> Date: 2026-06-24. Demandeur: medyll. Status: **Décidé**.
> Investigation source: `bmad/artifacts/investigate-field-type.md` (2026-06-23).

## Contexte

`ADR-fk-model-b.md` a déjà tranché (2026-06-02, réaffirmé 2026-06-09) que **le
catalogue `FieldList`** (`server/src/idae/field-defs.ts`) est la source unique de
vérité pour le `type` d'un field, résolu par lookup nom→type — jamais inline sur
le field lui-même. Core (`idae-model-core.ts`) respecte ça : zéro `type:` sur un
field.

L'audit du 2026-06-23 (`investigate-field-type.md`) montre que ce principe n'a
**jamais été appliqué côté business models** : crfr (623 occurrences), idaenext
(492), tactac (479), demo (155) inlinent `type:` sur chaque field. Causes
mécaniques identifiées :

1. `BaseFieldDef.type` est **requis** (`src/lib/types/machine-model.ts:23`) —
   tout modèle annoté `: MachineModel` est forcé d'inliner.
2. `publishModel.ts:346` lit `fd.type ?? 'text'` directement — ne consulte
   jamais `FieldList[fieldName]`, malgré `FieldList` déjà importé (sert
   seulement à construire les whitelists `FIELD_TYPES`/`FIELD_GROUPS`).
3. `syncFieldList.ts` aspire modèles→catalogue (sens inverse de l'intention) —
   le catalogue est rempli par les modèles au lieu de les piloter.

Ce n'est pas un nouveau débat A vs B — la décision philosophique est déjà prise.
C'est un constat que la décision **n'a jamais été implémentée** pour le métier.

## Décision

1. **Confirmé** : `FieldList` reste l'unique source de vérité du `type`.
   `type:` inline sur un field business = **toléré comme override explicite
   uniquement**, jamais comme déclaration primaire.
2. **`BaseFieldDef.type` devient optionnel** (P1) — un modèle peut omettre
   `type` et laisser le catalogue résoudre.
3. **`publishModel.ts` résout catalogue-first** (P2) : `FieldList[fieldName]?.type
   ?? fd.type ?? 'text'`. L'inline ne s'applique que si le nom est absent du
   catalogue (override réel) ou si le catalogue manque l'entrée.
4. **`syncFieldList` s'inverse en vérificateur** (P3) : signale (warn, pas
   throw — modèles encore en construction, cf. ADR-fk-model-b.md §0quater
   "seul risque restant") tout field business présent dans un modèle mais
   absent du catalogue, au lieu de le backfiller silencieusement.
5. **Purge des `type:` inline désormais redondants** (P4) — différée,
   **nécessite une réconciliation préalable** : tout field où l'inline diverge
   du catalogue doit être audité avant suppression (le catalogue n'est pas
   automatiquement "plus juste" — il peut lui-même contenir une erreur). Pas
   dans ce lot.

## Conséquences

- P1/P2/P3 sont des changements de **résolution**, pas de **données** : aucun
  fichier modèle business n'est touché. Risque limité à `machine-model.ts`,
  `publishModel.ts`, `syncFieldList.ts`.
- P2 change le type *effectivement publié* pour tout field où l'inline divergeait
  du catalogue — comportement runtime, pas cosmétique. D'où l'audit de
  réconciliation avant d'activer P2.
- P4 (codemod sur 21 modèles, ~1750 lignes `type:`) reste un lot séparé,
  explicitement hors scope tant que la réconciliation n'a pas listé les
  divergences.

## Mise à jour — P2 reporté après audit (2026-06-24)

L'audit de réconciliation (3847 fields business inline-typés vs `FieldList`) donne :
**888 mismatches, 1411 occurrences/803 noms absents du catalogue.** Détail complet :
`investigate-field-type.md` §"Suite".

Constat clé : la majorité des mismatches ne sont **pas des erreurs côté business
models** — le catalogue est **plus pauvre** (`id`→`number`, `phone`/`icon`/
`currency`/`image`/`url`→`text`/`number`). Basculer `publishModel.ts` en
catalogue-first *aujourd'hui* dégraderait le rendu (perte des widgets dédiés
téléphone/icône/devise/image, PK traitées comme `number` générique) sur les 19
orgs business — ce serait une régression déguisée en fix.

**P2 est donc reporté.** Préalable réel : réparer/compléter `FieldList` (rapprocher
888 types, ajouter 803 noms) — chantier propre, pas inclus dans l'effort "M" initial.
P3/P4 restent différés pour la même raison (dépendent d'un catalogue fiable).
P0+P1 livrés (sûrs, zéro changement de comportement) ; le reste attend une décision
explicite sur qui répare le catalogue et comment.

## Références

- `bmad/artifacts/investigate-field-type.md` — constat + pré-plan phasé P0-P5.
- `bmad/artifacts/docs/ADR-fk-model-b.md` §7/§10/§11 — décision philosophique
  préexistante (B canonique, FieldList source unique), dont cet ADR est
  l'application au cas business models.
