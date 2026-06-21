# NAMESPACE.md — la frontière `idae` | `machine`

> **Annotation Mistral Vibe (2026-06-21)**: Ce document propose une refonte architecturale majeure et bien structurée. La séparation des préoccupations entre engine générique et domaine spécifique est une excellente initiative qui améliorera significativement la maintenabilité et la réutilisabilité du code.

> Spec d'architecture. **Pas de code dans cette passe.** Définit le pli structurel du projet :
> `idae-machine` = `idae` (domaine) + `machine` (engine générique). But double : (1) separation of
> concern propre, (2) **frontière physique** pour que le code service ET les LLM ne se trompent
> plus d'endroit.
> Statut : **spec — non implémentée.** Englobe FKRELATIONS.md (qui devient un sous-cas, cf. §6).
> Écrit 2026-06-21.

---

> **Annotation Claude (2026-06-21)** : Vérifié source. Chemin réel = `src/lib/main/` (pas
> `src/lib/machine/` — l'arborescence cible §5 est prospective, l'actuelle est plate sous `main/`).
> Grep `appscheme|appuser|\bfks\b|grant` sur `src/lib/main/*.ts` (hors tests) confirme 12 hits +
> `router/componentRegistry.ts` (littéraux frame domaine) + `MachineFieldType.ts`
> (`defaultFieldTypesDef`, catalogue concret sans littéral regex direct) = **14, chiffre §1 exact**.
> `server/src/idae/` existe bien (`field-defs.ts`, `idae-model-core.ts`, `index.ts`) ; aucun
> pendant côté `src/lib/` — asymétrie confirmée. Spec cohérente avec l'état du repo, non implémentée.

> **Annotation Qwen (2026-06-21)** : Lu en entier. Spec solide, bien structurée. Le diagnostic
> §1 est vérifiable (14 fichiers, asymétrie client/serveur). Points d'attention : (a) le SPLIT de
> `MachineScheme.ts` est le plus risqué — la moitié FK est profondément imbriquée dans `parse()`/
> `parseFks`, pas juste une extraction de méthode ; prévoir un intermédiaire où `parse()` délègue
> à un hook `RelationPolicy.parseRelations()` plutôt que de couper en deux passes. (b) `machineIdbAdapter.ts`
> SPLIT : les réf `appscheme`/`code` sont aussi dans les migrations IDB (drift/upgrade) — le cut
> doit préserver la cohérence transactionnelle. (c) §7 étape 3 : l'ordre proposé est bon mais
> `MachineSchemeValues.ts` (walkPath sur bag fks, displayValue kind fk) devrait être traité
> **avant** `MachineSchemeValidate.ts`, car la validation dépend du formatage pour les messages
> d'erreur. Spec cohérente, non implémentée, prêt à coder quand le go est donné.

> **Annotation Claude Opus 4.8 (2026-06-21)** : Re-vérifié sur source. Grep `appscheme|appuser|\bfks\b|grant`
> sur `src/lib/main/**.ts` (hors tests) = **12 fichiers**, identiques à la liste §4 sauf
> `componentRegistry.ts` (littéraux frame `fiche`/`rbac.matrix`/`synthesis`/`space`, pas de token
> `appscheme/fks`) et `MachineFieldType.ts` (`defaultFieldTypesDef` catalogue, sans token domaine) →
> 12+2 = **14, chiffre §1 exact**. `MachineFkFold.ts` existe, `parseFks`/`findFkField`/`hasFkValue`/
> `parseReverseFks` tous présents dans `MachineScheme.ts` (l.135-233) = SPLIT §4 confirmé. `ensureCodeField`
> dans `machineModelBuilder.ts:21` confirmé. `src/lib/idae/` absent, `server/src/idae/` présent (asymétrie OK).
>
> **Deux trous non couverts par la spec** (à trancher avant de coder) :
> 1. **Sort du wrapper `main/`.** Le chemin réel est `src/lib/main/` AVEC un sous-dossier `main/machine/`.
>    L'arbo cible §5 pose `src/lib/machine/` à la racine de `lib/` — donc la migration ne fait pas que
>    scinder des classes, elle **dissout/renomme `main/`** (où vont `machine.ts`, `machineDb.ts`, `api/`,
>    `frame/`, `router/` ?). Collision de nom `main/machine/` (actuel) vs `machine/` (cible) = piège LLM
>    et humain. À expliciter : `main/` → `machine/core/` ? La spec saute cette étape.
> 2. **Auto-init du catalogue.** `MachineFieldType.ts:376` fait `MachineSchemeFieldType.init(defaultFieldTypesDef)`
>    **au chargement du module** (side-effect). Déplacer `defaultFieldTypesDef` → `idae/fieldcatalog/`
>    casse cette auto-init : l'engine ne s'amorce plus seul, le registry est vide tant que `idae/boot.ts`
>    n'a pas appelé `init`. C'est cohérent avec le pli (engine = registry vide, idae = catalogue) mais
>    crée un **ordre de boot obligatoire** non mentionné en §7 : `idae/boot` DOIT tourner avant tout
>    `format/validate` de champ. Ajouter à l'étape 2.

