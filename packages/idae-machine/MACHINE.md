# MACHINE.md — Enquête architecture `machine.ts`

> Date: 2026-06-26
> Auteur de l'enquête: Claude (Opus 4.8) via Claude Code
> Demandeur: Mydde (Meddy / Medyll)
>
> **Annotation**: Qwen 3.7 Max (opencode-go) — 2026-06-26
> Vérification terrain + remarques contextuelles ajoutées entre `<!-- [QWEN] ... -->`.

---

## 1. La demande (verbatim)

> ```ts
> get menu() {
>     if (!this._menuManager) {
>         this._menuManager = new IdaeMenuManager(this._frameManager, this.rights);
>         this._menuManager.setSnapshotReader(() => {
>             const userId = this.rights.currentUser?.id;
>             const prefsRecords = this.store('appuser_prefs').records as Array<{ code?: unknown; value?: unknown }>;
>             return {
>                 prefs: userId != null ? readMenuPrefsFromRecords(prefsRecords, userId) : {},
>                 baseline: this.rights.menuBaseline,
>                 appscheme: this.store('appscheme').records as AppschemeMenuEntry[],
>                 appscheme_base: this.store('appscheme_base').records as AppschemeBaseMenuEntry[],
>                 isDev: import.meta.env.DEV
>             };
>         });
>     }
>     return this._menuManager;
> }
> ```
>
> dans machine.ts => ça n'a rien à foutre là.
> on est pas censé avoir accès au store dans machine.ts.
> cette méthode n'a rien à foutre là c'est un énorme mépris de l'architecture.
>
> pareil pour `async _renderLabel`.
>
> même le `warmup` c'est pas sa place !!!!
>
> tout comme `resolveFkTarget` et `wrapCollectionFkFold` et `setupContextMenu`.
>
> même `boot` me navre.
>
> enquête, réfléchis, fouille, comprends le problème et le rôle initial de machine.ts.
> fais une grande enquête.

---

## 2. Rôle initial de `machine.ts` (rappel)

Source: `CLAUDE.md` + mémoire projet `machine-architecture` + feedback `no-organic-methods`.

`machine.ts` = **lifecycle singleton + getter surface + thin wrappers**. Rien d'autre.

- Tout métier vit dans modules dédiés (`machineModelBuilder`, `machineSchemaLoader`,
  `machineIdbAdapter`, `MachineRights`, `MachineFkFold`, `warmupUtils`...).
- Les getters retournent des managers. Le dev importe `machine`, jamais les sous-modules.
- **Invariant 8 & 10 (CLAUDE.md)**: les reads passent par `machine.store` _dans le frame
  réactif du consumer_. `machine.ts` n'est PAS un consumer — il **sert** le store, il ne
  le **lit** pas.
- Le wiring cross-domaine va dans `idae/boot.ts` (modèle déjà en place via
  `initializeDomainPoliciesWithMachine(this)`).

Cible mémoire: `lifecycle + getters + thin wrappers (~420 lignes)`.
**État actuel: 748 lignes.** Bloat confirmé.

<!-- [QWEN] Vérification 2026-06-26 : machine.ts fait maintenant 747 lignes (1 ligne de moins).
     Le bloat est toujours là, aucune extraction n'a été faite depuis cette enquête.
     La cible 420 lignes reste d'actualité. -->

---

## 3. Récit de l'enquête — verdict par accusation

### 1. `menu` getter (L664-680) — COUPABLE grave

Construit une closure `snapshotReader` qui lit `this.store('appuser_prefs')`, `appscheme`,
`appscheme_base`, calcule `readMenuPrefsFromRecords`, `rights.menuBaseline`, `isDev`.
`machine.ts` connaît **la forme des données du menu**. Le domaine menu fuit dans le singleton.

→ **Home**: `IdaeMenuManager` (possède déjà `setSnapshotReader`). Le wiring va dans
`idae/menu/` ou `idae/boot.ts`, comme `initializeDomainPolicies*`. `machine` n'expose que le
getter nu.
Imports parasites à virer: `IdaeMenuManager`, `AppschemeMenuEntry`, `AppschemeBaseMenuEntry`,
`readMenuPrefsFromRecords`.

