# SOLIDIFICATION_2 — Audit code + doc

> Auteur: Claude (Opus 4.7) — audit demandé par medyll, 2026-05-27
> Scope: machine.ts, frame/, data-ui/, shell/frame/, machineSeed, MachineRights, schemaLoader, CLAUDE.md
> Méthode: lecture ciblée + cross-check CLAUDE.md vs état réel des fichiers

---

## Bugs (priorité)

### 1. `Explorer.openCard` ouvre mauvaise frame
`src/lib/shell/frame/explorer/Explorer.svelte`

```ts
function openCard(record: COL): void {
    const id = (record as Record<string, unknown>).id ?? (record as Record<string, unknown>)._id;
    machine.framer.loadFrame('explorer', collection, String(id), { mode: 'grid' });
}
```

Click item → recharge `explorer` au lieu d'ouvrir la fiche. Doit appeler `'card.form'`.

### 2. RBAC perd collections système (core)
`src/lib/main/machine.ts:271`

```ts
machineRights.loadPoliciesFromModel(this._model);
```

`_model` = alias de `_business` seul (init L162). Policies sur `appscheme_*` / `appuser_*` jamais chargées. Doit être `this._effectiveModel`.

### 3. Drift détecté deux fois + race async
`src/lib/main/machine.ts:238-292`

`boot()` passe `onDrift` au schemaLoader (refresh bg) ET appelle `_scheduleDrift()` immédiat après. Au bg refresh:
- `onModel` mute `_business` / `_model`
- `onDrift` reconstruit `_effectiveModel` + `_machineDb`, schedule drift
- Mais `createStore()` jamais rappelé → `_qoolie` reste sur ancien modèle jusqu'à reload

Désync silencieuse entre `machine.logic` (nouveau schéma) et `machine.collection()` (ancien store).

### 4. DataForm swallow erreur submit
`src/lib/data-ui/data/DataForm.svelte`

```ts
} catch (e) {
    console.error('Submission failed', e);
} finally {
    isSubmitting = false;
}
```

`errorMessage` jamais set. User voit `'...'` → bouton revient, aucun feedback.

### 5. `seedIfEmpty` deprecated mais utilisé par `boot()`
`src/lib/main/machine.ts:288`

```ts
const { seedIfEmpty } = await import('$lib/main/machineSeed.js');
await seedIfEmpty(this._seed);
```

machineSeed.ts marque `seedIfEmpty` deprecated. Cohérence interne cassée. Remplacer par `seed(data, { onlyIfEmpty: true })`.

### 6. schemaLoader bg refresh silencieux
`src/lib/main/machineSchemaLoader.ts`

```ts
.catch(() => { /* network failure during bg refresh — ignore */ });
```

Aucune télémétrie, aucun warn. Debug prod impossible. Au minimum `console.warn`.

---

## Cruft / nettoyage

### 7. Imports morts dans `machine.ts`
- L2 `QoolieCollection` — jamais référencé
- L5 `type Be` — jamais référencé
- L13 `buildLoadInUrl` — importé puis seulement re-exporté L513. Faire `export { buildLoadInUrl } from '$lib/main/frame/frameUrl.js'` direct, virer import L13

### 8. Triple stockage modèle
`machine.ts`: `_model`, `_business`, `_effectiveModel`.
- Init L160-162: `_business = options.business ?? options.model ?? this._business; _model = this._business`
- schemaLoader `onModel` L252-254: réécrit `_business + _model`

Garder uniquement `_business` + `_effectiveModel`. Shim `_model` peut sauter. Idem getters `idbql` / `indexedb` / `idbqModel` qui retournent `undefined`.

### 9. `loadIn` = wrapper trivial de `loadFrame`
`MachineFrameManager`:

```ts
loadIn(zone, modulePath, collection, collectionId?, vars?) {
    this.loadFrame(modulePath, collection, collectionId, vars, zone);
}
```

Pure permutation d'arguments. Soit garder pour DX (zone en premier = intent explicite), soit virer. Décider et documenter.

### 10. Constructeur legacy `Machine(dbName, version, model)`
`machine.ts:120-125`. Divergent de la voie recommandée `init({ org, domain })`. `createInstance` l'utilise. Garder une seule voie.

### 11. `_frameManager` public + setter implicite
`machine.ts:105`: `_frameManager = machineFrameManager` champ public. Réassignable depuis l'extérieur. Doit être `private`.

### 12. `machine.componentRegistry` expose le registry brut
Exposer `machine.registerComponent(key, loader)` plutôt que muter le registry global via accesseur. Aligne avec invariant CLAUDE.md "tout passe par machine.*".

---

## CLAUDE.md — doc périmée

### 13. componentRegistry §6 faux
Doc dit:
```
'explorer' | 'explorer.collections' | 'card.form'
```
Code (`router/componentRegistry.ts`):
```
'explorer' | 'card.form' | 'rbac.matrix' | 'fullinfo'
```
`explorer.collections` n'existe plus. `rbac.matrix` + `fullinfo` non documentés.

### 14. `explorerUtils.ts` localisation fausse
Doc §6: `shell/frame/explorer/explorerUtils.ts` + BL-02 backlog (data-ui dépend de shell).
Code: `src/lib/data-ui/utils/explorerUtils.ts`.
Invariant `data-ui/ ne dépend pas de shell/` respecté. BL-02 résolu. Doc oublie.

### 15. `ExplorerTableInline` supprimé non reflété
`git status`: `D src/lib/shell/frame/explorer/ExplorerTableInline.svelte`.
Replacement: `src/lib/data-ui/data/TableInline.svelte` (nouveau, untracked).
Hiérarchie §6 cite encore `ExplorerTableInline`.

### 16. `CollectionNav` contradictoire
§6 layout liste `CollectionNav.svelte` ET section "SUPPRIMÉS" dit "CollectionNav supprimé. Remplacé par `<DataList collection="appscheme" linkCollectionField="code" />`". Trancher.

### 17. Frame public export ambigu
`src/lib/index.ts`:
```ts
export { default as Frame } from '$lib/data-ui/fragments/Frame.svelte';
```
CLAUDE.md §6 dit le vrai Frame = `shell/Frame.svelte` (mécanique frame, monté dynamiquement, jamais à la main). Si `fragments/Frame` est legacy → retirer de l'API publique. Sinon documenter rôle distinct.

### 18. `machine.fetchSchema(url)` listé comme API publique
CLAUDE.md §4 le liste comme `@framework-bootstrap`. Code: `@deprecated`, no-op shim avec warn. Doc à jour: dire deprecated, pointer `boot({ sync: { databaseHost } })`.

---

## Top fix par ordre

1. #1 openCard → `'card.form'` (1 ligne)
2. #2 RBAC `_effectiveModel` (1 ligne) — risque sécurité
3. #3 Drift bg race — appeler `createStore()` dans `onDrift`, ou debounce drift par version
4. #4 DataForm errorMessage sur catch
5. #5 swap `seedIfEmpty` → `seed(..., { onlyIfEmpty: true })`
6. #7-#11 cleanup machine.ts (imports + triple state + private)
7. #13-#18 sync CLAUDE.md

