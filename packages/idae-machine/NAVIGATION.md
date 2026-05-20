# NAVIGATION.md — idae-machine routing strategy

> Living document. Update as decisions are made. Do not delete prior decisions — mark them as superseded.

---

## 1. Core principle

**SvelteKit routes are NOT the router.** idae-machine uses `@medyll/idae-router` for all in-app navigation. SvelteKit owns only the shell (layout + CSS + machine init). Everything inside the main content area is owned by idae-router.

This matches the legacy `ajaxInMdl` pattern: load a "module" into a named target element, not a new page.

---

## 2. What SvelteKit keeps ✅ (implemented S22)

```
src/routes/
  +layout.svelte      ← shell: PaneLeft, machine.init(), machine.start(), machine.initRouter()
  +layout.ts          ← ssr: false, prerender: false
  +page.svelte        ← single div: <div data-target-zone="main"></div>
```

**Deleted:**
- `[collection]/` → gone
- `[collection]/[id]/` → gone
- No SvelteKit dynamic segments. No `goto()`. No `page.params`.

---

## 3. idae-router API (confirmed from source)

Package: `@medyll/idae-router` (monorepo: `packages/idae-router`)

```ts
const router = createRouter({
    mode:             'history',   // pushState
    base:             '/',         // no sub-path needed
    outlet:           '[data-idae-outlet]', // CSS selector — targets the div in +page.svelte
    routes:           [...],
    linkInterception: true         // intercepts <a> clicks automatically
});

router.push('/vehicle');           // navigate
router.push('/vehicle/42');
router.replace('/vehicle');
router.before((to, from, next) => { next(); }); // guard — NOT beforeEach (that's a bug in SchemaRouter.ts)
router.getState();                 // current context
```

**Route action signature:**
```ts
action: (ctx: Context<TData>) => ActionResult
// ctx.params       → { collection: 'vehicle', id: '42' }
// ctx.query        → parsed URLSearchParams
// ctx.data         → resolved HTTP data (null if no http config)
// ActionResult     → string | Node | DocumentFragment | (() => void) | Promise<...>
```

**Svelte mount pattern** (framework-agnostic router → Svelte cleanup):
```ts
action: (ctx) => {
    const target = document.createElement('div');
    const app = mount(ExplorerList, { target, props: { collection: ctx.params.collection } });
    return () => unmount(app); // router calls this on route leave
}
```

---

## 4. Route table

| Path | Action | Component(s) |
|------|--------|-------------|
| `/` | redirect to first collection | — |
| `/:collection` | render list view | `ExplorerList` |
| `/:collection/new` | render create form | `CardCreate` |
| `/:collection/:id` | render split view: list + card panel | `ExplorerList` + `CardForm mode="show"` |
| `/:collection/:id/edit` | render edit form | `CardForm mode="update"` |
| `/*` | 404 | plain div |

Routes are generated dynamically from `machine.logic` collection keys after `machine.start()`.

---

## 5. Split view ~~(decision pending)~~ → superseded par §11.4

Multi-cibles via URL imbriquée : `/+main/explorer.list/vehicle/+main.modal/card.edit/vehicle/42`.  
Plus de route `/:collection/:id`. Voir §11.4.

---

## 6. SchemaRouter — ~~bugs à corriger~~ → résolus S22 ✅

| Issue | Statut |
|-------|--------|
| `beforeEach` → `before()` | ✅ corrigé |
| render stubs → Svelte `mount()` | ✅ corrigé |
| `outlet: '#app'` → offscreen placeholder | ✅ corrigé |
| `base: '/app'` → `'/'` | ✅ corrigé |
| `authEnabled: true` → `false` | ✅ corrigé |

---

## 7. PaneLeft ✅ (réglé S22-S23)

`PaneLeft` compose `SchemeList`. `onSelect` → `machine.loadIn('explorer.list', 'main', collection)`. Pas de `goto()`.

---

## 8. SchemaRouter lifecycle ✅ (implémenté S22)

