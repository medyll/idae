# Sprint 41 — Planned

> **Goal:** Restaurer la fiabilité de la suite serveur + supprimer 2 dettes structurelles (upward dep + data-attribute kebab).

Date: 2026-06-01
Phase: release

---

## Stories

### S41-01 — Triage + fix 23 server integration test failures (M)

**Source:** BACK-08 (audit 2026-06-01)

**Context:** Server suite baseline: 23 failures across 7 files. Pattern identifié via
`seedBusinessData.test.ts` (fixé session précédente): tests écrits contre ancienne
signature (2-args) alors que l'implémentation a migré vers opts-objet. Triage = lire
chaque fichier failing, identifier le gap, aligner sur l'API courante.

**Acceptance criteria:**
- `cd server && pnpm test` → 0 failures sur les 7 fichiers ciblés (ou justification
  explicite si un test nécessite Mongo live et est marqué `.skip`)
- Aucune régression sur les 145 tests passants
- Résultat vitest capturé dans `bmad/artifacts/test-results-sprint-41.md`

**Dependencies:** none

---

### S41-02 — `data-collectionId` → `data-collection-id` kebab + dataset readers (S)

**Source:** BL-06 (audit 2026-06-01)

**Context:** `MachineSchemeValues.getInputDataSet()` émet `data-collectionId` (camelCase).
HTML lowercases tous les noms d'attributs → `el.dataset.collectionId` retourne `undefined`
sur les navigateurs. Tout consumer qui lit `dataset.collectionId` est silencieusement cassé.

**Files:**
- `src/lib/main/machine/MachineSchemeValues.ts` — rename émis `data-collectionId` → `data-collection-id`
- `src/lib/data-ui/field/DataField.svelte` — lire `inputDataset` : vérifier si `data-collectionId` est
  consommé en lecture quelque part (spread passé au DOM = HTML normalise, pas de lecture JS directe → OK)
- Grep global pour lecteurs `dataset.collectionId` ou `getAttribute('data-collectionId')` → corriger

**Acceptance criteria:**
- `getInputDataSet()` émet `'data-collection-id'` (kebab)
- `pnpm check` 0 erreurs
- `pnpm test` suite complète green
- Grep `data-collectionId` (camelCase) = 0 résultat dans src/

**Dependencies:** none

---

### S41-03 — Move `sortItems`/`groupItems` `shell/frame/` → `data-ui/utils/` (S)

**Source:** BL-02

**Context:** `data-ui/` components importent `sortItems`/`groupItems` depuis
`shell/frame/explorerUtils.ts` ou similar — dépendance montante (data-ui → shell).
Convention : utils génériques du data layer dans `data-ui/utils/`.

**Files:**
- Localiser `sortItems`/`groupItems` (grep pour confirmer path exact)
- Déplacer vers `src/lib/data-ui/utils/sortGroupUtils.ts` (ou intégrer dans fichier existant)
- Mettre à jour tous les imports
- Vérifier que `shell/frame/` peut encore importer depuis `data-ui/utils/` (sens correct)

**Acceptance criteria:**
- `pnpm check` 0 erreurs
- `pnpm test` suite complète green
- `git grep "shell/frame.*sort\|shell/frame.*group"` dans `data-ui/` = 0 résultats

**Dependencies:** none

---

## Effort total

| Story | Effort |
|-------|--------|
| S41-01 | M |
| S41-02 | S |
| S41-03 | S |
| **Total** | M+2S |

Stories indépendantes — peuvent être exécutées dans n'importe quel ordre.
S41-01 en premier (plus de valeur, restaure signal serveur).