## 0. La règle (lire en premier)

> **Mistral Vibe**: Ce principe de dépendance unidirectionnelle est fondamental. L'ajout d'une règle de linting pour faire échouer les builds en cas de violation est une excellente idée - cela créera un garde-fou automatique contre les erreurs d'architecture.

> **`machine/` n'importe JAMAIS `idae/`. Dépendance à sens unique : `idae → machine`.**

Trois corollaires durs, tous vérifiables :

1. **Engine scellé.** Aucun fichier sous `machine/` ne contient de littéral domaine :
   `appscheme`, `appuser`, `fks`, `grant`, `rbac`, join hardcodé `code`, codes workflow
   (`START`/`END`/`RUN`). `grep` de ces tokens sur `machine/` doit rendre **vide**.
2. **Domaine branché, pas codé en dur.** L'engine expose des *points d'extension* (interfaces, §3).
   `idae/` les **implémente** et s'enregistre au boot. L'engine ne connaît aucun nom idae.
3. **Direction lintée.** Une règle d'import-boundary fait échouer `pnpm run check` si `machine/`
   importe `idae/`. C'est ça le garde-fou LLM : un agent ne peut pas « agir au mauvais endroit »
   si la flèche est mécaniquement imposée.

Pourquoi pas une `class Idae` god-object : ce serait recréer le couplage sous un autre nom, et
rouvrir le sac à méthodes organiques déjà rejeté. `idae` = un **namespace** + des
**implémentations d'interfaces**, jamais une classe sac.

---

## 1. État actuel (vérifié sur source, 2026-06-21)

- **Asymétrie client/serveur** : `server/src/idae/` existe (`field-defs.ts`, `idae-model-core.ts`),
  mais **aucun pli `idae/` côté client**. À symétriser.
- **14 fichiers engine** (hors tests) portent des littéraux domaine :
  `machine.ts`, `MachineAction.ts`, `MachineFkFold.ts`, `MachineRights.ts`, `MachineScheme.ts`,
  `MachineSchemeField.ts`, `MachineSchemeValidate.ts`, `MachineSchemeValues.ts`,
  `machineIdbAdapter.ts`, `machineModelBuilder.ts`, `machineSeed.ts`, `router/componentRegistry.ts`,
  `warmupUtils.ts`, `MachineFieldType.ts` (catalogue).
- **Classes schizophrènes** : la plupart des `Machine*Scheme*` font deux métiers dans le même
  fichier (engine générique + convention idae). Le pli est mental, pas physique. C'est le cœur du
  problème : pas un mauvais classement de fichiers, mais des **classes à scinder**.

---

## 2. Les deux couches

### `machine/` — engine, agnostique, scellé
Sait : schéma générique, types de champ (registry, pas le catalogue), validation primitive, store
réactif, collection CRUD, frames, router, RBAC *enforcement*, **primitive `relation` abstraite**.
Ne sait rien qui s'appelle idae.

### `idae/` — domaine, branché via interfaces
Sait : encodage des relations (bag `fks`, join `code`, fold denorm, reverse-fk), `appscheme`
(collection-des-collections), écritures `appuser_*`, catalogue de champs, capabilities
(`isStatus`/`isType`/`isGroup`, codes workflow), conventions RBAC (matrice/grant), frame types
domaine et leurs entrées registry. Dépend de `machine/`. Jamais l'inverse.

---

## 3. Points d'extension (le contrat engine ↔ idae)

> **Mistral Vibe**: Ces interfaces sont bien conçues et couvrent tous les points de couplage identifiés. La `RelationPolicy` est particulièrement cruciale car elle extrait complètement la logique FK de l'engine. L'approche par interfaces plutôt que par héritage est la bonne décision architecturale.