```
+layout.svelte
  machine.init(...)
  machine.start()
  machine.initRouter({ baseUrl: '/', authEnabled: false })
```

Tout synchrone dans layout. Pas de init dans +page.svelte.

---

## 9. Open questions ~~(S22)~~ → répondues ✅

1. Named outlets → remplacés par `data-target-zone` + frameManager (§12)
2. Split view → multi-target URL (§11.4)
3. ExplorerList remount → géré par Frame show/hide DOM-first (§12)
4. SchemaRouter wrapper → conservé, exposé via `machine.router`
5. `machine.logic.collections()` → confirmé, utilisé dans SchemaRouter

---

## 10. Migration checklist ✅ (S22 + S23 complétés)

- [x] SchemaRouter bugs fixés
- [x] mount/unmount Svelte dans actions router
- [x] `<div data-target-zone="main">` dans +page.svelte
- [x] machine.initRouter() dans +layout.svelte
- [x] PaneLeft → machine.loadIn()
- [x] goto() supprimé
- [x] Routes dynamiques SvelteKit supprimées
- [x] ExplorerList onclick → machine.loadIn()
- [x] componentRegistry paths → shell/

---

## 11. Principes de navigation (adapté legacy)

### 11.1 Sortie router = machine

Router exposé via `machine.router` (déjà en place — `machine.ts:345`). Pas d'export séparé. Toute navigation passe par :
```ts
machine.router.push(url);
machine.router.replace(url);
```

`.app-body` (`+layout.svelte:63`) = équiv legacy `#inBody` (conteneur principal).

### 11.2 Primitive `loadIn` (équiv `ajaxInMdl`)

Signature unique :
```ts
machine.loadIn(modulePath, targetId, collection, collectionId?, vars?)
```

→ pousse l'URL (targetId INCLUS, **syntaxe imbriquée** — chaque cible préfixée par `+`) :
```
/+<targetId>/<modulePath>/<collection>/<collectionId>?<vars>
```

Exemples mono-cible :
```ts
machine.loadIn('explorer.list',  'main',        'vehicle');                    // /+main/explorer.list/vehicle
machine.loadIn('explorer.split', 'main',        'vehicle', '42');              // /+main/explorer.split/vehicle/42
machine.loadIn('card.edit',      'main.modal',  'vehicle', '42', 'tab=info');  // /+main.modal/card.edit/vehicle/42?tab=info
machine.loadIn('card.picker',    'main.window', 'role');                       // /+main.window/card.picker/role
```

Multi-cibles (cibles parallèles imbriquées dans une seule URL) :
```
/+main/explorer.list/vehicle/+main.modal/card.edit/vehicle/42
```
→ deux mounts : `main` reçoit `explorer.list/vehicle`, `main.modal` reçoit `card.edit/vehicle/42`.

**Anatomie URL** :
- `targetId` — cible DOM, dot-notation prédictible (`main`, `main.menu`, `main.modal`, `main.window`)
- `modulePath` — clé composant dans le registre
- `collection` — table cible
- `collectionId` — id record (optionnel)
- `vars` — querystring (optionnel)

URL = état complet. Reload page → router re-parse → ré-monte chaque cible. Multi-cibles supportées via URL composée (cf §11.4).

### 11.3 Registre composant (async, dynamique, singleton) ✅

```ts
// src/lib/main/router/componentRegistry.ts
export const componentRegistry = new ComponentRegistry();
```

Boot (chemins actuels post-S23) :
```ts
componentRegistry.registerMany({
    'explorer.list':        () => import('$lib/shell/explorer/ExplorerList.svelte'),
    'explorer.table':       () => import('$lib/shell/explorer/ExplorerTable.svelte'),
    'explorer.actions':     () => import('$lib/shell/explorer/ExplorerActions.svelte'),
    'explorer.card':        () => import('$lib/shell/explorer/ExplorerCard.svelte'),
    'explorer.collections': () => import('$lib/shell/explorer/ExplorerCollections.svelte'),
    'card.form':            () => import('$lib/shell/card/CardForm.svelte'),
    'card.create':          () => import('$lib/shell/card/CardCreate.svelte'),
    'card.edit':            () => import('$lib/shell/card/CardEdit.svelte'),
    'card.picker':          () => import('$lib/shell/card/CardPicker.svelte'),
});
```