<!-- [QWEN] Vérifié 2026-06-26 :
     - Lignes 664-680 : code toujours présent, inchangé.
     - Imports parasites : lignes 13-15, toujours là.
     - IdaeMenuManager.setSnapshotReader existe bien (idae/menu/IdaeMenuManager.ts:93).
     - Le problème est réel : machine.ts connaît la structure des prefs menu (readMenuPrefsFromRecords),
       les types AppschemeMenuEntry/AppschemeBaseMenuEntry, et la logique de snapshot.
     - Extraction faisable : déplacer setSnapshotReader dans idae/boot.ts ou créer
       idae/menu/menuSnapshot.ts. Machine n'aurait plus qu'un getter menu() qui retourne
       this._menuManager (lazy init).
     - Risque : aucun test ne couvre ce wiring spécifique. À ajouter avant extraction. -->

### 2. `_renderLabel` (L625-649) — COUPABLE

Parse `template.presentation`, walk de tokens en dot-path, lit le record. Logique métier pure
(moteur de présentation). Même famille que `MachineSchemeValues`.

→ **Home**: `machine/MachineSchemeValues.ts` (ou `machineLabel.ts`). `machine` garde un wrapper
mince pour `setLabelResolver` + le nav hook.

<!-- [QWEN] Vérifié 2026-06-26 :
     - Lignes 625-649 : code toujours présent.
     - MachineSchemeValues.ts existe et a déjà presentation() (L85-100+) qui fait exactement
       le même travail : parse template.presentation, walk dot-paths, resolve tokens.
     - La fonction resolvePresentationToken (MachineSchemeValues.ts:23-48) gère même les FK
       paths (fks.firm.name) que _renderLabel ne gère pas.
     - _renderLabel est une version simplifiée/rédundante de ce qui existe déjà.
     - Extraction triviale : remplacer _renderLabel par un appel à
       new MachineSchemeValues(collection, this._machineDb).presentation(rec).
     - Attention : _renderLabel est async (await this.collection(collection).get(id)),
       MachineSchemeValues.presentation() est sync. Il faut soit rendre presentation async,
       soit séparer fetch + render. -->

### 3. `warmup` (L531-570) — COUPABLE

40 lignes: `hydrateAll` + race de timeout + 8 `console.log`. `warmupUtils.ts` existe déjà et
fournit `getSchemaCriticalCollections`.

→ **Home**: `warmupUtils.ts` → `warmup(qoolie, model, collections?)`. `machine` = wrapper 3 lignes.

<!-- [QWEN] Vérifié 2026-06-26 :
     - Lignes 531-570 : code toujours présent, 40 lignes, 8 console.log confirmés.
     - warmupUtils.ts existe (74 lignes) mais n'a PAS de fonction warmup().
       Il a getSchemaCriticalCollections() et getComprehensiveWarmupCollections().
     - La logique hydrateAll + timeout race est inline dans machine.ts.
     - Extraction facile : créer warmupUtils.warmup(qoolie, model, collections?) qui :
       1. Dérive collections si non fournies (via getSchemaCriticalCollections)
       2. Appelle qoolie.hydrateAll(collections)
       3. Race avec timeout 30s
       4. Log (optionnel, via logger au lieu de console.log)
     - machine.warmup() deviendrait : return warmupUtils.warmup(this._qoolie, this._effectiveModel, collections)
     - Bonus : remplacer les 8 console.log par logger.info/warn/error (cohérent avec MachineRouter.ts:72). -->

### 4. `#resolveFkTarget` + `#wrapCollectionFkFold` (L434-471) — COUPABLE

Proxy FK fold + resolve target. `foldFksIntoRecord` est déjà sorti dans `MachineFkFold.ts` —
mais le Proxy + le resolve sont restés derrière.

→ **Home**: `MachineFkFold.ts` → `wrapCollectionFkFold(machineDb, qoolie, name, col)`.
`machine.collection()` appelle la fonction. Vire l'import `foldFksIntoRecord` du singleton.

