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
