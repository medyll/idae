# UNMULTIPLE.md — plan d'exécution : mort du FK-multiple, un seul shape `fks[collection]`

> **Décision utilisateur, 2026-07-06.** Plan versionné, pas brouillon LLM.
> Portée gelée : ne touche NI le `multiple` type-de-champ (upload/multiselect), NI le mode de requêtage sous-objet (`where('fks.produit.code', X)`), NI le refactor `machine.ts`.
> Voir mémoire `project_fk_read_resolution_law` (loi v2).

---

## 0. La loi (ce qu'on rend vrai)

1. **L'objet `fks` sur le record RESTE, persisté.** Écrire le nom de collection à plat comme champ empêche l'automatisation. Le requêtage sous-objet `fks.<collection>.<champ>` est le mode canonique — on ne le change pas.
2. **Un FK est toujours single.** `MachineFkDef.multiple` meurt. Besoin N-N → **table de jonction** `X_has_Y` (deux FK single).
3. **Clé unique : `fks[collection]`.** Plus jamais `fks[collection_id]`. Le shape indécidable disparaît avec `multiple`, pas avec le sac.
4. **Master qoolie.** Le métier fold/résolution est fourni par **qoolie** (le vrai package, sibling monorepo — modifiable), pas dupliqué client/serveur. Descripteur injecté, aucun vocabulaire idae dans qoolie.

---

## 1. État réel constaté (2026-07-06, lu dans le code)

**3 écritures de snapshot, 2 shapes divergents :**

| Fold | Fichier | single | multiple |
|------|---------|--------|----------|
| Client domaine (actif) | `src/lib/idae/relations/RelationPolicy.ts:126` `foldRelations` | `fks[field]` | `fks[field_value]` |
| Client fallback | `src/lib/main/machine/MachineFkFold.ts:33` `foldFksIntoRecord` | `fks[field]` | `fks[field_value]` |
| Serveur | `server/src/validation/FkFolder.ts:25` `foldFks` | — | `fks[field_targetId]` **toujours** |

**1 read tolérant** = ce qui masquait la divergence (à simplifier EN DERNIER) :
- `RelationPolicy.resolvePresentationToken:99` — lit `fks[base]` PUIS scanne les clés `base_id`.
- `RelationPolicy.hasRelationValue:71` — même décomposition `_`.

**Cible du kill** : `MachineFkDef.multiple` (`src/lib/types/machine-model.ts:56`, `required boolean`).
**NE PAS toucher** : `multiple` type-de-champ upload/multiselect (`machine-model.ts:46,198`).

---

## 2. Phases (ordre imposé)

Contrainte : le read tolérant reste jusqu'à writes convergés + données migrées. On simplifie le read en dernier.

### Phase 0 — Filet
- [x] Purger/réécrire tests flaky `DataRelations` — vérifié 2026-07-06 : 14/14 verts, rien à purger (note "flaky" obsolète, déjà réparé avant ce chantier).
- [x] Fixer oracle : `fkFolder.test.ts` réécrit sur shape cible `fks[collection]` single-only pour le FK `agency` (rouge confirmé 4/9 avant Phase 1, vert après). `machineFkFeed.test.ts` était déjà single-only conforme.