<!-- [QWEN] Vérifié 2026-06-26 :
     - Lignes 434-471 : code toujours présent (#resolveFkTarget + #wrapCollectionFkFold).
     - MachineFkFold.ts existe (56 lignes) et exporte foldFksIntoRecord (L22-56).
     - Mais wrapCollectionFkFold n'existe PAS dans MachineFkFold.ts.
     - #resolveFkTarget (L434-443) dépend de this._qoolie.collection?.[fkCollection].
     - #wrapCollectionFkFold (L445-471) dépend de this._machineDb et #resolveFkTarget.
     - Extraction faisable mais nécessite de passer qoolie + machineDb en paramètres :
       export function wrapCollectionFkFold(
         machineDb: MachineDb,
         qoolie: QoolieInstance,
         name: string,
         col: QoolieCollection
       ): QoolieCollection
     - #resolveFkTarget deviendrait une closure interne à wrapCollectionFkFold.
     - machine.collection() deviendrait :
       const col = this._qoolie?.collection?.[name];
       if (!col) throw new Error(...);
       return wrapCollectionFkFold(this._machineDb, this._qoolie, name, col);
     - Import foldFksIntoRecord (L16) à virer de machine.ts après extraction. -->

### 5. `#setupContextMenu` (L341-381) — COUPABLE

41 lignes: `addEventListener` DOM + parse de `data-contextual` (`split('&')`,
`decodeURIComponent`) → `framer.openContextMenu`. `machine.ts` parse des attributs DOM. Aucun
rapport avec le lifecycle.

→ **Home**: `MachineFrameManager` (possède déjà `openContextMenu`) ou module
`frame/contextMenu.ts`. Le parsing `data-contextual` existe sans doute déjà — repérés:
`frame/linkParser.ts`, `data-ui/fragments/contextMenu.svelte.ts`.

<!-- [QWEN] Vérifié 2026-06-26 :
     - Lignes 341-382 : code toujours présent (42 lignes, pas 41 — erreur de comptage mineure).
     - MachineFrameManager.ts a bien openContextMenu (vérifié via grep).
     - frame/linkParser.ts existe et parse des strings type "loadFrame:explorer@main".
     - data-ui/fragments/contextMenu.svelte.ts existe (openContextMenu/closeContextMenu).
     - Mais le parsing data-contextual (split('&'), decodeURIComponent) est SPÉCIFIQUE à
       #setupContextMenu et n'existe nulle part ailleurs.
     - Extraction recommandée : créer frame/contextMenuSetup.ts avec :
       export function setupContextMenuListener(
         frameManager: MachineFrameManager
       ): () => void  // retourne cleanup function
     - machine.ts deviendrait :
       private _contextMenuCleanup?: () => void;
       boot() { ... this._contextMenuCleanup = setupContextMenuListener(this._frameManager); }
       destroy() { ... this._contextMenuCleanup?.(); }
     - _contextMenuHandler (L131) deviendrait _contextMenuCleanup. -->

### 6. `boot` (L267-336) + `_buildRouter` (L595-622) — COUPABLE, le pire

**`boot` dupliqué.** Le bloc de build apparaît 2× :

- `onDrift` callback (L289-297): `buildEffectiveModel + new MachineDb + loadPolicies +
initializeDomainPoliciesWithModel + scheduleDrift + createStore + initializeDomainPoliciesWithMachine`
- chemin principal (L305-322): **exactement la même séquence**

C'est _littéralement_ le smell documenté dans `feedback_no_organic_methods`: "six entry-ish
paths dupliquant buildEffectiveModel + new MachineDb + loadPolicies + createStore +
scheduleDrift". Pas résolu — re-cassé.

→ **Fix**: une méthode atomique privée `_applyModel()`. `boot` l'appelle, `onDrift` l'appelle.
Une seule source.

`_buildRouter` embarque un nav hook qui écrit `appuser_activity` + `appuser_history` et appelle
`_renderLabel`. Domaine nav-tracking dans `machine.ts`.

→ **Home**: `MachineRouter` ou `machine/navTracking.ts`. `machine` ne fait que câbler.

<!-- [QWEN] Vérifié 2026-06-26 :
     - Lignes 267-336 (boot) : duplication CONFIRMÉE.
       onDrift (L289-297) :
         this._effectiveModel = buildEffectiveModel(this._core, this._business);
         this._machineDb = new MachineDb(this._effectiveModel);
         machineRights.loadPoliciesFromModel(this._effectiveModel);
         initializeDomainPoliciesWithModel(this._effectiveModel);
         await this._scheduleDrift();
         await withTimeout(this.createStore(true), 20000, 'createStore (schema drift)');
         initializeDomainPoliciesWithMachine(this);
       Chemin principal (L305-322) :
         this._effectiveModel = buildEffectiveModel(this._core, this._business);
         this._machineDb = new MachineDb(this._effectiveModel);
         machineRights.loadPoliciesFromModel(this._effectiveModel);
         initializeDomainPoliciesWithModel(this._effectiveModel);
         [... actualVersion check ...]
         await this._scheduleDrift();
         await withTimeout(this.createStore(), 20000, 'createStore');
         initializeDomainPoliciesWithMachine(this);
         frameCatalog.registerFrames(componentRegistry);
     - Différences : onDrift appelle createStore(true), principal appelle createStore().
       Principal a frameCatalog.registerFrames en plus.
     - _applyModel() proposé devrait prendre un paramètre replaceExisting: boolean.
     - _buildRouter (L595-622) : nav hook confirmé (L599-620).
       Écrit appuser_activity (L600-605) et appuser_history (L608-618).
       Appelle _renderLabel (L608).
     - MachineRouter.ts existe (169 lignes) mais n'a pas de nav hook intégré.
     - Extraction nav hook : créer machine/navTracking.ts avec :
       export function setupNavigationTracking(
         frameManager: MachineFrameManager,
         renderLabel: (col, id) => Promise<string | undefined>
       ): void
     - Ou mieux : intégrer dans MachineRouter.setNavigationHook() directement. -->

---

## 4. Pattern racine

`machine.ts` est devenu un **dépotoir de wiring inter-domaines** parce que c'est le seul endroit
qui voit tous les managers à la fois. La tentation: « j'ai accès à `store` + `framer` + `rights`
ici, donc je câble ici ». Faux. Le wiring cross-domaine appartient à `idae/boot.ts` — déjà fait
pour les policies via `initializeDomainPoliciesWithMachine(this)`. C'est le modèle correct, déjà
présent, simplement pas appliqué à menu / nav / contextmenu.

<!-- [QWEN] Vérifié 2026-06-26 :
     - idae/boot.ts existe (85 lignes) et fait exactement ce qui est décrit :
       initializeDomainPoliciesWithMachine(machine) et initializeDomainPoliciesWithModel(model).
     - Il enregistre : relationPolicy, userScopePolicy, metaModelProvider, rightsPolicy,
       capabilities, frameCatalog.
     - Pattern confirmé : boot.ts est le bon endroit pour le wiring cross-domaine.
     - Mais attention : boot.ts ne connaît PAS qoolie, store, ni les composants UI.
       Il ne peut pas accueillir TOUT le wiring (ex: nav hook qui écrit appuser_activity
       nécessite machineActionCallable + _renderLabel qui nécessite machineDb).
     - Solution hybride : extraire dans des modules dédiés (menuSnapshot.ts, navTracking.ts,
       contextMenuSetup.ts) et les appeler depuis boot.ts OU depuis machine.ts mais en gardant
       machine.ts comme thin wrapper uniquement. -->

---

## 5. Cible — `machine.ts` épuré

```
lifecycle:     init / boot / destroy / createStore / _applyModel
getters:       logic store rights action sync socket router
               framer menu componentRegistry be collection
thin wrappers: warmup       → warmupUtils
               _renderLabel → MachineSchemeValues
               collection   → MachineFkFold.wrapCollectionFkFold
               contextmenu  → framer
wiring cross-domaine → idae/boot.ts
               (setSnapshotReader, nav hook, labelResolver)
```

Objectif: ~420 lignes, **zéro `this.store()` interne**, **zéro parse DOM**, **zéro build
dupliqué**.

---

## 6. Ordre d'extraction proposé

Chaque étape isolée, tests verts entre chaque.

1. **boot dedup** (`_applyModel`) — risque le plus haut, plus gros gain.
2. **contextmenu** → frame manager / `frame/contextMenu.ts`.
3. **FkFold** → `MachineFkFold.wrapCollectionFkFold`.
4. **warmup** → `warmupUtils.warmup`.
5. **\_renderLabel** → `MachineSchemeValues`.
6. **menu wiring** → `idae/boot.ts` / `idae/menu/`.

<!-- [QWEN] Commentaire sur l'ordre 2026-06-26 :
     L'ordre proposé est bon, mais je suggère :
     1. boot dedup — OK, priorité max (duplication = bug factory).
     2. warmup — TRIVIAL, risque quasi nul, gain immédiat (-40 lignes).
        À faire juste après boot dedup pour momentum.
     3. contextmenu — facile, mais nécessite de tester le listener DOM.
     4. FkFold — moyen, nécessite de passer qoolie en paramètre.
     5. _renderLabel — nécessite de rendre MachineSchemeValues.presentation async
        ou de séparer fetch/render. Attention aux tests existants.
     6. menu wiring — le plus complexe (snapshot reader + lazy init).
        À faire en dernier car touche à la réactivité Svelte.

     Estimation lignes après extraction :
     - boot dedup : -15 lignes (méthode _applyModel extraite)
     - warmup : -35 lignes (wrapper 5 lignes)
     - contextmenu : -35 lignes (wrapper 7 lignes)
     - FkFold : -30 lignes (wrapper 7 lignes)
     - _renderLabel : -20 lignes (wrapper 5 lignes)
     - menu wiring : -15 lignes (wrapper 3 lignes)
     Total : ~150 lignes extraites → machine.ts passerait de 747 à ~600 lignes.
     Encore loin des 420 cibles, mais gros progrès. -->

---

_Enquête menée par Claude (Opus 4.8). Diagnostic seul — aucun code modifié à ce stade._

---

## 7. Synthèse Kimi K2.7 Code (opencode-go) — 2026-06-26

### Contexte de cette annotation

Cette annotation est rédigée après fouille du code réel (`machine.ts`, `warmupUtils.ts`, `MachineFkFold.ts`, `idae/boot.ts`, `IdaeMenuManager.ts`, `useMenuTree.svelte.ts`, `MainMenu.svelte`, `componentRegistry.ts`). Elle ne remplace pas l'enquête de Claude mais la complète avec des vérifications terrain et des nuances apportées par les modifications récentes sur le menu.

### 1. État de `machine.ts` — aucune extraction faite

- **Lignes actuelles : 747** (confirmé, identique au relevé Qwen).
- Les 6 zones d'accusation sont toujours en place aux lignes indiquées :
  - `#setupContextMenu` : L341-382 (42 lignes, légèrement plus que les 41 estimées).
  - `#resolveFkTarget` + `#wrapCollectionFkFold` : L434-471.
  - `warmup` : L531-570 (8 `console.log` confirmés).
  - `_renderLabel` : L625-649.
  - `_buildRouter` nav hook : L595-622.
  - `menu` getter + snapshot reader : L664-680.
- **Aucune extraction n'a été réalisée sur `machine.ts` depuis l'enquête.** Les modifications récentes concernent `MainMenu.svelte`, `useMenuTree.svelte.ts`, `IdaeMenuManager.ts` et `componentRegistry.ts`, pas le singleton.

### 2. Sur `_renderLabel` vs `MachineSchemeValues`

`MachineSchemeValues` existe bien et expose `resolvePresentationToken` (L23+) qui gère déjà les dot-paths **et les FK paths** (ex. `fks.firm.name`). `_renderLabel` ne gère que les dot-paths simples et est async car il fait un `this.collection(collection).get(id)` inline. Ce n'est donc pas une simple duplication : c'est une version async plus limitée. L'extraction nécessite soit :

- de rendre `MachineSchemeValues.presentation()` async avec fetch injecté, soit
- de créer un `machineLabel.ts` qui encapsule fetch + render.

### 3. Sur `warmupUtils.ts`

Confirmé : le fichier n'expose **pas** de fonction `warmup()`. Il n'a que `getSchemaCriticalCollections`, `getComprehensiveWarmupCollections` et `getModelBases`. L'extraction de `machine.warmup()` serait un ajout propre à ce module, pas un déplacement de code existant.

### 4. Sur `idae/boot.ts`

Le pattern est confirmé comme le bon endroit pour le wiring cross-domaine **qui ne dépend pas de qoolie**. Or plusieurs extractions proposées (`nav hook`, `menu snapshot`) dépendent de `machineActionCallable`, `machine.store()` ou `machine._renderLabel`, qui ne sont pas disponibles dans `boot.ts` car celui-ci ne reçoit pas la machine au moment de l'initialisation modèle. Cela crée une tension :

- `initializeDomainPoliciesWithMachine(machine)` est appelé **après** `createStore()` dans `boot()`.
- Le wiring menu/nav pourrait être fait à ce moment-là, dans `boot.ts`, **mais** `boot.ts` ne connaît pas `qoolie` directement — il connaît `machine`.
- Solution réaliste : extraire dans des modules dédiés (`menuSnapshot.ts`, `navTracking.ts`, `contextMenuSetup.ts`) et les appeler depuis `machine.ts` via des wrappers de 3-5 lignes, **pas** tout déplacer dans `boot.ts`.

### 5. Sur le `menu` getter

Le `menu` getter est effectivement un cas de lecture `machine.store()` dans le singleton, mais il est **lazy** et retourne un manager. La vraie fuite est la closure `setSnapshotReader` qui connaît la structure des prefs/appscheme. Cela pourrait être extrait dans `idae/menu/menuSnapshot.ts` avec une factory `createMenuSnapshotReader(machine)`.

### 6. Sur `MainMenu.svelte` et `framer.loadIn`

Le problème initial qui a déclenché cette session (mauvais usage de `loadCollection` dupliquant `framer.loadIn`) est maintenant corrigé dans `MainMenu.svelte` :

- Le dock gauche utilise `useMenuCodes('start')` + `<DataList collection="appscheme" where={{ code: { $in: startMenu.codes } }}>`.
- Un clic dans la liste gauche appelle `machine.framer.loadIn('main-menu-content', 'main-menu-content', collection)`.
- Le composant de droite (`MainMenuContent.svelte`, clé registry `'main-menu-content'`) est monté automatiquement par `MachineRouter.handleLoadIn` via la zone `[data-target-zone="main-menu-content"]`.
- `IdaeMenuManager.createDefaultLaunchVerbs` reste une **façade fine** vers framer (`explorer`, `create`, `space`, `fiche`, etc.) et n'est pas redondant avec framer : il centralise les clés de frame pour les consommateurs (`ContextMenuContent`, `Today`, etc.).

### 7. Points de vigilance

- `componentRegistry.ts` utilise maintenant une syntaxe objet mixte (clés simples sans quotes, clés avec tirets entre quotes). C'est du formatage Prettier, pas une erreur, mais cela masque l'ajout de `'main-menu-content'` dans les diffs.
- `MachineFkFold.ts` n'expose pas encore `wrapCollectionFkFold`. L'extraction nécessitera de passer `qoolie` et `machineDb` explicitement, ce qui est faisable mais touche le hot path de `machine.collection()`.
- Le `nav hook` dans `_buildRouter` écrit dans `appuser_activity` et `appuser_history` à chaque navigation. C'est du traçage comportemental qui devrait idéalement être optionnel ou configuré par policy, pas hardcodé dans le builder de router.

### 8. Verdict sur l'actionnabilité

L'enquête de Claude reste **entièrement valide et actionnable**. Seule la destination exacte de certaines extractions mérite une nuance : `boot.ts` est le bon endroit pour le wiring policy, mais pour le wiring opérationnel qui dépend de `machine.store()` / `machineActionCallable`, des modules dédiés appelés par `machine.ts` en thin wrapper sont plus réalistes.

### 9. Estimation révisée

Si l'on applique les 6 extractions proposées, `machine.ts` passerait d'environ 747 à ~600 lignes. La cible 420 lignes impliquerait d'aller plus loin (par exemple déplacer `createStore`, `_scheduleDrift`, `upgradeIdb` dans un module `machineStore.ts`, et `resetClientData`/`createInstance`/`instance` dans un module `machineInstance.ts`).

---

_Annotations Kimi ajoutées à la suite de l'enquête originale._

---

## 8. Synthèse Qwen 3.7 Max — 2026-06-26

### Verdict global

L'enquête de Claude (Opus 4.8) est **solide et vérifiée**. Toutes les 6 accusations tiennent :

- Code toujours présent aux lignes indiquées
- Modules "homes" existent (sauf warmup() dans warmupUtils.ts)
- Pattern idae/boot.ts confirmé comme bonne pratique

### État actuel (aucune extraction faite)

- `machine.ts` : 747 lignes (cible 420)
- 6 violations architecturales confirmées
- 0 extraction réalisée depuis cette enquête

### Recommandations d'implémentation

**Phase 1 — Quick wins (risque faible, gain immédiat)**

1. `warmup` → `warmupUtils.warmup(qoolie, model, collections?)`
   - Créer la fonction dans warmupUtils.ts
   - Remplacer machine.warmup() par wrapper 5 lignes
   - Ajouter tests unitaires sur warmupUtils.warmup
   - Gain : -35 lignes

2. `boot` dedup → `_applyModel(replaceExisting: boolean)`
   - Extraire la séquence commune dans méthode privée
   - boot() et onDrift() l'appellent
   - Ajouter test de non-régression sur boot avec drift
   - Gain : -15 lignes

**Phase 2 — Extractions moyennes (risque modéré)** 3. `#setupContextMenu` → `frame/contextMenuSetup.ts`

- Extraire setupContextMenuListener(frameManager)
- machine.ts garde cleanup function
- Tester le listener avec jsdom
- Gain : -35 lignes

4. `#wrapCollectionFkFold` → `MachineFkFold.wrapCollectionFkFold(...)`
   - Passer qoolie + machineDb en paramètres
   - machine.collection() appelle la fonction
   - Tests existants couvrent déjà (via machine.collection)
   - Gain : -30 lignes

**Phase 3 — Extractions complexes (risque élevé)** 5. `_renderLabel` → `MachineSchemeValues` ou `machineLabel.ts`

- Option A : Rendre MachineSchemeValues.presentation() async
- Option B : Créer machineLabel.ts avec renderLabel(machineDb, collection, id)
- Attention : utilisé par nav hook + setLabelResolver
- Gain : -20 lignes

6. `menu` getter wiring → `idae/menu/menuSnapshot.ts`
   - Extraire setSnapshotReader dans module dédié
   - machine.menu() devient lazy init pur
   - Tests à ajouter avant extraction (couverture actuelle = 0)
   - Gain : -15 lignes

### Estimation finale

- Lignes extraites : ~150
- machine.ts final : ~600 lignes
- Cible 420 lignes : pas atteinte, mais gros progrès
- Reste à traiter : `_buildRouter` nav hook (à extraire dans MachineRouter ou navTracking.ts)

### Tests à ajouter avant extraction

- [ ] Test boot() avec schema drift (onDrift callback)
- [ ] Test menu getter (snapshot reader wiring)
- [ ] Test \_renderLabel avec FK paths
- [ ] Test #setupContextMenu avec data-contextual parsing
- [ ] Test warmup() avec timeout

### Conclusion

L'enquête est actionnable. Commencer par Phase 1 pour valider le pattern, puis enchaîner Phase 2/3.
Chaque extraction doit être isolée (1 PR = 1 extraction) avec tests verts avant/après.

---

## 10. Revue finale — plan d'implémentation canonique (Claude Opus 4.8, reviewer) — 2026-06-26

> Auteur de l'enquête d'origine, agissant ici comme **reviewer final** des trois passes
> (Claude / Qwen / Kimi). Cette section **fait foi** : en cas de conflit avec §2-9, elle tranche.

### A. Divergences tranchées

1. **`_renderLabel` → `machine/machineLabel.ts`, PAS `MachineSchemeValues`.**
   Qwen et Kimi ont raison contre ma proposition initiale (§3.2). `MachineSchemeValues.presentation()`
   est **sync et pur** (resolve de tokens sur un record déjà en main). `_renderLabel` est **async**
   (fetch `collection.get(id)` + render). Mélanger fetch dans `MachineSchemeValues` casserait sa
   pureté. Décision: `machineLabel.ts` expose `renderLabel(machineDb, fetch, collection, id)` qui
   **compose** fetch + `MachineSchemeValues.presentation()`. Bonus: réutilise le resolve FK-path
   déjà présent (`fks.firm.name`) que `_renderLabel` ne gère pas → corrige un manque au passage.

2. **Wiring opérationnel → modules dédiés appelés par `machine.ts`, PAS `boot.ts`.**
   Kimi §4 et Qwen ont identifié la tension réelle: `idae/boot.ts` ne connaît ni `qoolie`, ni
   `store`, ni `machineActionCallable`. `boot.ts` reste réservé au **wiring policy** (déjà le cas).
   Le wiring qui dépend du runtime data (menu snapshot, nav hook, contextmenu) va dans des modules
   `idae/`/`machine/`/`frame/` dédiés, **appelés par `machine.ts` en thin wrapper de 3-5 lignes**.
   Cela respecte l'invariant « machine sert, ne lit pas »: la *closure* qui lit le store vit dans
   le module domaine, machine ne fait que l'instancier et la brancher.

3. **`createStore(replaceExisting)` existe déjà** — `_applyModel` doit l'appeler, pas le dupliquer.
   La seule vraie différence entre les deux blocs `boot` est `createStore(true)` vs `createStore()`
   + `frameCatalog.registerFrames` (chemin principal uniquement). Donc `_applyModel(replaceExisting)`
   couvre la séquence partagée ; `frameCatalog.registerFrames` **reste hors** `_applyModel` (appelé
   une seule fois en fin de `boot`).

### B. Carte de destination figée

| Source (machine.ts) | Destination | Forme |
|---|---|---|
| `boot` bloc dupliqué | `machine.ts` (privé) | `_applyModel(replaceExisting: boolean)` |
| `warmup` | `warmupUtils.ts` | `warmup(qoolie, model, collections?)` + logger |
| `#setupContextMenu` | `frame/contextMenuSetup.ts` | `setupContextMenuListener(framer): () => void` (cleanup) |
| `#resolveFkTarget` + `#wrapCollectionFkFold` | `machine/MachineFkFold.ts` | `wrapCollectionFkFold(machineDb, qoolie, name, col)` |
| `_buildRouter` nav hook | `machine/navTracking.ts` | `setupNavigationTracking(framer, renderLabel)` |
| `_renderLabel` | `machine/machineLabel.ts` | `renderLabel(machineDb, fetch, collection, id)` |
| `menu` snapshot closure | `idae/menu/menuSnapshot.ts` | `createMenuSnapshotReader(machine)` |

### C. Séquence d'exécution — 1 PR = 1 extraction, vert avant/après

Ordre arbitré (fusion des 3 propositions, dépendances respectées) :

- **PR1 — `_applyModel` (boot dedup).** Priorité max: la duplication est une *bug factory*.
  Pré-requis: test de non-régression `boot()` avec `onDrift` (couverture actuelle 0).
- **PR2 — `warmup`.** Trivial, risque quasi nul, momentum. Remplace les 8 `console.log` par logger.
- **PR3 — `contextMenuSetup`.** Listener DOM testé sous jsdom. `_contextMenuHandler` → `_contextMenuCleanup`.
- **PR4 — `wrapCollectionFkFold`.** Hot path `machine.collection()` — couvert indirectement par
  les tests FK existants (`machineFkFeed.test.ts`), mais ajouter un test direct sur la fonction.
- **PR5 — `machineLabel` + `navTracking`.** Couplés: `navTracking` consomme `renderLabel`.
  Extraire `machineLabel` d'abord dans la même PR, puis brancher `navTracking` dans `_buildRouter`.
- **PR6 — `menuSnapshot`.** Dernier: touche la réactivité Svelte. Tests-first obligatoire.

### D. Réalité chiffrée

- 6 extractions → **747 → ~600 lignes**. La cible **420 n'est PAS atteinte** par ces seules
  extractions. Honnêteté sur l'écart (corrige l'optimisme de §5).