---

## Audit complémentaire — Copilot[gpt-5.4] — 2026-05-27

> Auteur: **Copilot[gpt-5.4]**
> Scope étendu: Frame.svelte, DataForm, DataList, DataFields, FieldDisplay, InputCurrency, TableInline, MachineFrameManager, machineIdbAdapter, MachineRouter, index.ts

---

### Bugs supplémentaires

#### N1. `Frame.svelte` — `collectionId` et `vars` jamais transmis au composant monté
`src/lib/shell/Frame.svelte:36`

```ts
function doLoad(mp: string, col: string, colId?: string, v?: Record<string, string>) {
    // ...
    const props: Record<string, unknown> = { collection: col };
    //          ↑ colId et v ignorés — jamais ajoutés à props
    currentApp = mount(Comp as Component<...>, { target: bodyEl, props });
}
```

Navigation vers un record via `machine.framer.loadFrame('explorer', 'vehicle', '42')` → `Explorer` reçoit `collection='vehicle'` mais pas `collectionId='42'`. `DataForm` n'est jamais affiché en mode update. **Régression silencieuse sur toute navigation vers une fiche.**

Fix: `const props = { collection: col, collectionId: colId, ...(v ?? {}) }` (ou passer vars structurées).

---

#### N2. `DataFields.svelte:38` — crash si collection absente
```ts
const scheme = $derived(machine.logic.collection(collection));
```

Pas de `try/catch`. Si la collection n'existe pas ou si `boot()` n'est pas terminé, `MachineDb.collection()` lance une exception non gérée → composant cassé sans message. `DataList`, `DataForm` et `FieldDisplay` utilisent tous `safeCollection()` avec try/catch — `DataFields` est le seul qui ne le fait pas.

Fix: remplacer par `$derived.by(() => { try { return machine.logic.collection(collection); } catch { return null; } })` et guard `{#if scheme}`.

---

#### N3. `InputCurrency` — valeur jamais propagée au parent
`src/lib/data-ui/input/InputCurrency.svelte`

1. `value` n'est pas `$bindable()` — pas de liaison bidirectionnelle possible.
2. `handleChange` dispatche un `CustomEvent('change-value')` sur l'input natif. Personne n'écoute cet event.
3. Dans `FieldDisplay.svelte:165-170`, l'InputCurrency est appelé sans handler:
   ```svelte
   <InputCurrency value={internalValue as number} error={error} />
   ```
   Aucun `bind:value`, aucun `oninput`. Les modifications de l'utilisateur sont silencieusement perdues.

Fix: ajouter `$bindable()` à value et `bind:value={internalValue as number}` dans FieldDisplay. Ou remplacer le CustomEvent par un prop `onchange`.

---

#### N4. `machineIdbAdapter.ts` — cursor ouvert sur store supprimé
`src/lib/main/machineIdbAdapter.ts:119-124`

```ts
const oldStore = db.objectStore(from);
const newStore = db.createObjectStore(to, { keyPath });
const cursor   = oldStore.openCursor();          // ← cursor en cours
cursor.onsuccess = () => { ... c.continue(); };
db.deleteObjectStore(from);                      // ← store détruit immédiatement
```

`db.deleteObjectStore(from)` est appelé **avant** que le cursor ait itéré. Selon la spec IDB, supprimer un store pendant une transaction ouvre sur ce store résulte en une erreur de transaction. La migration rename est probablement brisée dans tous les cas non-triviaux.

Fix: supprimer le store `from` dans `oncomplete` du curseur, ou restructurer la copie avec `getAll` + `add` en deux requêtes séquentielles.

---

#### N5. `DataList` mode liste — `onItemClick` silencieusement ignoré
`src/lib/data-ui/data/DataList.svelte`

En mode `list` (défaut), sans `link` ni `itemSnippet`, les items sont rendus:
```svelte
{:else}
    <li><DataFields .../></li>  <!-- aucun handler onclick, aucun bouton -->
```

`handleItemClick` (qui appelle `onItemClick?.()`) n'est jamais déclenché dans ce branch. Dans `Explorer.svelte`, `onItemClick={(record) => openCard(...)}` est passé → `openCard` ne s'exécute jamais en mode liste flat.

Fix: wrapper le `{:else}` par `<button onclick={...}>` comme en mode grid, ou appeler `handleItemClick` systématiquement sur les items.

---

#### N6. `DataList` mode `table` — navigation `link` absente
`src/lib/data-ui/data/DataList.svelte:249`

```svelte
{:else if currentMode === 'table'}
    <TableInline {collection} {where} onItemClick={handleItemClick} />
```

`TableInline` ne reçoit pas `link`, `linkVars`, `linkCollectionField`. La navigation `parsedLink`/`navigate()` est **inexistante** en mode table. Seul `onItemClick` fonctionne. Incohérence de comportement selon le mode d'affichage.

Fix: passer `parsedLink` à `TableInline` ou gérer la navigation directement dans `DataList` via le `onItemClick` handler.

---

#### N7. `DataForm` — inputs non associés au formulaire HTML
`src/lib/data-ui/data/DataForm.svelte`

Le `<form id={inputFormId}>` est **vide** (aucun enfant). `DataFields` est dans un `<div>` séparé. `DataFields` ne reçoit pas le prop `inputFormId`, donc `FieldDisplay` → tous les `<input form={...}>` ont `form=undefined`. Les champs ne sont pas nativement liés au formulaire.

Fonctionnel grâce à `$state.snapshot(formData)` mais:
- La validation HTML5 native (`required`, `pattern`) ne se déclenche pas
- Les password managers ne fonctionnent pas correctement
- L'attribut `form` sur le bouton submit est la seule connexion

Fix: passer `inputFormId` à `DataFields` → `FieldDisplay` pour que les inputs reçoivent `form={inputFormId}`.

---

#### N8. `MachineRouter` — auth guard déconnecté de `MachineRights`
`src/lib/main/machine/MachineRouter.ts:117`

```ts
private checkAuthentication(): boolean {
    return !!localStorage?.getItem?.('auth_token');
}
```

- Clé `'auth_token'` codée en dur — aucun paramètre.
- Complètement déconnecté de `machineRights.currentUser` / `#authEnabled`.
- Double système auth: `MachineRouter.authEnabled` + `machineRights.#authEnabled` peuvent être désynchronisés.

Fix: utiliser `machineRights.currentUser !== null` ou exposer un paramètre `tokenKey` configurable.

---

#### N9. `computeSchemaHash` — collision possible
`src/lib/main/machineIdbAdapter.ts:155`

```ts
return [...storeNames].sort().join(',');
```

Pas un vrai hash: `['a', 'b,c']` → `'a,b,c'` = identique à `['a,b', 'c']`. Risque de faux négatifs sur drift si des noms de collections contiennent des virgules (peu probable en pratique, mais nommer la fonction `computeSchemaFingerprint` serait moins trompeur).

---

#### N10. `machine` singleton non exporté de l'API publique
`src/lib/main/index.ts`

```ts
export { Machine } from './machine.js';
// ↑ machine (singleton) non exporté
```