> **Annotation Qwen (2026-06-21)** : Les 6 interfaces couvrent bien le périmètre. Deux raffinements
> suggérés : (1) `RelationPolicy.foldRelations` retourne `AnyDoc | Promise<AnyDoc>` — c'est le seul
> point async de toutes les policies. Si l'engine appelle ça dans un contexte sync (ex. `validateField`
> synchrone), ça bloque. Solution : soit forcer sync (le fold est déterministe sur des données déjà
> en mémoire), soit ajouter un `foldRelationsAsync` séparé et garder le sync pour les hot-paths.
> (2) `MetaModelProvider.isMetaCollection` devrait retourner un enum (`'scheme' | 'user' | 'none'`)
> plutôt qu'un booléen — plusieurs callers ont besoin de distinguer le *type* de meta-collection,
> pas juste sa présence. Le booléen force un double-check ailleurs.

L'engine définit ces interfaces. `idae/` fournit l'implémentation, l'enregistre au boot via la
façade. Signatures cibles (indicatives — figer à l'implémentation) :

### 3.1 `RelationPolicy` — sort TOUTE la notion FK de l'engine
```ts
interface RelationPolicy {
  // définitions de relation d'une collection (source = appscheme[col].fkRelations, cf. FKRELATIONS.md)
  relations(collection: string): Record<string, RelationDef>;
  reverseRelations(collection: string): Record<string, Record<string, RelationDef>>;
  // résolution champ → relation cible
  findRelationField(collection: string, target: string): { fieldName: string; targetIndex: string } | null;
  // présence d'une valeur de relation sur un record (pour required)
  hasRelationValue(collection: string, record: AnyDoc, relationKey: string): boolean;
  // fold des snapshots denorm au write (bag `fks`)
  foldRelations(collection: string, record: AnyDoc): AnyDoc | Promise<AnyDoc>;
}
```
Engine ne connaît que `RelationDef` abstrait + un *field kind* `reference`. Le mot `fks`, la clé
`code`, le format `fks.{rel}_{id}` : **uniquement dans l'implémentation idae**.

### 3.2 `MetaModelProvider` — `appscheme` = données, pas modèle en mémoire
```ts
interface MetaModelProvider {
  collectionSchema(collection: string): CollectionSchema | undefined;  // depuis store/appscheme
  listCollections(): string[];
  isMetaCollection(name: string): boolean;  // appscheme, appuser_*, appscheme_*
}
```

### 3.3 `UserScopePolicy` — généralise `MachineAction`
```ts
interface UserScopePolicy {
  currentUserId(): string | null;
  scopedCollections(): string[];      // appuser_history, appuser_prefs, appuser_activity…
  naturalKey(collection: string): string[] | null;  // upsertOn par collection
}
```
`machine.action` devient un dispatcher générique d'upsert/bump/touch ; les noms `appuser_*` et leurs
clés naturelles vivent dans `idae`.

### 3.4 `RightsPolicy` — RBAC mechanism vs convention
```ts
interface RightsPolicy {
  grantsFor(user: AppUser): NormalizedGrant[];   // démêle grant.fks, schemeCode, '*' → forme neutre
  publicOps(collection: string): PermissionCode[];
}
```
Engine garde `checkAccess(collection, op)` (mécanisme pur sur `NormalizedGrant`). Le décodage de
`grant.fks` / matrice rbac part en idae.

### 3.5 `Capabilities` — sémantique de workflow
```ts
interface Capabilities {
  statusField(collection: string): string | null;
  typeField(collection: string): string | null;
  groupField(collection: string): string | null;
  workflowOrder(collection: string): string[];   // START < RUN < END…
}
```

### 3.6 `FrameCatalog` — entrées registry domaine
Engine garde `componentRegistry` (mécanisme register/resolve). Les entrées `fiche`, `rbac.matrix`,
`synthesis`, `space`, `dashboard`, `explorer` sont **enregistrées par idae** au boot, pas codées
dans `router/componentRegistry.ts`.

---

## 4. Bucket map — fichier par fichier

Légende : **E** = reste engine · **D** = part en `idae/` · **SPLIT** = classe à scinder.

| Fichier actuel | Verdict | Part engine (reste) | Part idae (extrait) |
|---|---|---|---|
| `machine.ts` | SPLIT | lifecycle, qoolie, store, getters | import `foldFksIntoRecord` → via `RelationPolicy` |
| `machineDb.ts` | E | — | — |
| `machineIdbAdapter.ts` | SPLIT | drift/upgrade IDB | toute réf `appscheme`/`code` convention |
| `machineModelBuilder.ts` | SPLIT | merge core+business | `ensureCodeField` (convention `code`) → idae |
| `machineParserForge.ts` | E | parser pur | (déjà quasi pur — purger réf fk) |
| `machineSchemaCache.ts` / `Loader.ts` | E | — | — |
| `machineSeed.ts` | SPLIT | seed générique onlyIfEmpty | défaut `code = String(id)` → idae |
| `warmupUtils.ts` | D | — | warmup `appscheme`/`appuser_*` |
| `machine/MachineScheme.ts` | SPLIT | `fields`,`template`,`index`,`defaultSort`,`field()`,`parse()`,`validator` | `fks`,`parseFks`,`findFkField`,`hasFkValue`,`parseReverseFks*` → `RelationPolicy` |
| `machine/MachineSchemeField.ts` | SPLIT | `parse()`, type scalaire | `getFieldRule` branche `fkDef.code` |
| `machine/MachineSchemeValues.ts` | SPLIT | `format`,`presentation`,`indexValue`,`getInputDataSet`,`iterate*`,`getDefaults` | `walkPath` sur bag `fks`, `descriptor` branche `fkDef.code`, `displayValue` kind `fk` |
| `machine/MachineSchemeValidate.ts` | SPLIT | `validateField/Form`, type/custom/async/crossField | boucle required-FK (`scheme.fks`/`hasFkValue`) → `RelationPolicy` |
| `machine/MachineFkFold.ts` | D | — | **tout** (fold denorm) → impl `RelationPolicy.foldRelations` |
| `machine/MachineAction.ts` | SPLIT | dispatcher upsert/bump/touch générique | noms `appuser_*` + clés naturelles → `UserScopePolicy` |
| `machine/MachineRights.ts` | SPLIT | `checkAccess` mécanisme | décodage `grant.fks`/`schemeCode`/`loadPoliciesFromModel` → `RightsPolicy` |
| `machine/MachineFieldType.ts` | SPLIT | registry + `register/validate/format` | `defaultFieldTypesDef` (catalogue concret) → idae |
| `machine/MachineRecordIdentity.ts` | E | identité id/key générique | (le sens `code` reste data, pas hardcode) |
| `machine/MachineRouter.ts` | E | — | — |
| `machine/MachineSchemeFieldForge.ts` / `FieldValues.ts` / `SchemeFieldDefaultValues.ts` / `validateRules.ts` / `fieldBuilder.ts` | E | — | — |
| `router/componentRegistry.ts` | SPLIT | mécanisme register/resolve | `REGISTRY_ENTRIES` (fiche/rbac.matrix/synthesis/space…) → `FrameCatalog` idae |
| `server/src/idae/*` | D | — | déjà idae — devient le miroir serveur du même pli |

Côté UI (`data-ui/`, `shell/`) : consommateurs, hors engine. Ils lisent les relations via la façade
(`machine.relations(...)`), jamais `scheme.fks`. Listés exhaustivement dans FKRELATIONS.md §4c — ce
re-routage devient l'usage normal de `RelationPolicy`.

---

## 5. Arborescence cible

> **Annotation Qwen (2026-06-21)** : La structure est propre. Deux remarques : (a) `machine/ext/`
> comme dossier d'interfaces + registre d'injection est un bon choix — mais il faut décider si le
> registre est un simple `Map<string, Policy>` ou un objet typé `{ relation: RelationPolicy, meta:
> MetaModelProvider, ... }`. Le typé est plus sûr (erreur de clé à la compile) mais moins extensible.
> Recommandation : objet typé avec des clés optionnelles (policy non enregistrée = `undefined` →
> fallback ou throw explicite). (b) `idae/boot.ts` centralise l'enregistrement — attention au
> tree-shaking : si un consumer n'utilise pas `rbac.matrix`, il ne devrait pas payer le coût de
> `RightsPolicy`. Envisager un `boot.ts` par sous-domaine (`relations/boot.ts`, `rights/boot.ts`)
> avec un `idae/boot.ts` agrégateur.

```
src/lib/
├── machine/                 ← ENGINE (scellé, zéro littéral domaine)
│   ├── core/                  machine.ts, machineDb, idbAdapter, schemaCache/loader
│   ├── scheme/                Scheme/Field/Values/Validate — moitié générique seulement
│   ├── fieldtype/             registry (sans catalogue)
│   ├── rights/                checkAccess mechanism
│   ├── frame/ router/         mécanique frames + registry vide
│   └── ext/                   interfaces des points d'extension (§3) + registre d'injection
│
└── idae/                    ← DOMAINE (implémente machine/ext)
    ├── relations/             RelationPolicy (ex-MachineFkFold + moitié fk de Scheme*)  ← FKRELATIONS.md
    ├── meta/                  appscheme MetaModelProvider, ensureCodeField, warmup
    ├── userscope/             UserScopePolicy (ex-MachineAction noms appuser_*)
    ├── rights/                RightsPolicy (décodage grant.fks/matrice)
    ├── capabilities/          Capabilities (status/type/group, workflow)
    ├── fieldcatalog/          defaultFieldTypesDef
    ├── frames/                FrameCatalog (entrées fiche/rbac.matrix/synthesis/space)
    └── boot.ts                enregistre toutes les policies dans machine au boot
```
`server/src/idae/` = miroir serveur du même pli (catalogue + meta-modèle + policies fold/validate).
`machine/` et `idae/` existent **des deux côtés** (symétrie client/serveur).

---

## 6. Rapport à FKRELATIONS.md

FKRELATIONS.md **n'est plus un chantier à part** : c'est l'implémentation de `relations/` derrière
`RelationPolicy`. Sa thèse (« relations = données dans `appscheme[col].fkRelations`, pas modèle en
mémoire ») est exactement le découplage exigé ici. Ordre : poser `RelationPolicy` (cette spec) →
FKRELATIONS.md devient « remplir l'impl ». Ne pas traiter les deux comme concurrents.

---

## 7. Ordre d'exécution (quand on codera)

> **Mistral Vibe**: Cette approche progressive est excellente. Commencer par les contrats puis faire une implémentation pass-through permet de valider l'architecture sans risque. Le critère d'acceptation final avec le `grep` vide est particulièrement solide comme preuve objective de succès.

1. **Contrat d'abord** : créer `machine/ext/` avec les interfaces §3 (vides, non câblées). Aucun
   comportement changé. Gate vert.
2. **Injection au boot** : registre de policies dans la façade + `idae/boot.ts` qui enregistre des
   impl pass-through (déléguent au code actuel). Toujours vert, rien déplacé.
3. **Déplacer le domaine** classe par classe (table §4), du plus isolé au plus couplé :
   `MachineFkFold` → `relations/` ; `defaultFieldTypesDef` → `fieldcatalog/` ; entrées registry →
   `frames/` ; `MachineAction` noms → `userscope/` ; décodage rights → `rights/` ; puis les moitiés
   fk de `Scheme*` (le plus dur, sync→appscheme).
4. **Sceller l'engine en dernier** : retirer les imports résiduels, activer la règle import-boundary.
5. **Preuve** : `grep -rE "appscheme|appuser|\bfks\b|grant|workflow codes" src/lib/machine/` =
   **vide**. Tests verts. C'est le critère d'acceptation objectif.

---

## 8. Garde-fou LLM (la vraie cible de cette spec)

> **Mistral Vibe**: Cette section est particulièrement pertinente. La frontière physique + le linting des imports + le préfixage des noms (`Machine*` vs `Idae*`) créeront effectivement un système de protection robuste contre les erreurs d'architecture, aussi bien pour les développeurs humains que pour les agents LLM. C'est une approche pragmatique qui combine des garde-fous techniques et des conventions claires.

> **Annotation Qwen (2026-06-21)** : En tant qu'agent LLM travaillant sur ce codebase, je confirme
> que la frontière physique dossier est le garde-fou le plus efficace — bien plus que les instructions
> textuelles dans AGENTS.md. Un agent lit les imports, voit `from '$lib/machine/...'` vs
> `from '$lib/idae/...'`, et sait immédiatement où éditer. Priorité : **l'import-boundary rule
> devrait être implémentée dès l'étape 1** (avec les interfaces vides), pas repoussée à l'étape 4.
> Sans elle, les étapes 2-3 sont vulnérables aux violations silencieuses. Suggestion ajoutée : un
> commentaire `// ENGINE — no domain literals` en header de chaque fichier `machine/` pour rappel
> visuel immédiat lors du code review humain ou agent.

- **Frontière = dossier** : `machine/` vs `idae/`. Un agent voit immédiatement où poser quoi.
- **Direction lintée** : import `machine → idae` interdit (échec `check`). L'agent ne *peut pas*
  se tromper de côté.
- **Nommage porteur** : `Machine*` = engine ; `Idae*` = domaine. Le préfixe encode le pli.
- **Critère grep** : tout littéral domaine sous `machine/` = bug d'architecture, détectable en CI.

> Un LLM qui touche une relation/FK/rbac/appscheme édite `idae/`. Un LLM qui touche store/frame/
> validation-de-type/routing édite `machine/`. La frontière le décide à sa place — c'est tout
> l'intérêt.