- Pour viser 420 (**Phase 4, optionnelle, hors scope immédiat**): sortir
  `createStore` / `_scheduleDrift` / `upgradeIdb` → `machine/machineStore.ts`, et
  `createInstance` / `instance` / `instanceRegistry` → `machine/machineInstance.ts`.
  À ne faire qu'après stabilisation des PR1-6.

### E. Garde-fous (bloquants avant merge)

- Tests-first sur zones à couverture 0 : **`boot+onDrift` (PR1)** et **`menu` snapshot (PR6)**.
- Après chaque PR: `pnpm run check` (0 erreur) + `pnpm run test` vert.
- **Invariant 11 (CLAUDE.md)**: les nouveaux modules importent en `$lib/...` / relatif, jamais
  `@medyll/idae-machine`. Imports `type` inclus.
- Aucun nouveau `this.store()` ni parse DOM ne doit rester dans `machine.ts` en fin de PR6.

### F. Hors scope — à tracker séparément

- **Nav hook hardcodé** (Kimi §7): l'écriture `appuser_activity`/`appuser_history` à chaque
  navigation est du traçage comportemental câblé en dur. Devrait être *policy-gated* / optionnel.
  Noté ici, **non traité** dans ce refactor (changement de comportement ≠ extraction). À ouvrir
  comme ticket dédié après les PR1-6.

---

_Revue finale par Claude (Opus 4.8). Toujours zéro code modifié — ce document est le plan d'exécution._
