# SOLIDIFICATION — idae-machine
> Audit complet du 2026-05-27. Généré par enquête statique sur src/lib/main, src/lib/data-ui, src/lib/shell, src/lib/types, __tests__.  
> Ne pas modifier manuellement — mettre à jour au fil des sprints.

---

## Vue système

```
machine.ts (singleton)
  ├── fetchSchema()      ← CRITIQUE: ignore l'URL, doublon avec machineSchemaLoader.ts
  ├── createInstance()   ← WARN: boot() non-awaited
  ├── framer             ← OK
  └── @deprecated: frameManager / loadFrame / start / idbql / collections getter

data-ui/
  ├── DataList           ← $effect sans untrack (mineur)
  ├── DataFk / DataRfk   ← props déclarées jamais utilisées (collectionId, where)
  └── FieldDisplay       ← props mortes (collectionId, editInPlace)

types/
  ├── machine-model.ts   ← types dead + duplication avec schema-types.ts
  └── engineModel.ts     ← cast `any` inutile sur rights

tests/
  ├── ~30 fichiers source sans test
  └── machineLoadFrame.test.ts → API deprecated `frameManager` encore testée
```

---

## 🔴 CRITIQUE

### C1 — `machine.ts:322-325` — `fetchSchema()` ignore son argument
`fetchSchema(_url)` reçoit une URL mais ne l'utilise jamais. Appelle uniquement `boot()` et retourne un `EventTarget` vide.
La JSDoc promet un fetch distant — l'implémentation ne le fait pas.
**Impact :** appelants qui passent une URL croient déclencher un chargement distant. Rien ne se passe.
> **[Opus 4.7]** Confirmé. Pire: JSDoc dit `@deprecated Schema fetch is internal to boot()` — la méthode N'EST PAS censée fetch quoi que ce soit, c'est un shim de compat. L'`EventTarget` vide retourné rompt aussi le contrat ancien (jamais d'event `'schema:updated'` émis). Soit retirer la méthode, soit câbler `loadSchema(url, ...)` dedans + propager son emitter.
> **[Kimi 5]** Confirmé. Le paramètre `_url` est effectivement ignoré (ligne 322). L'`EventTarget` retourné est vide et n'émet jamais d'événement. Le shim de compatibilité est trompeur pour les appelants.

### C2 — `machine.ts` vs `machineSchemaLoader.ts` — deux chemins concurrents pour fetch+cache+boot
`machine.ts` (méthodes `_revalidateSchema`, `writeSchemaCache`, `boot`) et `machineSchemaLoader.ts` (`loadSchema`) couvrent la même responsabilité avec des comportements différents.
`loadSchema()` dans `machineSchemaLoader.ts` n'est jamais référencé hors de sa propre déclaration.
**Impact :** divergence de comportement selon le chemin emprunté, dead code, confusion de maintenance.
> **[Opus 4.7]** Confirmé via grep (`loadSchema` seul hit hors déclaration = `bmad/intake-sources/ARCH-SOURCE.md` doc + `sprint-s34-planned.md`). Note: `_revalidateSchema` (machine.ts:300+) duplique en interne la logique SWR de `loadSchema` — mêmes `JSON.stringify` compare + `writeSchemaCache` + reload. Décision claire à prendre: ce fichier est un vestige du sprint S34 jamais branché. À supprimer SAUF si on refactor `_revalidateSchema` pour le consommer (préférable — sortir le SWR de la classe Machine).
> **[Kimi 5]** Confirmé. `loadSchema` dans `machineSchemaLoader.ts` n'a aucune occurrence d'importation dans `src/` (grep vide). `_revalidateSchema` (machine.ts:292-313) reproduit fidèlement la logique SWR (fetch → JSON.stringify compare → writeSchemaCache → rebuild model). Le fichier `machineSchemaLoader.ts` est bien un vestige non branché.