Dynamique : plugins ajoutent runtime via `componentRegistry.register(key, loader)`.

### 11.4 Cibles (outlets) — distribution d'ID

Cibles déclarées dans le DOM par `data-target-zone="<id>"`. `+layout.svelte:68` a déjà `data-target-zone="main"`.

```html
<div class="app-body">
    <aside data-target-zone="main.menu">…PaneLeft…</aside>
    <main  data-target-zone="main"></main>
</div>
```

Le router résout `targetId` → `document.querySelector('[data-target-zone="<targetId>"]')` → mount.

**Schéma ID prédictible** (dot-notation) :
- `main` — content principal
- `main.menu` — sidebar
- `main.modal` — modale empilée au-dessus de content
- `main.window` — fenêtre flottante (équiv `act_chrome_gui`)
- `main.<custom>` — extension

Une cible = un mount à la fois (équiv `single: true` legacy). Re-`loadIn` même cible → unmount précédent, mount nouveau.

**Multi-cibles dans URL** : segments imbriqués, chaque cible préfixée par `+` :
```
/+main/explorer.list/vehicle/+main.modal/card.edit/vehicle/42
```
Parser splitte sur `+` → liste `[{ target, modulePath, collection, id, vars }]`. Mount chaque entrée. Back retire le dernier segment (ferme modale).

**Règle parsing** :
- URL démarre par `+<targetId>` (obligatoire — pas de cible implicite)
- Tokens entre deux `+` = `modulePath / collection / id?`
- Querystring multi-cibles : **skip** — pas de cas concret, add quand besoin

### 11.5 Tout via history

Décision : chrome + content unifiés sous le router. Modales/pickers/fenêtres = routes normales (cibles différentes). Back/forward marchent partout. Pas de `WindowManager` séparé.

### 11.6 Concept map (legacy → machine)

| Legacy | machine |
|---|---|
| `ajaxInMdl(file, el, vars)` | `machine.loadIn(modulePath, targetId, collection, id?, vars?)` |
| `act_chrome_gui(file, vars)` | `machine.loadIn(...)` avec `targetId` = zone fenêtre |
| Hash `#file#vars` | pushState `/<modulePath>/<collection>/<id>?<vars>` |
| `mdl/<file>` path | `componentRegistry` lookup |
| Attrs `mdl/vars/value/scope` | data attrs `data-target-zone` / props composant |
| `reloadScope` | skip (réactivité store suffit) |
| `single: true` | défaut (1 mount par cible) |
| `#inBody` | `.app-body` (`+layout.svelte:63`) |

### 11.7 Décisions actées (2026-05-19)

1. Router sort via `machine.router` — pas d'export séparé
2. Primitive : `machine.loadIn(modulePath, targetId, collection, id?, vars?)`
3. URL imbriquée : `/+<targetId>/<modulePath>/<collection>/<id>?<vars>` — multi-cibles via `+` répétés
4. Registre async singleton (`componentRegistry`)
5. Cibles via `data-target-zone="<id>"`, 1 mount par cible
6. Tout dans history (chrome inclus)
7. `reloadScope` skip

---

## 12. Frame Manager (S24 — 2026-05-20)

### 12.1 Taxonomie

| Terme | Définition |
|---|---|
| **Frame** | Conteneur avec body + contrôles (show/hide/close). Équiv legacy `.inArea` / `windowGui`. |
| **Module** | Ce qui se charge *dans* une frame — ExplorerList, CardForm, etc. Adressé par `modulePath`. |
| **Zone** | Alias nommé d'une frame statique dans le DOM (`data-target-zone="main"`). |
| **TaskBar** | Composant listant les frames ouvertes — toggle/close par frame. |