### Phase 1 — Master qoolie : un seul fold  *(chemin critique)* — ✅ FAIT 2026-07-06
- [x] Primitive extraite vers **qoolie** : `packages/qoolie/src/lib/fk/foldFk.ts` `foldFk(fkDefs, record, resolver, indexField?) → { data, errors }`. Single → `fks[name]` ; multiple (legacy, dying) → `fks[name_id]`. Générique, aucun vocabulaire idae. Oracle propre `foldFk.test.ts` (9/9).
- [x] `RelationPolicy.foldRelations` (`src/lib/idae/relations/RelationPolicy.ts`), `MachineFkFold.foldFksIntoRecord` (`src/lib/main/machine/MachineFkFold.ts`) et `FkFolder.foldFks` (`server/src/validation/FkFolder.ts`) sont maintenant de purs appelants de `foldFk`. Zéro logique dupliquée → divergence impossible par construction.
- [x] `server/package.json` gagne la dépendance `@medyll/qoolie: workspace:*` (n'existait pas) ; `qoolie` rebuild (`npx tsc`) pour que le serveur (consommateur du `dist` compilé) voie l'export.
- [x] Piège dual-bus évité côté client : export consommé via l'alias vite→src déjà en place (`project_qoolie_dual_bus_alias`), aucun nouveau bus créé.
- [x] Suites vertes après convergence : qoolie 217+9, idae-machine client/main 770/770 (74 fichiers), server 307/307.

### Phase 2 — Mort de FK-multiple — ✅ FAIT 2026-07-06
- [x] `MachineFkDef.multiple` supprimé du type (`src/lib/types/machine-model.ts`) ; `DiagramEdge.multiple` supprimé aussi (même mort, `diagramUtils.ts` ne le peuple plus).
- [x] Recensement réel (pas 21 fichiers — un seul avait du vrai contenu) : `multiple:true` trouvé dans 4 endroits, tous en dehors du bundle 21-orgs (qui n'en a jamais eu) :
  - `ai_chat_session.tag` — vrai N-N → **junction `ai_chat_session_has_tag`** créée (client `ai-chat-session.ts` + serveur `idae-model-core.ts`).
  - `ai_message.ai_tool_call` — redondant (reverse de `ai_tool_call.ai_message` déjà single) → **supprimé**, RFK suffit.
  - `ai_companion.ai_skill` / `ai_hook` — ciblent des collections inexistantes (feature jamais construite) → **supprimés**.
  - Décisions validées par l'utilisateur (AskUserQuestion) avant exécution — aucune décidée seule par l'IA.
- [x] `FkValidator.validateFkEntries` (server) réécrit : n'exige plus le suffixe `_id`, rejette désormais les clés suffixées (`agency_3`) comme legacy — **le garde-fou "clé fks[field_id] interdite" est déjà en place**, en avance sur le planning §3.
- [x] Sweep mécanique : ~640 occurrences `multiple: false` supprimées des literals `fkRelations` (schemas client `ai/schema/*`, 21 scheme files serveur, fixtures, tests) — propriété qui n'existe plus dans le type, retrait pur sans changement sémantique.
- [x] `FkRef` (appscheme meta snapshot, `server/src/idae/field-defs.ts`) avait sa PROPRE copie dormante de `multiple` (toujours `false`, jamais lue) → supprimée aussi (`buildFkRef`, `embedFk` call-sites, `publishModel.ts`, `MachineServer.ts`, `idaeModel.ts`).
- [x] Suites vertes : server 305/305, client/main 770/770 (74 fichiers), qoolie 226. `tsc -p tsconfig.typecheck.json` (server) et `svelte-check` (client) : 0 erreur.
- [x] Recensement FK `multiple:true` dans les 21 scheme files serveur : **zéro** — le bundle 21-orgs (agile/boutique/blogcms/factory/comix/crfr/tactac/latent/demo/hotelo/school/iot/jobber/flix/hippo/restau/idaenext/master/ledger/medbook) n'en déclarait aucun ; seule la surface AI (ai_chat_session/ai_message/ai_companion) en avait. Rien à porter en Phase 3.

### Phase 3 — Migration N-N → jonction
- [x] Le seul vrai N-N (`ai_chat_session.tag`) est déjà migré vers `ai_chat_session_has_tag` (fait en Phase 2, zéro donnée live à migrer — pas de script `migrate-legacy.ts` nécessaire).
- [ ] Garde-fou permanent : validateur SCHÉMA (pas seulement write-payload) rejette toute déclaration `fkRelations` non-single — à écrire si une régression réapparaît (aucun schéma actuel n'en a besoin, le type ne permet plus `multiple` de toute façon).

### Phase 4 — Simplifier le read (le paiement) — ✅ FAIT 2026-07-06
- [x] `resolvePresentationToken` (`RelationPolicy.ts`) : scan `base_id` supprimé, lecture directe `bagObj[base]`.
- [x] `hasRelationValue` : boucle de décomposition `_` retirée, ne reste que le nested-object check + fallback flat scalar.
- [x] 3 tests oracle qui figeaient l'ancien comportement tolérant réécrits sur la loi single-only (rouge confirmé avant fix) : `presentationFkSuffix.test.ts` (renommé conceptuellement — suffixe legacy explicitement NON résolu), `machineSchemeValidate.test.ts` (`fks.category_42` legacy → invalide désormais, la loi c'est `fks.category`).
- [x] Suites vertes : client/main 769/769 (74 fichiers), server 305/305, `svelte-check` 0 erreur.
- [ ] `dataRelationUtils.ts` (`parseFkKey`/`extractFkRefs`, lecture pour `DataListFk`/`DataListRfk`) garde encore le scan `_id` tolérant — **hors scope Phase 4** (pas listé initialement, composant différent de RelationPolicy) ; mort en pratique (plus aucun fold ne produit ce shape) mais laissé pour ne pas élargir le chantier sans décision explicite.

### Phase 5 — Staleness — ✅ FAIT 2026-07-06
- [x] Nouveau module `server/src/validation/FkStaleness.ts` : `refoldReverseFkSnapshots(targetCollection, updatedRecord)` — cible modifiée → chaque porteur (`findReverseFkHolders`) voit son `fks.<fkName>` réécrit avec un snapshot frais (depth-1, `_id`/`fks` imbriqués strippés), matché sur `fks.<fkName>.id === targetId`. `nullifyReverseFkSnapshots(targetCollection, deletedId)` — cible supprimée → `fks.<fkName>` unset chez les porteurs.
- [x] Bug latent découvert et corrigé en passant : le hook `post:delete` existant (`builtins.ts`) faisait DÉJÀ un nullify, mais matchait `fks.${fkName}_${id}` (clé suffixée) — cassé silencieusement depuis Phase 1/2 (le fold n'écrit plus jamais ce shape). Remplacé par l'appel à `nullifyReverseFkSnapshots` (clé bare `fks.<fkName>`, match sur `.id`).
- [x] Nouveau hook `post:update` (priority 95, non-bloquant) appelle `refoldReverseFkSnapshots(ctx.collection, ctx.data)` — `ctx.data` post:update = le document Mongo complet post-write (`DataService.updateById`), donc snapshot exact disponible sans requête supplémentaire.
- [x] Oracle `server/src/__tests__/fkStaleness.test.ts` (5/5) : refold ciblé, non-refold des porteurs non concernés, strip `_id`/`fks` imbriqués, no-op si aucun porteur, nullify au delete. Mongo réel (mongodb-memory-server), `machineServer`/`dbRouter` mockés pour isoler la logique de cascade.
- [x] Suites vertes : server 33 fichiers / 310 tests, `tsc -p tsconfig.typecheck.json` 0 erreur.
- Portée volontairement non couverte : cascade côté client (IndexedDB qoolie) — le staleness ne s'applique qu'au serveur (source de vérité Mongo) ; un client offline verra le snapshot périmé jusqu'au prochain sync/refetch, cohérent avec le modèle SWR existant.

### Reliquat Phase 4 traité — ✅ FAIT 2026-07-09
- [x] `dataRelationUtils.ts` : `parseFkKey`/`extractFkRefs` + branche `nestedRefs` de `resolveForwardRelations` (scan `fks.<key>_<id>`) supprimés — mort en pratique, plus aucun fold ne produit ce shape.
- [x] `data-utils.ts` : `fkObjectLabel` simplifié — lit `fks.<key>` bare uniquement, plus de boucle de décomposition `_`.
- [x] Tests figeant l'ancien comportement réécrits (rouge confirmé avant fix) : `machineRelationHelpers.test.ts` (3 tests dead-shape → 1 test single-shape), `dataGroupFk.test.ts` (3 tests suffix → 1 test "legacy suffix now ignored").
- [x] Suites vertes : client/main 74 fichiers / 764 tests, `svelte-check` 0 erreur.

---

## 3. Garde-fous transverses
- [ ] Lint anti-régression (wiré `gate`) : FK-multiple interdit + clé `fks[field_id]` interdite.
- [ ] Doc : SCHEMA-CONVENTIONS.md gagne la loi ; invariant FK de CLAUDE.md mis à jour.

---

## 4. Suivi

| Phase | Statut | Note |
|-------|--------|------|
| 0 | ✅ fait 2026-07-06 | rien à purger, oracle réécrit + rouge confirmé avant fix |
| 1 | ✅ fait 2026-07-06 | `foldFk` unique dans qoolie, 3 appelants convergés, tout vert (1303 tests) |
| 2 | ✅ fait 2026-07-06 | type + FkRef + FkValidator nettoyés ; 4 usages réels traités (junction/suppression) ; 0 erreur tsc/svelte-check |
| 3 | ✅ fait 2026-07-06 (scope réel) | seul vrai N-N déjà migré en Phase 2 ; garde-fou schéma-level reporté (pas nécessaire, type l'empêche déjà) |
| 4 | ✅ fait 2026-07-06 | RelationPolicy simplifiée ; `dataRelationUtils.ts` laissé tel quel (hors scope, mort en pratique) |
| 5 | ✅ fait 2026-07-06 | `FkStaleness.ts` + hooks post:update/post:delete ; bug latent (nullify cassé depuis Phase 1) corrigé au passage |