### C3 — `machine-model.ts:78-98` vs `schema-types.ts:947-961` — types `FieldViews`/`ViewFieldDef` dupliqués
Même nom, même rôle, définis dans deux modules distincts. Risque de désynchronisation silencieuse.
**Impact :** les consommateurs peuvent importer la mauvaise version sans erreur TypeScript visible.
> **[Opus 4.7]** Lignes fausses dans le rapport. Vraies déclarations:
> - `machine-model.ts:78-98` ✓
> - `schema-types.ts:1383-1406` (pas 947-961 — cette plage = `AppScheme` qui *utilise* `FieldViews`)
> - **TRIPLE duplication**: `src/lib/main/api/types.ts:4-28` redéfinit aussi `FieldViews` + `ViewFieldDef` (3ᵉ copie, non listée dans l'audit).
> Divergences: schema-types ajoute `[key: string]: ViewFieldDef[] | undefined` (extensible), machine-model non. api/types n'a pas `code`/`group`. Choisir une source canonique (proposition: `machine-model.ts` la plus restreinte) puis re-export depuis les 2 autres.
> **[Kimi 5]** Confirmé. Les trois copies existent bien et divergent effectivement:
> - `machine-model.ts:78-98` : `code?` et `group?` optionnels, pas d'index signature.
> - `schema-types.ts:1383-1407` : `code` et `group` requis, index signature `[key: string]`.
> - `api/types.ts:4-29` : `code?` et `group?` optionnels, index signature présente.
> Risque réel de désynchronisation. `machine-model.ts` est la source la plus importée (33 occurrences d'import de `machine-model.js` dans `src/`).

---

## 🟠 WARN

### W1 — `machine.ts:493-516` — `createInstance()` appelle `boot()` sans `await`
L'instance est retournée avant que `boot()` soit terminé. Tout code qui consomme l'instance immédiatement après `createInstance()` opère sur un état partiel.
> **[Opus 4.7]** Confirmé `void instance.boot()` à machine.ts:514. La signature de `createInstance` retourne `Machine` synchrone — la corriger en `async createInstance(...): Promise<Machine>` casse l'API. Alternative: ajouter une promesse `instance.ready: Promise<void>` exposée publiquement (pattern utilisé par d'autres libs IDB) — non-breaking et explicit.
> **[Kimi 5]** Confirmé. Ligne 514: `void instance.boot();` — l'instance est retournée immédiatement sans attente. Tout appel à `instance.collection(...)` ou `instance.sync` juste après `createInstance()` plantera si `boot()` n'est pas terminé. L'alternative `instance.ready` est la meilleure pour éviter un breaking change.

### W2 — `machine.ts`, `machineIdbAdapter.ts`, `machineSchemaCache.ts` — erreurs silencieuses systémiques
Patterns répétés :
- `.catch(() => {})` — erreur avalée sans log
- `catch { storedHash = null; }` — état corrompu silencieusement
- `catch { /* retry on next start */ }` — sans log ni compteur
- `catch { return null; }` — appelant ne peut pas distinguer "vide" de "erreur"
Lignes : `machine.ts:244-250,256-257,275-276` / `machineIdbAdapter.ts:40-55,147-148`.
> **[Kimi 5]** Confirmé et étendu. Le pattern est systémique:
> - `machine.ts:244` : `readSchemaCache(url).catch(() => null)` — échec de lecture du cache silencieux.
> - `machine.ts:250` : `_revalidateSchema(...).catch(() => {})` — échec de revalidation silencieux.
> - `machine.ts:256` : `writeSchemaCache(url, fresh).catch(() => {})` — échec d'écriture du cache silencieux.
> - `machine.ts:275` : `getActualIdbVersion(...).catch(() => 0)` — version IDB inconnue fallback à 0 sans log.
> - `machineIdbAdapter.ts:40-41` : `catch { storedHash = null; }` — hash perdu sans raison visible.
> - `machineIdbAdapter.ts:46-47` : `catch { return null; }` — upgrade IDB annulé silencieusement.
> - `machineSchemaCache.ts:32-33` : `catch { return null; }` — cache inaccessible, retourne null sans log.
> - `machineSchemaCache.ts:41-42` : `req.onerror = () => resolve()` — suppression de DB échouée, on ignore.
> Ces silences rendent le debug en production très difficile (schema qui ne charge pas, IDB qui ne s'ouvre pas, etc.).

### W3 — `machineSchemaLoader.ts:22-49` — `loadSchema()` dead code
Jamais référencé hors de sa propre déclaration dans tout `src/`. De plus, le chemin cache-miss ne vérifie pas `res.ok` avant `res.json()` — erreurs HTTP transformées en exceptions non documentées.
> **[Kimi 5]** Confirmé. Grep sur `loadSchema` dans `src/` (hors `machineSchemaLoader.ts` lui-même) retourne 0 usage effectif. Le chemin `cache-miss` (ligne 42-43) fait `await fetch(url)` puis `await res.json()` sans vérifier `res.ok`. Une 404 ou 500 produira un JSON parse error non explicite.

### W4 — `machineParserForge.ts:19-27` — champ privé `#machineForge` jamais utilisé
Initialisé à `undefined`, jamais lu ni écrit ailleurs dans la classe.
> **[Opus 4.7]** Chemin probable erroné — chercher `src/lib/main/machine/machineParserForge.ts` n'a pas matché, mais grep trouve `src/lib/main/machineParserForge.ts:19,25-26` avec commentaire `// Correction : ne pas initialiser #machineForge récursivement`. Le champ est une cicatrice d'un refactor pour casser une boucle de constructeur — supprimable, mais vérifier d'abord qu'aucun mécanisme d'introspection (`Object.getOwnPropertyNames` ou similaire) ne le scrute.
> **[Kimi 5]** Confirmé. Fichier correct: `src/lib/main/machineParserForge.ts` (pas dans le sous-dossier `machine/`). Ligne 19: `#machineForge: MachineDb['machineForge'] | undefined;`, ligne 26: `this.#machineForge = undefined;`. Aucune lecture ni écriture ultérieure dans la classe (207 lignes). Le commentaire confirme qu'il s'agit d'une cicatrice de refactor. Supprimable sans risque si aucun code externe ne fait d'introspection dessus.

### W5 — `MachineSocket.ts:8-23` — `autoConnect?: boolean` déclaré, jamais lu
`connect()` est appelé systématiquement quelle que soit la valeur de `autoConnect`.
> **[Kimi 5]** Précision: `autoConnect` est bien lu, mais dans `machine.ts:288` (`if (this._socketOptions?.autoConnect) this.connectSocket()`), pas dans `MachineSocket.ts` lui-même. L'interface `MachineSocketOptions` le déclare, mais `createSocketClient()` ignore ce champ et appelle `client.connect()` inconditionnellement. Incohérence: si `autoConnect=false`, `MachineSocket.ts` connecte quand même, c'est `machine.ts` qui garde la main sur le flux. À aligner: soit retirer `autoConnect` de l'interface et le gérer uniquement au niveau `Machine`, soit le passer à `createSocketClient`.

### W6 — `MachineRights.ts:16-28` — `loadPoliciesFromModel()` et `setPolicies()` font la même chose
Deux entrées d'API publique pour la même opération. Risque de divergence future.
> **[Opus 4.7]** Inexact: signatures différentes. `setPolicies(policies: Record<string, MachineRightsPolicy>)` reçoit déjà-extrait, `loadPoliciesFromModel(model: MachineModel)` extrait depuis un MachineModel brut. Pas un dup d'API, c'est un constructeur + un extracteur. Vrai défaut: `loadPoliciesFromModel` réassigne `#policies` directement au lieu d'appeler `setPolicies(policies)` — fix mineur (1 ligne) pour garantir un seul point d'écriture.
> **[Kimi 5]** Confirmé. `loadPoliciesFromModel` (ligne 21-28) fait `this.#policies = policies` au lieu de `this.setPolicies(policies)`. Cela crée deux points d'écriture pour le même champ privé. Si de la validation ou du post-traitement est ajouté à `setPolicies` plus tard, `loadPoliciesFromModel` la contournera.

### W7 — `linkParser.ts:7-16` — cast sans validation
`action` est casté en `'loadFrame' | 'loadIn'` sans guard. N'importe quelle string avant `:` passe sans erreur.
> **[Opus 4.7]** Confirmé. Fix 2 lignes: `if (action !== 'loadFrame' && action !== 'loadIn') return null;` avant le return. Aligner aussi `ParsedLink.action` avec une const literal pour éviter le drift.
> **[Kimi 5]** Confirmé. Ligne 13: `const action = base.slice(0, colonIdx) as 'loadFrame' | 'loadIn';` — le cast masque n'importe quelle string. Ex: `"foo:bar"` produit `action = 'foo'` typé comme `'loadFrame' | 'loadIn'`. Le `if (!action || !module)` à la ligne 15 ne vérifie que la non-vacuité, pas la validité de la valeur.

### W8 — `machineSeed.ts:19-47` — `seed()` et `seedIfEmpty()` dupliquent le même algo
Seul le check `getAll()` diffère. La garde `if (!store)` est pratiquement inatteignable car `machine.collection()` lance déjà si la collection manque.
> **[Opus 4.7]** Confirmé. `machine.collection(name)` throw `'Collection "${name}" not found...'` (machine.ts:371) — donc le `try`-less appel à `machine.collection(collection)` jette AVANT que le `if (!store)` ne puisse s'exécuter. Le warn `[seed] collection not found — skipped` est mort. Refactor proposé: une seule fn `seed(data, { onlyIfEmpty?: boolean })`.
> **[Kimi 5]** Confirmé. Ligne 21-22 et 37-38: `const store = machine.collection(collection); if (!store)` — `machine.collection()` throw une `Error` à la ligne 371 si la collection n'existe pas. Le `if (!store)` est donc du code mort (unreachable). De plus, les deux fonctions partagent 90% de logique. Refactor impératif en une seule fonction avec option.

### W9 — `MachineSchemeValues.ts:42-98` — erreurs loguées + valeur neutre retournée
`presentation()` et `indexValue()` catchent tout, logguent via `MachineError.handleError()` et retournent `''`/`null`. L'appelant (UI) ne peut pas distinguer "valeur vide" de "erreur de calcul".
> **[Kimi 5]** Confirmé. `presentation()` (ligne 42-70) et `indexValue()` (ligne 84-99) utilisent un `try/catch` global qui appelle `MachineError.handleError(error)` puis retourne une valeur neutre (`''` ou `null`). `format()` (ligne 114-140) fait de même. L'UI affichera une chaîne vide sans savoir si c'est parce que le champ est vide ou parce que le template est invalide / l'accès est refusé.

### W10 — `DataFk.svelte:20-35` — props `collectionId`, `where` déclarées, jamais utilisées
Déclarées dans l'interface TypeScript, absentes du template et de toute logique interne.

### W11 — `DataRfk.svelte:24-34` — idem que W10

### W12 — `FieldDisplay.svelte:22-38` — props `collectionId`, `editInPlace` déclarées, jamais utilisées
`editInPlace` suggère une feature non implémentée ou supprimée sans nettoyage.
> **[Opus 4.7]** Confirmé — `collectionId` et `editInPlace` sont dans le type `$props()` mais ABSENTS de la destructuration (ligne 22-29). Le destructuring n'inclut que `collection, fieldName, data, mode, inputForm, showLabel`. TypeScript ne flag pas car les props non-destructurées sont juste ignorées. Risque concret: appelants passent `editInPlace={true}` croyant activer l'édition — silent no-op. Lien legacy: `editInPlace` = anciennement `app_field_update` PHP (cf CLAUDE.md §3). Soit l'implémenter, soit retirer du type.
> **[Kimi 5]** Confirmé. Le type `$props()` (ligne 29-38) déclare `collectionId?: unknown` et `editInPlace?: boolean`, mais le destructuring (ligne 22-28) les ignore complètement. C'est un bug latent: TypeScript accepte les props sans erreur, mais elles sont jetées silencieusement.

### W13 — `machine-model.ts:157-198` — types probablement dead
`TplFieldType`, `TplFieldArgs`, `TplFieldRulesObject`, `TplFieldRules`, `TplFields`, `Tpl`, `IdbqModel`, `IDbForge` — définis, aucune importation trouvée dans `src/`.
À vérifier : peuvent être utilisés par des consommateurs externes du package.
> **[Kimi 5]** **CORRECTION MAJEURE — ces types ne sont PAS dead.** Ils sont largement importés et utilisés dans `src/lib/main/`:
> - `IDbForge` : importé par `machineParserForge.ts`, `MachineSchemeFieldForge.ts`, `MachineSchemeField.ts`, `MachineSchemeValues.ts` (usage dans signatures de méthodes et types de retour).
> - `TplFieldRules`, `TplFieldType`, `TplFieldArgs`, `TplFields` : importés par `machineParserForge.ts`, `MachineSchemeFieldForge.ts`, `MachineSchemeField.ts`.
> - `TplCollectionName` : importé par ~10 fichiers.
> - `IdbqModel` : alias de `MachineModel`, utilisé dans `machine.ts` (JSDoc + paramètre `createInstance`) et dans `machineErrorPaths.test.ts`.
> - `Tpl` : alias de `MachineDisplayTemplate`, usage non vérifié dans `src/` (peut être dead).
> **Verdict**: seul `Tpl` est potentiellement inutilisé; tous les autres sont activement utilisés par le cœur du parser et du schéma. L'audit initial est faux sur ce point.

### W14 — `engineModel.ts:60-62` — `rights as any` inutile
`MachineRightsPolicy` existe dans `machine-model.ts:112-116`. Le cast `any` masque un type précis déjà disponible.
> **[Kimi 5]** Confirmé. `engineModel.ts:61` fait `decl.rights as any` alors que `machine-model.ts:112-116` définit `MachineRightsPolicy`. Le cast `any` annule la vérification de type et masque les éventuelles incompatibilités entre le modèle moteur et le modèle machine.

### W15 — `src/lib/index.ts` — composants shell absents du barrel public
`App`, `TaskBar`, `PaneQuickCreate`, `PaneRecents`, `DevResetPanel` présents dans `src/lib/shell/layout/index.ts` mais non ré-exportés depuis `src/lib/index.ts`.
> **[Opus 4.7]** Confirmé. Manquent aussi: `CollectionNav` (mais signalé supprimé dans CLAUDE.md §6 — vérifier état réel avant action). À l'inverse `Navigation`, `Breadcrumb`, `Pane`, `PaneRight` SONT exportés (lignes 31-34 de index.ts). Décision: soit le barrel est la surface publique (alors compléter), soit `TemplateShell` est censé être le seul shell public (alors retirer Navigation/Breadcrumb du barrel pour cohérence).
> **[Kimi 5]** Confirmé. `src/lib/shell/layout/index.ts` exporte 11 composants dont `App`, `TaskBar`, `PaneQuickCreate`, `PaneRecents`, `DevResetPanel`. `src/lib/index.ts` n'en ré-exporte que 5 (`TemplateShell`, `Navigation`, `Breadcrumb`, `Pane`, `PaneRight`). Les 6 manquants sont inaccessibles depuis le barrel public.

### W16 — `machineLoadFrame.test.ts:68-69` — test sur API deprecated
`expect(machine.frameManager)...` teste l'alias deprecated. Devrait utiliser `machine.framer`.
> **[Opus 4.7]** Nuance: ligne 64-66 teste DÉJÀ `machine.framer` correctement. Le test 68-70 teste explicitement `frameManager` parce que c'est l'alias deprecated — la description du test est explicite (`'exposes frameManager via deprecated frameManager getter'`). C'est un test de compat délibéré, à GARDER tel quel jusqu'à la suppression effective de `machine.frameManager`. À déplacer dans un `describe('@deprecated compat')` pour rendre l'intention claire.
> **[Kimi 5]** Confirmé. Il ne s'agit pas d'une erreur mais d'un test de non-régression intentionnel pour l'API deprecated. À conserver jusqu'à la suppression définitive de `frameManager`, mais à isoler dans un bloc `describe('@deprecated')` pour ne pas polluer la suite principale.

### W17 — imports directs `'$lib/types/machine-model.js'` répandus
`machine.ts`, `machineDb.ts`, `machineSchemaLoader.ts`, `DataList.svelte` importent le fichier type directement au lieu du barrel `$lib`. Incohérent avec la convention monorepo.
> **[Kimi 5]** Confirmé. 33 occurrences d'imports directs de `$lib/types/machine-model.js` dans `src/` (grep complet). Exemples: `machine.ts:14`, `machineDb.ts:1-2`, `DataList.svelte:26`, `FieldDisplay.svelte:13`, `DataFk.svelte:14`, `DataRfk.svelte:17`, etc. Le barrel `$lib` (via `src/lib/types/index.ts`) existe et exporte ces types. À homogénéiser pour respecter la convention monorepo.

---

## 🟡 INFO

### I1 — `InputEmail`, `InputCurrency`, `DataList` — `$effect` écrit dans `$state` sans `untrack()`
- `InputEmail.svelte:31-35` : `email = value`
- `InputCurrency.svelte:26-34` : `inputValue = ...`
- `DataList.svelte:189-207` : `visibleCount` dans l'observer
Pas de boucle détectée, mais le pattern est proscrit par les conventions (`untrack()` requis selon `CLAUDE.md`).
> **[Kimi 5]** Confirmé. Aucune boucle infinie constatée (les variables écrites ne sont pas lues dans le même `$effect`), mais le pattern viole les conventions du monorepo. `DataList.svelte` présente un double-writer (`$effect` à ligne 192 et `IntersectionObserver` à ligne 200) qui peut causer des micro-races sur `visibleCount` lors du scroll rapide.

### I2 — `machine.test.ts:213` — assertion toujours vraie
`expect(allVehicles.length).toBeGreaterThanOrEqual(0)` — vrai pour tout tableau y compris vide. Ne teste rien.
> **[Kimi 5]** Confirmé. Ligne 217: `expect(allVehicles.length).toBeGreaterThanOrEqual(0)` est tautologique. Le test est censé vérifier le pull de données depuis le serveur, mais l'assertion ne valide ni la présence de données ni leur contenu.

### I3 — `explorerTableSort.test.ts:10-18`, `explorerListPagination.test.ts:9-11`
`toBeTruthy()` sur un import de composant Svelte — vérifie uniquement que le module est chargé, pas le comportement.
> **[Kimi 5]** Confirmé. Les trois tests (`Explorer is defined`, `accepts collection + mode props`) se contentent de vérifier que le module est importable (`expect(Explorer).toBeTruthy()`). Aucun test de comportement réel (rendu, pagination, tri) n'est présent.

### I4 — `machineActivity.test.ts:57`, `machineHistory.test.ts:59`, `machinePrefs.test.ts:75`
Setup `beforeEach(() => { col = mockCollection(); })` identique dans 3 fichiers. Candidat à un helper partagé.

### I5 — Couverture nulle (~30 fichiers source)
Aucun test correspondant pour :
`machineIdbAdapter.ts`, `machineModelBuilder.ts`, `machineSchemaCache.ts`, `machineSchemaLoader.ts`,
`machineSeed.ts`, `MachineRights.ts`, `MachineSocket.ts`, `fieldBuilder.ts`, `MachineFrameManager.ts`,
`MachineError.ts`, `MachineErrorValidation.ts`, `MachineSchemeField.ts`, `MachineSchemeFieldForge.ts`,
`MachineSchemeFieldValues.ts`, `MachineSchemeValues.ts`, `SchemeFieldDefaultValues.ts`, `validateRules.ts`,
`frameUrl.ts`, `MachineApi.ts`, `RealtimeClient.ts`, `errors.ts`,
`MachineMultiBase.ts`, `explorerUtils.ts`,
et tous les barrels `data-ui/*/index.ts`.

### I6 — 7+ symboles `@deprecated` sans sprint de suppression planifié
`adaptIdbToSchema()`, `start()`, `fetchSchema()`, getter `collections`, `idbql`/`indexedb`/`idbqModel`, `loadFrame()`, `frameManager`.
Aucun backlog item associé dans `bmad/status.yaml` au moment de l'audit.

---

## Priorités recommandées

```
Sprint immédiat
  C1   fetchSchema() — corriger l'implémentation ou retirer la méthode
  C2   machineSchemaLoader.ts — retirer loadSchema() ou l'intégrer
  W1   createInstance() — await boot()
  W10  DataFk — retirer collectionId, where
  W11  DataRfk — idem
  W12  FieldDisplay — retirer collectionId, editInPlace
  W16  machineLoadFrame.test.ts — machine.framer

Backlog court
  C3   Dédupliquer FieldViews/ViewFieldDef
  W2   Erreurs silencieuses — audit systématique des .catch()
  W14  engineModel.ts — retirer cast any sur rights
  W15  index.ts — exposer les composants shell manquants
  I1   Ajouter untrack() dans InputEmail, InputCurrency, DataList

Backlog long
  W3+W4+W5+W6+W8  Dead code — retirer après confirmation
  W7   linkParser — ajouter validation de action
  W9   MachineSchemeValues — propager les erreurs au lieu de les avaler
  W13  Types dead — vérifier usage externe puis retirer
  W17  Homogénéiser les imports vers le barrel
  I2+I3  Assertions de test — renforcer
  I4   Factoriser le setup de test
  I5   Couverture — prioriser machineIdbAdapter, MachineRights, machineSeed, fieldBuilder
  I6   Planifier la suppression des @deprecated dans le bmad
```

---

*Prochaine révision prévue après Sprint 40 ou si refactor majeur de machine.ts.*

---

## Annotations [Opus 4.7] — 2026-05-27

Récap des findings ajoutés ci-dessus (annotations inline `> **[Opus 4.7]**`):

- **C1**: shim de compat (deprecated), pas une vraie méthode — clarifié.
- **C2**: `loadSchema` vraiment dead, mais `_revalidateSchema` reprend sa logique — refactor pour consommer, pas juste supprimer.
- **C3**: lignes faussées (1383/1402 réel), **TRIPLE** dup (api/types.ts:4-28 ajouté). Divergences réelles entre les 3 copies.
- **W1**: signature sync = breaking si on async; alternative `instance.ready: Promise<void>`.
- **W4**: chemin de fichier dans le rapport potentiellement erroné (vrai = `src/lib/main/machineParserForge.ts`).
- **W6**: PAS un dup — signatures différentes. Vrai défaut = écriture directe au lieu de déléguer.
- **W7**: fix 2 lignes décrit.
- **W8**: garde morte confirmée + refactor unique avec `{ onlyIfEmpty }`.
- **W12**: bug latent — props dans le type mais ABSENTES de la destructuration → silent no-op pour les appelants.
- **W15**: cohérence du barrel: tous OU rien (actuellement Navigation/Breadcrumb dedans mais App/TaskBar dehors).
- **W16**: faux positif partiel — c'est un test de compat délibéré; à déplacer dans un `describe` étiqueté.

Findings non listés dans l'audit initial:
- **N1** `src/lib/main/api/types.ts:4-28` — 3ᵉ copie de `FieldViews`/`ViewFieldDef` (voir C3).
- **N2** `machine.ts:392` — `get sync()` throw `'Machine not started. Call start() first.'` alors que `start()` est `@deprecated`. Le message guide vers une API morte. Remplacer par `boot()`.
- **N3** `machine.ts:371` — message d'erreur `Did you call start()?` même problème que N2.
- **N4** `MachineSocket.ts:18` — `client.config.port = 0` magique, sans commentaire. Voulu? À documenter ou retirer.

> **[Kimi 5]** Vérification des findings N2–N4:
> - **N2** Confirmé. `machine.ts:392` lance `'Machine not started. Call start() first.'`. `start()` est `@deprecated` depuis la ligne 316. Le message d'erreur doit être mis à jour vers `boot()`.
> - **N3** Confirmé. `machine.ts:371` lance `'Collection "${name}" not found. Did you call start()?'`. Même problème: référence à une API deprecated. Doit indiquer `boot()`.
> - **N4** Confirmé. `MachineSocket.ts:18` affecte `client.config.port = 0` sans explication. C'est une valeur magique qui pourrait masquer un comportement par défaut de `@medyll/idae-socket`. À documenter si intentionnel, ou retirer si résidu de debug.
>
> **Finding additionnel Kimi 5 — W2 étendu**: Les erreurs silencieuses ne sont pas limitées aux lignes listées. `machineIdbAdapter.ts:40-41` (`catch { storedHash = null; }`), `machineIdbAdapter.ts:46-47` (`catch { return null; }`), `machineSchemaCache.ts:32-33` (`catch { return null; }`), `machineSchemaCache.ts:41-42` (`req.onerror = () => resolve()`), et `machine.ts:311-312` (`catch { /* revalidate failed */ }`) forment un pattern systémique d'avalage d'erreurs sans log. Cela complique le debug en production.
>
> **Finding additionnel Kimi 5 — I1 précisé**: Les `$effect` dans `InputEmail.svelte:33-35` et `InputCurrency.svelte:28-34` écrivent dans du `$state` local synchronisé depuis une prop. Ce n'est pas une boucle infinie (la variable écrite n'est pas lue dans l'effect), mais c'est bien le pattern proscrit par `CLAUDE.md`. `DataList.svelte:189-193` écrit `visibleCount = chunkSize` dans un `$effect` tout en permettant à un `IntersectionObserver` (ligne 199-200) d'écrire aussi `visibleCount`. C'est un double-writer potentiellement source de races visuelles, mais pas de boucle infinie détectée.