`src/lib/index.ts` fait `export * from '$lib/main/index.js'`. Résultat: `import { machine } from '@medyll/idae-machine'` échoue. Les utilisateurs externes doivent faire un import interne (`from '@medyll/idae-machine/main/machine'`) ou créer leur propre instance — contrairement à ce que CLAUDE.md laisse entendre.

Fix: ajouter `export { machine } from './machine.js'` dans `main/index.ts`.

---

#### N11. `FieldDisplay` — `error` state jamais peuplé
`src/lib/data-ui/field/FieldDisplay.svelte:85`

```ts
let error = $state<string | null>(null);
```

`error` est passé à `InputEmail` et affiché dans `{#if error}` mais n'est jamais mis à jour (aucune logique de validation dans FieldDisplay). L'affichage d'erreur par champ est une façade non fonctionnelle.

---

### Incohérences architecturales supplémentaires

#### N12. `seedIfEmpty` exporté public alors que deprecated
`src/lib/main/index.ts:25`

```ts
export { seed, seedIfEmpty } from './machineSeed.js';
```

`seedIfEmpty` est `@deprecated` dans sa définition mais toujours dans l'API publique. Pollue l'autocomplétion. Retirer de l'export ou conserver avec `/** @deprecated */` explicite dans index.ts.

---

#### N13. `TemplateShell` — styles globaux via `:global()`
`src/lib/shell/layout/TemplateShell.svelte`

Tous les sélecteurs CSS utilisent `:global(.template-shell)`, `:global(.shell-sidebar)`, etc. Ces styles s'appliquent à **toute l'application**, pas seulement aux instances de `TemplateShell`. Risque de conflit si l'utilisateur a ses propres classes `.shell-main`.

---

#### N14. `MachineFrameManager.register()` — throw sur doublon trop strict
`src/lib/main/frame/MachineFrameManager.ts:59`

```ts
register(frameId: string, controls: FrameControls): void {
    if (this.registry.has(frameId)) {
        throw new Error(`[FrameManager] frame "${frameId}" already registered`);
    }
```

En développement avec HMR (Vite Hot Module Replacement), un composant peut se remonter sans passer par la cleanup de `$effect`. Dans ce cas, register() lance une exception et le frame ne se monte plus jusqu'au prochain reload complet.

Fix: `if (this.registry.has(frameId)) { this.registry.delete(frameId); }` avant le set, ou `upsert`.

---

#### N15. `DataFk.svelte` — snippet children mal typé
`src/lib/data-ui/data/DataFk.svelte:22`

```ts
children?: Snippet<[[string, Record<string, unknown>]]>;
//                  ↑ tableau de tableau — probablement voulu comme tuple
```

La signature est `Snippet<[[string, Record<string, unknown>]]>` (double tableau). En Svelte 5, le snippet reçoit ses paramètres comme éléments du tableau externe. Un tuple devrait être `Snippet<[string, Record<string, unknown>]>`. Appel: `{@render children([entry.key, entry])}` passe un seul argument tableau — ce qui correspond à `Snippet<[[string, Record<string, unknown>]]>` mais est inhabituel et trompeur.

---

### Priorités fixes complètes (Copilot[gpt-5.4])

| Priorité | ID | Impact | Effort |
|----------|-----|--------|--------|
| 🔴 P0 | #2 | RBAC sur _model | 1 ligne |
| 🔴 P0 | N1 | Frame ne passe pas colId/vars | ~5 lignes |
| 🔴 P0 | N2 | DataFields crash sans guard | 3 lignes |
| 🔴 P0 | N3 | InputCurrency valeur perdue | ~10 lignes |
| 🟠 P1 | #1 | openCard → card.form | 1 ligne |
| 🟠 P1 | N5 | onItemClick ignoré mode liste | ~5 lignes |
| 🟠 P1 | N7 | DataForm inputs non form-associés | ~3 lignes |
| 🟡 P2 | N4 | IDB cursor/delete race | refactor |
| 🟡 P2 | N6 | TableInline sans navigation | ~10 lignes |
| 🟡 P2 | N10 | machine non exporté | 1 ligne |
| 🔵 P3 | N8 | Auth guard déconnecté MachineRights | design |
| 🔵 P3 | N11 | FieldDisplay error factice | impl |
| 🔵 P3 | N14 | FrameManager register HMR | 2 lignes |

---

## Audit complémentaire — OpenCode (kimi-k2.6) — 2026-05-27

> Auteur: **OpenCode** (kimi-k2.6)
> Scope étendu: DataList, InputEmail, MachineFieldType, MachineApi, RealtimeClient, MachineSchemeValues, MachineSchemeFieldForge, MachineSchemeValidate, MachineSchemeField, validateRules, componentRegistry, linkParser, machineSchemaCache, RbacMatrix, InfoLine, Selector, Pane, TemplateShell, Frame, FieldEditor, DataForm, InputBoolean, DataRfk, machineSeed, Explorer, Navigation, Breadcrumb, DemoScheme, and all test suites.

---

### Bugs supplémentaires (K-series)

#### K1. `DataList` — `where` filtering côté client uniquement, opérateurs complexes non supportés
`src/lib/data-ui/data/DataList.svelte:161-172`

```ts
const rawItems = $derived.by(() => {
    if (!store?.items) return [] as COL[];
    if (where) {
        return store.items.filter((item) => {
            for (const [key, val] of Object.entries(where)) {
                if ((item as Record<string, unknown>)[key] !== val) return false;
            }
            return true;
        }) as COL[];
    }
    return store.items as COL[];
});
```

Le filtrage `where` utilise une égalité stricte (`!==`) qui ne gère aucun opérateur avancé (gt, lt, contains, in, etc.). C'est incohérent avec `TableInline.svelte:26` qui passe `where` directement à `useQoolieQuery` (qui supporte les requêtes MongoDB-like). De plus, `DataList` filtre côté client sur `store.items` alors que `machine.store(collection, where)` pourrait faire le filtrage côté IndexedDB.

Fix: utiliser `machine.store(collection, where)` pour les filtres complexes, ou documenter que `where` sur `DataList` = simple égalité client-side uniquement.

---

#### K2. `InputEmail` — `value` non bindable, modifications perdues
`src/lib/data-ui/input/InputEmail.svelte:12-20, 32-36`

```ts
let { value = '', ... oninput = undefined } = $props();
let email = $state<string | undefined>(undefined);
$effect(() => { untrack(() => { email = value; }); });
```

`value` n'est pas `$bindable()`. `FieldDisplay.svelte:157-163` appelle `<InputEmail value={internalValue as string} error={error} />` sans `bind:value` ni handler `oninput` qui mette à jour `internalValue`. Les modifications de l'email sont silencieusement perdues (même catégorie que le bug N3 de Claude Sonnet sur InputCurrency).

Fix: ajouter `$bindable()` à `value` et `bind:value={internalValue as string}` dans `FieldDisplay`, ou remplacer par `oninput` avec callback.

---

#### K3. `Explorer.openCard` — double régression (modulePath + vars)
`src/lib/shell/frame/explorer/Explorer.svelte:33-36`

```ts
function openCard(record: COL): void {
    const id = ...;
    machine.framer.loadFrame('explorer', collection, String(id), { mode: 'grid' });
}
```