`machine.loadIn()` = charger un **module** dans une **frame nommée** (zone statique).  
`machine.loadFrame()` = ouvrir une **frame dynamique** dont l'ID est calculé depuis le contenu.

### 12.2 Signatures (ordre aligné)

```ts
// Zone nommée explicite (frame statique, ex: "main")
machine.loadIn(modulePath, targetId, collection, collectionId?, vars?)

// Frame dynamique — frameId calculé depuis (collection, collectionId?, vars?)
machine.loadFrame(modulePath, collection, collectionId?, vars?)
```

### 12.3 ID déterministique de frame

```ts
computeFrameId('vehicle')                          // → "vehicle"
computeFrameId('vehicle', '42')                    // → "vehicle:42"
computeFrameId('vehicle', '42', { tab: 'info' })   // → "vehicle:42:tab=info"
```

Vars triées → résultat stable peu importe l'ordre des clés.

### 12.4 MachineFrameManager — architecture DOM-first

**Principe 1 — DOM autoritaire**  
Le DOM (`[data-target-zone]`) est source de vérité. Le registre contient des handles de contrôle, pas d'état.

**Principe 2 — Auto-registration**  
Chaque `<Frame>` se déclare au registre à son mount avec ses propres fonctions :
```ts
machineFrameManager.register(id, { load, show, hide, toggle, close })
```

**Principe 3 — `load()` = module dans frame existante**  
Frame connue dans registre → `controls.load(modulePath, ...)`.  
Frame inconnue → `mount(<Frame>, { target: zone DOM })` → auto-register → `controls.load(...)`.

```ts
interface FrameControls {
  load:   (modulePath, collection, collectionId?, vars?) => void;
  show:   () => void;
  hide:   () => void;
  toggle: () => void;
  close:  () => void;
}

// machineFrameManager exposé via machine.frameManager
machineFrameManager.register(frameId, controls)
machineFrameManager.load(frameId, modulePath, collection, collectionId?, vars?)
machineFrameManager.show/hide/toggle/close(frameId)
machineFrameManager.openFrames  // ReadonlyMap<frameId, FrameControls>
```

### 12.5 `<Frame>` Svelte component

- Props : `id`, `modulePath?`, `collection?`, `collectionId?`, `vars?`
- Mount → `machineFrameManager.register(id, controls)`
- Unmount → `machineFrameManager.unregister(id)`
- `load()` → `componentRegistry.resolve(modulePath)` → `mount(Component, { target: bodyEl })`
- `show()` / `hide()` → CSS `display` uniquement — **DOM préservé, pas de unmount**
- `close()` → unmount module + unregister

### 12.6 Wire machine.loadIn() via frameManager

Zones statiques dans le layout wrappées en `<Frame id="main">` etc. → pré-enregistrées.  
`machine.loadIn('explorer.list', 'main', 'vehicle')` → `frameManager.load('main', 'explorer.list', 'vehicle')`.

### 12.7 TaskBar

```svelte
<!-- shell/layout/TaskBar.svelte -->
{#each [...machineFrameManager.openFrames] as [frameId, controls]}
  <button onclick={() => controls.toggle()}>{frameId}</button>
  <button onclick={() => controls.close()}>×</button>
{/each}
```

Réactif sur `openFrames` ($state Map). Toggle = show/hide, pas destroy.

### 12.8 Décisions actées (2026-05-20)

1. `MachineFrameManager` renommé (pas `MachineWindowManager`)
2. DOM-first : registre = handles, pas état
3. `<Frame>` auto-registration à son mount
4. `machine.loadFrame()` — argument order parallèle à `loadIn`, targetId absent (calculé)
5. ID déterministique depuis (collection, collectionId, vars) — human-readable, pas de hash opaque
6. show/hide = CSS, pas unmount → DOM préservé (toggle authentique, pattern legacy)
