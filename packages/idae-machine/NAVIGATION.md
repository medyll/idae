# NAVIGATION.md — idae-machine routing strategy

> Living document. Update as decisions are made. Do not delete prior decisions — mark them as superseded.

---

## 1. Core principle

**SvelteKit routes are NOT the router.** idae-machine uses `@medyll/idae-router` for all in-app navigation. SvelteKit owns only the shell (layout + CSS + machine init). Everything inside the main content area is owned by idae-router.

This matches the legacy `ajaxInMdl` pattern: load a "module" into a named target element, not a new page.

---

## 2. What SvelteKit keeps

```
src/routes/
  +layout.svelte      ← shell: header, PaneLeft sidebar, machine.init(), machine.start(), seed
  +layout.ts          ← ssr: false, prerender: false
  +page.svelte        ← single div: <div data-idae-outlet></div> + SchemaRouter init
```

**Everything else is deleted:**
- `[collection]/` → gone
- `[collection]/[id]/` → gone
- `[collection]/+layout.ts`, `[id]/+page.ts` → gone

No SvelteKit dynamic segments. No `goto()`. No `page.params`.

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

## 5. Split view (list + card panel)

The `/:collection/:id` route needs a two-column layout (list left, card panel right). Options:

**Option A — two named outlets**
The collection-level action renders a container with two `[data-idae-outlet]` zones:
```html
<div class="collection-body">
    <div class="collection-list" data-idae-outlet="list"></div>
    <div class="collection-card-panel" data-idae-outlet="card"></div>
</div>
```
Child routes mount into the correct outlet by name. idae-router's `findOutlet` needs to support named outlets — **check if supported**.

**Option B — single action renders both**
The `/:collection/:id` action mounts both `ExplorerList` and `CardForm` into a single container div it creates:
```ts
action: (ctx) => {
    const wrap = document.createElement('div');
    wrap.className = 'collection-body';
    const listEl = document.createElement('div');
    const cardEl = document.createElement('div');
    wrap.append(listEl, cardEl);
    const a = mount(ExplorerList, { target: listEl, props: { collection: ctx.params.collection, selectedId: ctx.params.id } });
    const b = mount(CardForm, { target: cardEl, props: { collection: ctx.params.collection, dataId: ctx.params.id, mode: 'show' } });
    return () => { unmount(a); unmount(b); };
}
```
ExplorerList receives `selectedId` as prop and highlights the active row without needing its own navigation.

**Option C — list stays mounted, card panel overlays**
`/:collection` mounts `ExplorerList` and keeps it mounted. `/:collection/:id` adds `CardForm` into a second outlet that lives in the persistent shell (not inside the router outlet). Panel appears/disappears based on router state.

> **Decision pending** — discuss before coding.

---

## 6. SchemaRouter.ts — current state and issues

File: `src/lib/main/router/SchemaRouter.ts`

**What works:**
- `createRouter()` call with correct options shape
- Route generation loop over schemes
- `navigate()` wrapper
- Permission guard structure

**Bugs / stubs to fix:**
| Issue | Fix |
|-------|-----|
| `this.router?.beforeEach` | idae-router has `.before()`, not `.beforeEach()` |
| `renderList/renderDetail/renderEdit` return HTML strings | Replace with Svelte `mount()` + cleanup |
| `outlet: '#app'` | Change to `'[data-idae-outlet]'` or whatever the shell uses |
| `base: '/app'` | Change to `'/'` (no sub-path) |
| Auth guard uses `localStorage.getItem('auth_token')` | Stub — wire to real auth when Phase 4 lands |
| `authEnabled: true` default | Set to `false` until auth is implemented |

---

## 7. PaneLeft and sidebar navigation

`PaneLeft` currently dispatches `onSelect({ collection })` → `+layout.svelte` calls `goto()`.

**After migration:**
- `PaneLeft` calls `router.push('/' + collection)` directly, OR
- `PaneLeft` still dispatches the event, but `+layout.svelte` calls `router.push()` instead of `goto()`

Second option keeps PaneLeft decoupled from the router instance. Prefer this.

**Active collection highlight:** derived from `router.getState()?.params?.collection` instead of `page.params.collection`.

---

## 8. SchemaRouter singleton lifecycle

```
+layout.svelte
  machine.init(...)
  machine.start()
  ↓
+page.svelte  (onMount or $effect)
  schemaRouter.init(Object.keys(machine.logic.collections()))
  // collections available only after machine.start()
```

SchemaRouter instance exported as a module-level singleton:
```ts
// src/lib/main/router/schemaRouterInstance.ts
export const schemaRouter = new SchemaRouter({ authEnabled: false });
```

Initialized once in `+page.svelte` after machine is ready.

---

## 9. Open questions

1. **Named outlets in idae-router** — does `findOutlet` support `[data-idae-outlet="name"]` or only a single unnamed outlet? Check `render.ts` in idae-router source.

2. **Split view approach** — Option A, B, or C? (see §5)

3. **ExplorerList stays mounted on `/:collection/:id`?** If Option B: ExplorerList re-mounts on every `:id` change (full remount). If Option C: it stays mounted, cheaper. Which is acceptable?

4. **SchemaRouter vs raw createRouter** — keep the class wrapper or simplify to a plain `createRouter()` call in the app?

5. **`machine.logic.collections()`** — what's the exact API to get all collection names after `machine.start()`? Confirm before coding route generation.

---

## 10. Migration checklist (not started)

- [ ] Confirm idae-router named outlet support
- [ ] Decide split view approach (§5)
- [ ] Fix SchemaRouter bugs (§6)
- [ ] Replace render stubs with Svelte mount actions
- [ ] Add `<div data-idae-outlet></div>` to `+page.svelte`
- [ ] Initialize SchemaRouter after machine.start()
- [ ] Update PaneLeft to use router.push (via layout event or direct)
- [ ] Remove `goto()` imports from layout files
- [ ] Delete `[collection]/` and `[collection]/[id]/` route folders
- [ ] Update ExplorerList item click → router.push
- [ ] Test: direct URL `/vehicle/2` loads split view correctly
- [ ] Test: browser back/forward works
- [ ] Test: sidebar collection switch works

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

### 11.3 Registre composant (async, dynamique, singleton)

```ts
// src/lib/main/router/componentRegistry.ts
type Loader = () => Promise<{ default: Component }>;

class ComponentRegistry {
    private map = new Map<string, Loader>();
    register(key: string, loader: Loader): void { this.map.set(key, loader); }
    registerMany(entries: Record<string, Loader>): void {
        for (const [k, v] of Object.entries(entries)) this.map.set(k, v);
    }
    async resolve(key: string): Promise<Component> {
        const loader = this.map.get(key);
        if (!loader) throw new Error(`[registry] unknown: ${key}`);
        return (await loader()).default;
    }
}
export const componentRegistry = new ComponentRegistry();
```

Boot :
```ts
componentRegistry.registerMany({
    'explorer.list':   () => import('$lib/main-ui/explorer/ExplorerList.svelte'),
    'explorer.split':  () => import('$lib/main-ui/explorer/ExplorerSplit.svelte'),
    'card.create':     () => import('$lib/main-ui/card/CardCreate.svelte'),
    'card.edit':       () => import('$lib/main-ui/card/CardEdit.svelte'),
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