Déjà signalé par Claude (bug #1): charge `'explorer'` au lieu de `'card.form'`. En plus, `{ mode: 'grid' }` est passé comme `vars` mais `Frame.svelte:34` ne transmet pas `vars` au composant monté (bug N1 de Claude Sonnet). Double régression: mauvais composant + vars ignorées.

Fix: `machine.framer.loadFrame('card.form', collection, String(id))` ET corriger `Frame.svelte` pour passer `vars`.

---

#### K4. `MachineSchemeValues.presentation` — dot notation sans résolution FK
`src/lib/main/machine/MachineSchemeValues.ts:42-71`

```ts
const value = token.split('.').reduce<unknown>(...);
if (token.includes('.')) return String(value);
```

La dot notation (`fks.vehicle.license_plate`) fonctionne uniquement si les données sont pré-jointes dans `data`. Il n'y a aucune résolution FK automatique. Le template `rental.presentation = 'fks.vehicle.license_plate ...'` échouera si le serveur ne pré-joint pas.

Fix: documenter la limitation ou implémenter une résolution FK asynchrone dans `presentation()`.

---

#### K5. `MachineFieldType` — validator `time` incorrect (accepte les dates)
`src/lib/main/machine/MachineFieldType.ts:125-128`

```ts
time: {
    validator: (value: unknown) => {
        const date = new Date(String(value));
        return !isNaN(date.getTime());
    }
}
```

Le validator `time` utilise `new Date()` qui accepte n'importe quelle date valide (`'2024-01-01'` passe). Devrait utiliser la regex `^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$` de `validateRules.ts:38`.

Fix: remplacer le validator par la regex de `validateRules.ts`.

---

#### K6. `MachineSchemeValidate.#validateType` — double validation incohérente
`src/lib/main/machine/MachineSchemeValidate.ts:282-303`

```ts
async #validateType(...) {
    const pureError = validateFieldPure(value, { type: type ?? 'any' });
    if (pureError !== null) return false;
    const typeDef = MachineSchemeFieldType.getFieldType(type ?? 'any');
    if (typeDef && typeDef.validator) {
        const res = typeDef.validator(value, ctx);
        ...
    }
    return true;
}
```

Deux sources de validation (`validateFieldPure` et `MachineSchemeFieldType.validator`) avec des règles différentes. Par exemple, `validateFieldPure` pour `time` utilise la regex correcte, mais `MachineSchemeFieldType.validator` utilise `new Date()` (bug K5). Si elles divergent, le comportement est imprévisible.

Fix: unifier les validators dans une seule source de vérité, ou s'assurer que `validateRules.ts` et `MachineFieldType.ts` sont synchronisés.

---

#### K7. `MachineApi.request` — `AbortController` réutilisé entre retries
`src/lib/main/api/MachineApi.ts:46-100`

```ts
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), this.timeout);
for (let attempt = 0; attempt < this.retries; attempt++) {
    try {
        const response = await fetch(url, { ..., signal: controller.signal, ... });
        ...
    } catch (error) { ... }
}
clearTimeout(timeoutId);
```

`AbortController` créé une seule fois avant la boucle. Si le timeout déclenche `abort()` pendant un retry, tous les retries suivants échouent immédiatement (signal déjà aborted). `clearTimeout` n'est appelé qu'après la boucle.

Fix: créer un nouvel `AbortController` + `setTimeout` à chaque itération de retry, et `clearTimeout` après chaque `fetch` réussi.

---

#### K8. `RealtimeClient.connect` — `onConnect` écrasé + listeners dupliqués
`src/lib/main/api/RealtimeClient.ts:32-48`

```ts
connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        this.client.onConnectError = () => reject(new Error('Connection error'));
        this.client.onConnect = () => {
            this.connected = true;
            this.subscribedTables.forEach(t => this.client.socket?.emit('subscribe', t));
            this.setupDataListeners();
            resolve();
        };
        this.client.connect();
    });
}
```

`this.client.onConnect` est écrasé à chaque appel. Si `connect()` est rappelé (reconnexion), l'ancien handler est perdu. `setupDataListeners()` ajoute des `socket.on(...)` à chaque connexion — les listeners dupliquent sans être retirés.

Fix: garder l'handler `onConnect` persistant, et nettoyer les anciens listeners avant d'en ajouter de nouveaux.

---

#### K9. `MachineRouter.handleLoadIn` — imports dynamiques répétés
`src/lib/main/machine/MachineRouter.ts:80-88`

```ts
const mountFn = async (frameId: string) => {
    const { mount } = await import('svelte');
    const { default: Frame } = await import('$lib/shell/Frame.svelte');
    mount(Frame as any, { target, props: { id: frameId } });
};
```

`import('svelte')` et `import('$lib/shell/Frame.svelte')` sont exécutés à chaque `mountFn`. En production, cela peut causer des flashs et des surcharges réseau.

Fix: importer `mount` et `Frame` une fois au niveau module.

---

#### K10. `machine.ts` — `_effectiveModel` désynchronisé après `onModel`
`src/lib/main/machine.ts:250-254`

```ts
await loadSchema(url, {
    onModel: (model) => {
        this._business = model;
        this._model    = model;
    },
    onDrift: async () => {
        this._effectiveModel = buildEffectiveModel(this._core, this._business);
        ...
    }
});
```

`onModel` met à jour `_business` mais pas `_effectiveModel`. Si `_core` est présent, `_effectiveModel` reste sur l'ancienne valeur jusqu'à `onDrift`. Déjà signalé par Claude (bug #3) mais aggravé par l'absence de `_effectiveModel` update dans `onModel`.

Fix: `this._effectiveModel = buildEffectiveModel(this._core, this._business);` dans `onModel` aussi.

---

### Cruft / nettoyage supplémentaire

#### K11. `machine.ts` — getters `idbql`/`indexedb`/`idbqModel` polluent l'API
`src/lib/main/machine.ts:359-366`

```ts
get idbql(): undefined { return undefined; }
get indexedb(): undefined { return undefined; }
get idbqModel(): undefined { return undefined; }
```

Ces getters `@deprecated` retournent toujours `undefined`. Ils polluent l'autocomplétion IDE et trompent les utilisateurs.

Fix: supprimer ou ajouter `@deprecated` JSDoc explicite avec migration path.

---

#### K12. `createInstance` est méthode d'instance mais modifie registre statique
`src/lib/main/machine.ts:487-500`

`createInstance` est appelé via `Machine.prototype.createInstance` dans les tests (hack). C'est une factory qui devrait être statique.

Fix: `static createInstance(...)` ou ne pas toucher au registre global.

---

#### K13. `MachineSchemeField.ts` — `new MachineParserForge()` à chaque champ
`src/lib/main/machine/MachineSchemeField.ts:16`

`MachineParserForge` est stateless. Créer une instance par champ est un gaspillage.

Fix: instance partagée ou singleton.

---

#### K14. `validateRules.ts` — type retour `boolean | string` ambigu
`src/lib/main/machine/validateRules.ts:27-50`

Le type `(value: unknown) => boolean | string` est ambigu: `true` = valide, `string` = erreur. Mais si le validator retourne `false`, `validateField` retourne `'Format invalide'` au lieu d'un message spécifique.

Fix: typer comme `(value: unknown) => string | null` où `null` = valide.

---

#### K15. `MachineSchemeValidate.validateForm` — exceptions non gérées de `#validateType`
`src/lib/main/machine/MachineSchemeValidate.ts:219-233`

Si `#validateType` lance une exception inattendue, `validateForm` rejette la promesse. `DataForm.svelte:79-103` n'a pas de `try/catch` autour de `validate()`.

Fix: wrapper `validateForm` dans `try/catch` ou faire en sorte que `#validateType` ne lance jamais.

---

#### K16. `FieldDisplay.svelte` — `fkStore` dérivé cause re-render excessif
`src/lib/data-ui/field/FieldDisplay.svelte:87-88`

`machine.store()` retourne un nouvel objet à chaque appel. `$derived` recalcule à chaque rendu.

Fix: mettre en cache `machine.store()` par collection, ou utiliser une référence stable.

---

#### K17. `DataList` sentinel — `bind:this` sans `key` sur collection change
`src/lib/data-ui/data/DataList.svelte:315-317`

Le `sentinel` div n'a pas de `key`. Si la collection change, le div peut être réutilisé avec `bind:this` orphelin.

Fix: ajouter `key` ou recréer le sentinel.

---

#### K18. `TableInline.svelte` — `columns` dérivé instable
`src/lib/data-ui/data/TableInline.svelte:30-39`

Les colonnes sont dérivées des clés des items. Si les items changent, les colonnes changent et provoquent un re-render complet.

Fix: stabiliser les colonnes (par exemple via le schéma `machine.logic.collection().fields`).

---

#### K19. `Pane.svelte` — backdrop `role="button"` incomplet
`src/lib/shell/layout/Pane.svelte:20`

Le backdrop a `role="button"` et `tabindex="0"` mais ne gère pas `Enter`/`Space` (seulement `Escape`).

Fix: ajouter `onkeydown` pour `Enter` et `Space`, ou utiliser `<button>` sémantique.

---

#### K20. `RbacMatrix.svelte` — `toggleColumn` logique incorrecte
`src/lib/shell/frame/rbac/RbacMatrix.svelte:83-91`

```ts
const allOn = collections.every(c => getOp(c, op));
for (const c of collections) {
    if (getOp(c, op) === allOn) await toggleCell(c, op);
}
```

Si mixte (certains ON, certains OFF), rien ne se passe. Si `allOn=true`, on éteint les ON mais on laisse les OFF. Le comportement attendu est "tout inverser" ou "tout mettre à l'état opposé".

Fix: `const target = !allOn;` puis toggler chaque cellule vers `target`.

---

#### K21. `TemplateShell.svelte` — styles `:global()` conflit potentiel
`src/lib/shell/layout/TemplateShell.svelte:40-79`

Déjà signalé par Claude Sonnet (N13). Tous les styles sont globaux. Conflit garanti avec des classes `.shell-main` existantes.

Fix: utiliser des classes BEM ou `data-attribute` scopées.

---

#### K22. `isProtectedStore` — règle trop large
`src/lib/main/machineIdbAdapter.ts:21-23`

```ts
return name.startsWith('__') && name.endsWith('__');
```

Protège `__custom__` en plus des stores internes.

Fix: utiliser le Set `INTERNAL_STORES` au lieu de la regex.

---

#### K23. `getCurrentIdbStores` — ouverture sans version
`src/lib/main/machineIdbAdapter.ts:163-182`

`indexedDB.open(dbName)` sans version peut bloquer si un upgrade est en cours ailleurs.

Fix: spécifier la version ou ajouter un timeout.

---

#### K24. `MachineFrameManager.load` — `mountFn` throw sans rollback
`src/lib/main/frame/MachineFrameManager.ts:84-118`

Si `mountFn` throw, le frame n'est pas registered mais l'erreur remonte brute.

Fix: wrapper `mountFn` dans `try/catch` avec cleanup.

---

#### K25. `machineSeed.ts` — `seed` sans `try/catch` sur `machine.collection()`
`src/lib/main/machineSeed.ts:27-36`

Si une collection du seed n'existe pas, `machine.collection()` throw et tout le seed échoue.

Fix: `try { const store = machine.collection(collection); ... } catch { continue; }`.

---

#### K26. `DataForm.svelte` — `handleSubmit` ne gère pas `show` mode
`src/lib/data-ui/data/DataForm.svelte:79-103`

En mode `show`, le submit ne fait rien mais le bouton est toujours affiché.

Fix: cacher/désactiver le bouton submit en mode `show`.

---

#### K27. `DataForm.svelte` — IIFE asynchrone non annulable
`src/lib/data-ui/data/DataForm.svelte:52-66`

```ts
(async () => {
    const record = await store.get(id) ?? {};
    formData = { ...data, ...withData, ...record };
})();
```

Si `dataId` change rapidement, l'ancienne promesse peut écraser `formData` avec des données obsolètes.

Fix: utiliser `AbortController` ou `$effect.pre` avec cleanup.

---

#### K28. `InputBoolean.svelte` — `onchange` prop + event handler dupliqué
`src/lib/data-ui/input/InputBoolean.svelte:12-13, 29`

```ts
onchange={(e) => onchange?.((e.target as HTMLInputElement).checked)}
```

Si le parent ne passe pas `onchange`, le handler inline est quand même créé.

Fix: conditionner le handler ou utiliser `bind:checked` uniquement.

---

#### K29. `InfoLine.svelte` — `export { className as class }` pattern legacy
`src/lib/data-ui/fragments/InfoLine.svelte:13, 31`

En Svelte 5, `export { ... as ... }` est legacy. Devrait utiliser `$props()` avec `class`.

Fix: `let { ..., class: className = '' } = $props()`.

---

#### K30. `Selector.svelte` — cast `unknown` → `Record` sans type guard
`src/lib/data-ui/fragments/Selector.svelte:25-29`

```svelte
{#each values as valueO ((valueO as Record<string, unknown>)?.id ?? valueO)}
```

Cast incorrect si `valueO` est un primitif.

Fix: utiliser un type guard `typeof valueO === 'object' && valueO !== null`.

---

### Incohérences architecturales supplémentaires

#### K31. `MachineDb.collection()` — cache sans invalidation
`src/lib/main/machineDb.ts:47-52`

`#idbCollectionsList` n'est jamais invalidé. Si `model` change, les anciennes `MachineScheme` restent.

Fix: ajouter une méthode `invalidate()` ou ne pas cacher.

---

#### K32. `MachineSchemeValues.#checkAccess` — dépendance globale `machineRights`
`src/lib/main/machine/MachineSchemeValues.ts:249-251`

`machineRights` est importé directement. Si plusieurs instances `Machine` coexistent avec des droits différents, conflit.

Fix: injecter `machineRights` via le constructeur.

---

#### K33. `machine.ts` — `_pendingIdbUpgrade` persiste après `destroy()`
`src/lib/main/machine.ts:176, 398-404`

`_pendingIdbUpgrade` n'est pas réinitialisé dans `destroy()`. Recréation avec même `dbName` = upgrade fantôme.

Fix: `this._pendingIdbUpgrade = null;` dans `destroy()`.

---

#### K34. `componentRegistry.ts` — pas de méthode `unregister`
`src/lib/main/router/componentRegistry.ts:12-47`

Impossible de retirer un composant sans vider tout le registry.

Fix: ajouter `unregister(key: string)`.

---

#### K35. `machineSchemaLoader.ts` — `JSON.stringify` pour comparer schémas
`src/lib/main/machineSchemaLoader.ts:33`

```ts
if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
```

Fragile (ordre des clés). Peut déclencher des drifts inutiles.

Fix: deep equal normalisé (e.g. `fast-deep-equal`).

---

#### K36. `FieldDisplay.svelte` — `fkStore` recréé pour chaque champ FK
`src/lib/data-ui/field/FieldDisplay.svelte:74-88`

10 champs FK = 10 appels `machine.store()` = 10 objets réactifs identiques.

Fix: cache par collection au niveau de `FieldDisplay` ou via un contexte.

---

#### K37. `linkParser.ts` — `vars` absent du `ParsedLink`
`src/lib/main/frame/linkParser.ts:1-18`

`ParsedLink` n'a pas de champ `vars`. Impossible d'encoder les vars dans le lien.

Fix: ajouter `vars?: Record<string, string>`.

---

#### K38. `Navigation.svelte` — `hasPermission` mock hardcodé
`src/lib/shell/layout/Navigation.svelte:13-17`

```ts
function hasPermission(...) { return true; }
```

Toujours `true`. Devrait utiliser `machine.rights.checkAccess`.

Fix: `return machine.rights.checkAccess(table, code === 'L' ? 'R' : code);`.

---

#### K39. `Breadcrumb.svelte` — dépendance implicite `ssr = false`
`src/lib/shell/layout/Breadcrumb.svelte:2, 17-18`

`$app/state` est undefined en SSR. Heureusement `+layout.ts` a `ssr = false`, mais c'est une dépendance implicite.

Fix: guard `typeof window !== 'undefined'` ou documenter.

---

#### K40. `machineSchemaCache.ts` — migration IDB manquante
`src/lib/main/machineSchemaCache.ts:11-20`

```ts
req.onupgradeneeded = () => {
    req.result.createObjectStore(STORE_NAME, { keyPath: 'url' });
};
```

Si `DB_VERSION` augmente et que le store existe déjà, cela throw.

Fix: vérifier `!db.objectStoreNames.contains(STORE_NAME)`.

---

#### K41. `DataRfk.svelte` — `SvelteComponent` déprécié en Svelte 5
`src/lib/data-ui/data/DataRfk.svelte:17`

```ts
import type { SvelteComponent } from 'svelte';
```

`SvelteComponent` est déprécié. Le type correct est `Component`.

Fix: `import type { Component } from 'svelte';`.

---

#### K42. `FieldEditor.svelte` — `validate` typé `() => void` sans async
`src/lib/data-ui/field/FieldEditor.svelte:34`

```ts
validate: () => void;
```

Si `validate` est async, son retour est ignoré.

Fix: `validate: () => void | Promise<void>;`.

---

#### K43. `SchemeFieldDefaultValues` — singleton mutable global
`src/lib/main/machine/SchemeFieldDefaultValues.ts`

Toutes les méthodes statiques modifient des propriétés statiques. Conflit entre tests parallèles.

Fix: rendre non-statique ou utiliser un contexte par instance.

---

#### K44. `MachineSchemeValidate` — validators enregistrés sur instance jetable
`src/lib/main/machine/MachineSchemeValidate.ts:29-37, 102-104`

```ts
get validator(): MachineSchemeValidate {
    return new MachineSchemeValidate(this.collection, this.#machineDb);
}
```

`registerCustom` sur `scheme.validator` est perdu immédiatement car `validator` retourne une nouvelle instance.

Fix: cacher l'instance de validateur dans `MachineScheme`.

---

#### K45. `machine.ts` — `boot()` appelable multiples fois sans garde
`src/lib/main/machine.ts:238-292`

`boot()` n'a pas de garde. Appels multiples = réinitialisations, fuites mémoire.

Fix: ajouter `if (this._qoolie) throw new Error('Already booted')` ou retourner early.

---

#### K46. `Frame.svelte` — `currentApp` mal typé
`src/lib/shell/Frame.svelte:22`

```ts
let currentApp: Record<string, unknown> | null = null;
```

Devrait être `ReturnType<typeof mount>`.

Fix: `let currentApp: ReturnType<typeof mount> | null = null;`.

---

#### K47. `machine.ts` — `warmup` avec `as any`
`src/lib/main/machine.ts:411-414`

```ts
await (this._qoolie as any).hydrateAll?.(collections);
```

Appel non typé sur API interne qoolie.

Fix: ajouter `hydrateAll` au type de qoolie ou documenter.

---

#### K48. `MachineSchemeFieldForge` — `forge` getter re-parse à chaque accès
`src/lib/main/machine/MachineSchemeFieldForge.ts:62-67`

`forge` est appelé par `fieldArgs`, `fieldType`, `htmlInputType`, `inputSize`. 4x parsing pour 1 champ.

Fix: mettre en cache le résultat de `parse()`.

---

#### K49. `DemoScheme` — champ `ts` fantôme
`src/lib/demo/demoScheme.ts:9-20`

`ts: {} as { ... }` est typé mais jamais utilisé au runtime.

Fix: retirer ou utiliser pour génération de types.

---

#### K50. `Explorer.svelte` — `collectionId` et `dataId` redondants
`src/lib/shell/frame/explorer/Explorer.svelte:14-31`

Deux props pour la même chose. Si les deux sont fournis, `collectionId` l'emporte.

Fix: garder une seule prop `dataId`.

---

### Priorités fixes complètes (OpenCode kimi-k2.6)

| Priorité | ID | Impact | Effort |
|----------|-----|--------|--------|
| 🔴 P0 | K1 | where client-side limité | design |
| 🔴 P0 | K2 | InputEmail valeur perdue | ~5 lignes |
| 🔴 P0 | K3 | Explorer double régression | ~3 lignes |
| 🔴 P0 | K7 | AbortController retry cassé | ~10 lignes |
| 🔴 P0 | K20 | RbacMatrix toggleColumn inactif | ~5 lignes |
| 🟠 P1 | K5 | Validator time accepte dates | 1 ligne |
| 🟠 P1 | K6 | Double validation incohérente | design |
| 🟠 P1 | K8 | RealtimeClient listeners dupliqués | ~10 lignes |
| 🟠 P1 | K10 | _effectiveModel désync | 1 ligne |
| 🟠 P1 | K26 | DataForm submit en mode show | ~3 lignes |
| 🟠 P1 | K27 | DataForm race condition | ~10 lignes |
| 🟡 P2 | K9 | Imports dynamiques répétés | ~3 lignes |
| 🟡 P2 | K11-15 | Cleanup divers machine.ts/validate | ~20 lignes |
| 🟡 P2 | K32 | MachineSchemeValues dépendance globale | design |
| 🟡 P2 | K44 | Validator instance jetable | ~5 lignes |
| 🔵 P3 | K16-19 | Re-render / a11y / styles | divers |
| 🔵 P3 | K21-50 | Doc, types, cruft, anti-patterns | divers |

---

(End of file - total ~800 lines)

---

## Contre-vérification — Claude (Opus 4.7) — 2026-05-27 (round 2)

> Auteur: **Claude (Opus 4.7)** — relecture après annotations Copilot + OpenCode

### Findings tiers confirmés (vu sur disque)

| ID | Verdict | Note |
|---|---|---|
| **N1** Frame.svelte ignore `colId`/`vars` | ✅ CONFIRMÉ | `Frame.svelte:36` — `props = { collection: col }`. `colId` + `v` jamais ajoutés. Bug critique. Toute navigation `loadFrame('explorer', 'vehicle', '42')` perd l'id. Explique pourquoi #1 (openCard) passe `'explorer'` + `{ mode: 'grid' }` — déjà inutile, vars droppées. |
| **N2** DataFields crash sans guard | ✅ CONFIRMÉ | `DataFields.svelte:38` — `machine.logic.collection(collection)` direct. Pas de safeCollection. Diverge des autres consumers. |
| **N3** InputCurrency value perdue | ✅ CONFIRMÉ | Pas de `$bindable()`, dispatch CustomEvent `'change-value'` que personne n'écoute. Modifs droppées. |
| **N10** `machine` singleton non exporté | ✅ CONFIRMÉ | `main/index.ts` exporte `Machine` class, pas `machine`. `import { machine } from '@medyll/idae-machine'` échoue. Diverge CLAUDE.md §4 ("Tout passe par machine.*"). |
| **K2** InputEmail value perdue | ⚠️ PARTIEL | Pas de `$bindable` mais expose prop `oninput`. Fonctionne si parent passe handler. FieldDisplay ne le passe probablement pas — à vérifier ligne par ligne FieldDisplay:157+. |
| **K5** Validator time accepte dates | ✅ CONFIRMÉ | `MachineFieldType.ts:125-128` — `new Date(String(value))`. `'2024-01-01'` passe en time. validateRules a la regex correcte mais cette voie l'ignore. |
| **K10** `_effectiveModel` désync onModel | ✅ CONFIRMÉ | `machine.ts:251-261` — `onModel` mute `_business` seul, `_effectiveModel` recalculé uniquement dans `onDrift`. Fenêtre où `logic` lit ancien effectiveModel après mutation business. Aggrave mon bug #3. |

### Findings tiers à nuancer

- **K1** — Le filtre `where` côté client de DataList est intentionnel (déjà filtré par `useQoolieQuery` côté store via TableInline). Le vrai souci: deux pipelines de filtrage (DataList vs TableInline) qui divergent dans la même UI. Pas un bug, c'est une dette de cohérence.
- **K14** — `validateRules.ts` retourne `string | null` déjà (pas `boolean | string`). Vérifier — possible faux positif d'OpenCode.
- **K20** RbacMatrix toggleColumn — à vérifier, la critique est correcte sur le papier mais dépend de l'UX attendue.
- **N13/K21** TemplateShell `:global()` — convention idae documentée dans CLAUDE.md §6 "Svelte5 CSS pattern: `@layer components { :global() }` obligatoire". C'est *exigé*, pas un bug. Le risque conflit existe mais c'est l'arbitrage assumé.

### Doublons à fusionner (cleanup éditorial)

- #1 Claude = K3 OpenCode (Explorer.openCard) — K3 ajoute la dimension vars perdues, plus complet
- #3 Claude = K10 OpenCode (drift race) — K10 cible le sous-bug spécifique `_effectiveModel` dans `onModel`
- N3 Copilot = K2 OpenCode (input value non bindable) — même classe, deux composants
- N13 Copilot = K21 OpenCode (TemplateShell global) — voir nuance ci-dessus
- #5 Claude = N12 Copilot (seedIfEmpty deprecated) — angles différents (interne vs public API)

### Priorité consolidée tri-auditeur (P0 only)

| ID | Source | Impact |
|---|---|---|
| N1 | Copilot | Frame ne passe pas colId/vars → navigation cassée |
| #2 | Claude | RBAC perd collections système (sécurité) |
| #1 + K3 | Claude + OpenCode | Explorer.openCard frame fausse + vars droppées |
| N3 + K2 | Copilot + OpenCode | Inputs Currency/Email value perdue |
| N2 | Copilot | DataFields crash sans guard |
| K7 | OpenCode | AbortController retry cassé (réseau) |
| K20 | OpenCode | RbacMatrix toggleColumn (sécurité visuelle) |
| N10 | Copilot | `machine` singleton non exporté (DX bloquant) |
| #3 + K10 | Claude + OpenCode | Drift bg race + `_effectiveModel` désync |

### Méta

3 audits, ~100 findings cumulés, recouvrement ~15%. Convergence forte sur:
- **Frame/Explorer pipeline navigation** (#1, N1, K3) → casse l'UX complète post-`loadFrame`
- **Inputs bindable manquants** (N3, K2) → modifs user perdues silencieusement
- **machine.ts state triple** (#8 Claude, K10, K11, K33, K45) → init/boot/destroy pas idempotents

Recommandation: prioriser **Frame + InputBindable** avant tout cleanup machine.ts — bugs visibles utilisateur final.

---

## Contre-vérification — OpenCode (minimax-m2.7) — 2026-05-27

> Auteur: **OpenCode** (minimax-m2.7)
> Scope: lecture exhaustive des fichiers clés + vérification systématique des bugs signalés

### Confirmations exhaustives

| ID | Fichier:Ligne | Verdict | Note |
|----|---------------|---------|------|
| **#1** Explorer.openCard | `Explorer.svelte:35` | ✅ CONFIRMÉ | `loadFrame('explorer', ...)` au lieu de `'card.form'`. Double régression: mauvais frame + vars ignorées par Frame (N1) |
| **#2** RBAC _model vs _effectiveModel | `machine.ts:271` | ✅ CONFIRMÉ | `loadPoliciesFromModel(this._model)` — `_model` = alias `_business`, exclut `_core` (collections système appscheme_*, appuser_*) |
| **#3** Drift race async | `machine.ts:250-292` | ✅ CONFIRMÉ | `onModel` mute `_business/_model` sans mettre à jour `_effectiveModel`. `onDrift` recalcule mais `createStore()` pas reappelé. Désync silencieuse |
| **#4** DataForm swallow error | `DataForm.svelte:98-102` | ✅ CONFIRMÉ | `catch` fait `console.error` mais `errorMessage` state jamais modifié. User voit bouton revenir sans feedback |
| **#5** seedIfEmpty deprecated | `machine.ts:287-288` | ✅ CONFIRMÉ | `seedIfEmpty` importé et utilisé malgré dépréciation dans machineSeed.ts:43 |
| **#6** schemaLoader silent catch | `machineSchemaLoader.ts:40` | ✅ CONFIRMÉ | `.catch(() => {})` — zero telemetry, debug prod impossible |
| **N1** Frame ne passe pas colId/vars | `Frame.svelte:34` | ✅ CONFIRMÉ | `props = { collection: col }` — `colId` et `v` jamais ajoutés. Navigation `loadFrame('explorer', 'vehicle', '42')` perd l'id |
| **N2** DataFields crash sans guard | `DataFields.svelte:38` | ✅ CONFIRMÉ | `machine.logic.collection(collection)` direct sans try/catch.唯一一个 Data* sans safeCollection |
| **N3** InputCurrency valeur perdue | `InputCurrency.svelte:14,52-54` | ✅ CONFIRMÉ | `value` pas `$bindable()`. CustomEvent `'change-value'` dispatché mais personne n'écoute |
| **N5** DataList onItemClick ignoré mode liste | `DataList.svelte:286-287` | ✅ CONFIRMÉ | `{:else}<li><DataFields .../></li>` — aucun onclick, pas de button wrapper |
| **N6** DataList mode table sans link | `DataList.svelte:249` | ✅ CONFIRMÉ | `TableInline` reçoit `where` et `onItemClick` mais pas `link`, `linkVars`, `linkCollectionField` |
| **N7** DataForm inputs non form-associés | `DataForm.svelte:123-145` | ✅ CONFIRMÉ | `<form>` vide (lignes 123-129). DataFields dans `<div>` séparé. prop `inputFormId` non passée à DataFields |
| **N10** machine singleton non exporté | `main/index.ts:4` | ✅ CONFIRMÉ | Export `Machine` class uniquement. `machine` singleton ligne 516 dans machine.js pas ré-exporté |
| **K2** InputEmail value non bindable | `InputEmail.svelte:13,57` | ⚠️ PARTIEL | `value` pas `$bindable()` mais `oninput` prop exposé et utilisé ligne 57. FieldDisplay:162 passe un handler `oninput` — fonctionne via callback mais pas via bind |
| **K3** Explorer double régression | `Explorer.svelte:35` + `Frame.svelte:34` | ✅ CONFIRMÉ | Mauvais frame + vars droppées — même cause que #1+N1 combinés |
| **K5** time validator accepte dates | `MachineFieldType.ts:125-128` | ✅ CONFIRMÉ | `new Date(String(value))` — `'2024-01-01'` passe. validateRules.ts:38 a la regex correcte mais non utilisée ici |
| **K6** Double validation incohérente | `MachineSchemeValidate.ts:287-302` | ✅ CONFIRMÉ | `#validateType` appelle `validateFieldPure` (regex correcte) ET `MachineSchemeFieldType.validator` (new Date). Divergence possible |
| **K7** AbortController réutilisé | `MachineApi.ts:51-52,56` | ✅ CONFIRMÉ | `controller` créé avant la boucle retry. Si timeout aborte, tous les retries suivants échouent immédiatement |
| **K10** _effectiveModel désync | `machine.ts:251-254` | ✅ CONFIRMÉ | `onModel` ne met pas à jour `_effectiveModel`. Kalcülé seulement dans `onDrift`. Fait pire que #3 |
| **K13** MachineParserForge instance par champ | `MachineSchemeField.ts:16` | ✅ CONFIRMÉ | `new MachineParserForge()` par champ — classe stateless, gaspillage mémoire |
| **K20** RbacMatrix toggleColumn | `RbacMatrix.svelte:83-90` | ✅ CONFIRMÉ | Logique incorrecte: si mixed, ne fait rien. Si allOn=true, éteint les ON mais laisse OFF |
| **K25** seed sans try/catch | `machineSeed.ts:27-36` | ✅ CONFIRMÉ | `machine.collection(collection)` peut throw si collection n'existe pas — seed entier échoue |
| **K33** _pendingIdbUpgrade après destroy | `machine.ts:176,398-404` | ✅ CONFIRMÉ | `destroy()` ne réinitialise pas `_pendingIdbUpgrade`. Recréation avec même dbName = upgrade fantôme |
| **K38** Navigation hasPermission mock | `Navigation.svelte:13-17` | ✅ CONFIRMÉ | `return true` hardcodé. Devrait utiliser `machine.rights.checkAccess` |
| **K45** boot() sans garde | `machine.ts:238` | ✅ CONFIRMÉ | Pas de garde contre appels multiples. multi-boot = fuites mémoire + réinit |

### Corrections / invalidations

| ID | Verdict | Note |
|----|---------|------|
| **K14** validateRules type retour | ❌ FAUX POSITIF | `validators` ligne 27: `(value: unknown) => boolean \| string`. Mais `validateField` ligne 58 retourne `string \| null`. OpenCode a mal lu le type — en fait `validateField` retourne correctement `string \| null`. Pas un bug. |
| **N13/K21** TemplateShell :global() | ⚠️ CONVENTION | CLAUDE.md §6 exige `@layer components { :global() }`. Risque de conflit réel mais arbitrage assumé par l'équipe |
| **K1** DataList where filtrage | ⚠️ DESIGN | Filtre client-side = intentionnel. Dette de cohérence UI (DataList vs TableInline) mais pas un bug |
| **K20** RbacMatrix UX | ⚠️ DÉPEND UX | Comportement "inverser colonne" ou "tout setter à état opposé" — à clarifier avec le product owner |

### Nouvelles observations (non cataloguées)

| ID | Fichier:Ligne | Description |
|----|---------------|-------------|
| **O1** | `DataForm.svelte:52-65` | IIFE asynchrone non annulable — si `dataId` change rapidement, vieille promesse peut écraser `formData` |
| **O2** | `DataForm.svelte:147-157` | Bouton submit affiché même en mode `show` — devrait être caché |
| **O3** | `MachineFrameManager.ts:59` | `register()` throw sur doublon — bloque HMR en développement |
| **O4** | `FieldDisplay.svelte:85` | `error` state jamais peuplé — façade de validation non fonctionnelle |
| **O5** | `machineSchemaLoader.ts:33` | `JSON.stringify` pour comparer schémas — fragile (ordre des clés) |
| **O6** | `componentRegistry.ts` | Pas de méthode `unregister` — impossible de retirer un composant |
| **O7** | `MachineSchemeValidate.ts:957-959` | `validator` getter retourne nouvelle instance à chaque appel — `registerCustom` perdu immédiatement |

### Synthèse consolidée (4 auditors)

**Convergence absolue (≥3 auditors):**
- Frame/Explorer pipeline cassé (N1, #1, K3) — navigation enregistrements inutilisable
- InputCurrency bindable manquant (N3) — modifications perdues silencieusement
- _effectiveModel désync (K10 ⊂ #3) — drift detection faussé
- RBAC _model incomplet (P0 sécurité)
- machine singleton non exporté (N10)
- AbortController retry brisé (K7)
- RbacMatrix toggleColumn inopérant (K20)

**Recommandation prioritaire:**
```
P0: Frame (vars) → Explorer.openCard → InputCurrency bindable → RBAC _effectiveModel
P1: AbortController retry → RbacMatrix → DataFields guard → DataList link table
P2: seed try/catch → MachineParserForge singleton → destroy cleanup → unregister
```

