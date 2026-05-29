# CLAUDE.md — idae-machine AI Reference

> Compact guide. Read this before touching code.
> Last updated: 2026-05-29

---

## 1. What is this?

`@medyll/idae-machine` — schema-driven CRUD framework. SvelteKit + Svelte 5 runes, IndexedDB via `@medyll/qoolie`, Express/MongoDB server in `server/`.

---

## 2. Invariants (breaking these breaks the app)

1. `machine.init(opts)` then `await machine.boot()` before any store/logic access.
2. **Never** import singletons directly (`machineFrameManager`, `componentRegistry`). Always use `machine.framer` / `machine.componentRegistry`.
3. `$state` inside `$effect` → wrap SvelteMap writes with `untrack()`.
4. Svelte 5 runes **only** (`$state`, `$derived`, `$effect`, `$props()`, `$bindable()`). No `$:`, `onMount`, `export let`.
5. `MachineParserForge` must stay pure — no I/O, deterministic.
6. `shell/Frame.svelte` is mounted **dynamically** by the router/framer. Never place it manually in HTML.
7. Every custom tag needs an explicit `display` CSS rule. Missing = inline default = broken layout.

---

## 3. Surface API — `machine.*`

```ts
machine.init({ org, domain, version, core?, business?, sync? })
await machine.boot()          // async entry point
machine.destroy()

machine.logic             → MachineDb (schema layer)
machine.store(name)       → reactive { items } (read-only Svelte 5 runes)
machine.rights            → MachineRights (RBAC)
machine.sync              → qoolie sync controller
machine.socket            → EventDataClientInstance
machine.router            → MachineRouter (hash URL dispatcher)
machine.framer            → MachineFrameManager
machine.componentRegistry → safe facade { register, registerMany, unregister, resolve, has, keys }
machine.action            → write dispatcher for user-scoped data (prefs/history/activity)
machine.be                → builder helpers (query/field)
machine.collection(name)  → raw QoolieCollection (imperative CRUD)
```

### Navigation (`machine.framer`)

```ts
machine.framer.loadFrame(modulePath, collection, collectionId?, vars?, zone?)
machine.framer.loadIn(zone, modulePath, collection, collectionId?, vars?)
machine.framer.loadInDialog(modulePath, collection, collectionId?, vars?)  // content-keyed dialog
```

### Write dispatcher (`machine.action`)

```ts
// Generic upsert/bump/touch for user-scoped collections
await machine.action('appuser_history', { code: 'vehicle/42' }, { upsertOn: ['code'], bump: 'count', touch: 'lastSeen' });

// Favorites via appuser_prefs (record-level)
await machine.action('appuser_prefs',
    { code: 'fav', collection: 'vehicle', collection_value: '42', name: 'BMW X5', value: true },
    { upsertOn: ['collection', 'collection_value'] });
```

---

## 4. UI Structure

```
src/lib/
├── data-ui/              ← low-level components, machine-aware
│   ├── data/             → DataList, DataForm, DataRecord, DataFk, DataRfk, TableInline, DataListFk, DataListRfk
│   ├── controls/         → DataToolbar, DataFind, DataGroup, DataSort
│   ├── field/            → DataField, DataFieldEdit
│   ├── input/            → InputBoolean, InputSelect, InputEmail, InputCurrency, InputTextarea
│   └── fragments/        → Confirm, Skeleton, InfoLine, Selector, dialog/ (Dialog + openDialog)...
│
└── shell/
    ├── Frame.svelte       ← dynamic frame mechanics (ROOT of shell/)
    ├── frame/             ← frame types (loadable content)
    │   ├── explorer/      → Explorer.svelte, ExplorerContent.svelte
    │   ├── synthesis/     → Synthesis.svelte  (frame type key: 'fullinfo')
    │   └── rbac/          → RbacMatrix.svelte
    └── layout/            ← static UI structure
        ├── App.svelte           → minimal shell (TaskBar + main zone)
        ├── TemplateShell.svelte → full shell (sidebar + main + modal + window zones)
        ├── TaskBar.svelte
        └── Pane, PaneRight, PaneRecents...
```

**Deleted paths — do NOT reference:**
- `shell/card/` — removed entirely
- `shell/explorer/` — moved to `shell/frame/explorer/`
- `shell/frame/Frame.svelte` → now `shell/Frame.svelte`
- `AppShell.svelte` → now `TemplateShell.svelte`
- `ExplorerTableInline.svelte` → now `data-ui/data/TableInline.svelte`
- `CollectionNav.svelte` — removed, replaced by `<DataList collection="appscheme" linkCollectionField="code" />`

### Frame zones (`data-target-zone`)

```
main        → primary zone (lists, forms)
main.modal  → overlay modal
main.window → floating window
main.panel  → right-side panel
```

### componentRegistry entries

```ts
'explorer'        → shell/frame/explorer/Explorer.svelte
'explorer.content'→ shell/frame/explorer/ExplorerContent.svelte
'card.form'       → data-ui/data/DataForm.svelte
'rbac.matrix'     → shell/frame/rbac/RbacMatrix.svelte
'fullinfo'        → shell/frame/synthesis/Synthesis.svelte
```

### DataList navigation props

| Prop | Usage |
|------|-------|
| `link` | `"loadFrame:explorer"` or `"loadIn:card.form@main.panel"` |
| `linkCollectionField` | Field used as target collection name (e.g. `"code"` for appscheme) |
| `linkVars` | Extra vars passed to framer |

**Invariant:** every collection has `id` (auto-increment PK) AND `code` (semantic string). `indexField` is always `'id'`.

---

## 5. Skills — mandatory activation

When touching HTML, CSS, component structure, or file naming:

| Skill | When |
|-------|------|
| `pseudo-html` | **Before** any HTML/component decision. Determines tag names, file hierarchy, display-hint suffixes. |
| `css-base` | Any CSS, styling, tokens, layout, dark mode. |

Rule: `pseudo-html` decides *name & structure*; `css-base` decides *style & tokens*. Always `pseudo-html` first.

---

## 6. Dev commands

```bash
pnpm run dev             # SvelteKit dev server
pnpm run test            # vitest (client jsdom + server node projects)
pnpm run check           # svelte-check + TypeScript (0 errors target)
pnpm run build           # vite build + svelte-package + publint
pnpm run test:e2e        # Playwright (src/e2e/playwright.config.ts)

# Server
cd server && pnpm run dev
npx tsx server/src/bootstrap/bootstrap-demo.ts [org] [mongoUri]  # seed MongoDB
```

**Test projects** (see `vite.config.ts`):
- `client` — jsdom, `.svelte.{test,spec}.{js,ts}`
- `server` — node, `.{test,spec}.{js,ts}` excluding svelte tests

---

## 7. Pre-commit checklist

- [ ] `pnpm run check` — 0 type errors
- [ ] `pnpm run test` — green
- [ ] Runes Svelte 5 only (`$props`, `$state`, `$derived`, `$effect`)
- [ ] New fields declared via `field()`, not raw strings
- [ ] New exports added to `src/lib/index.ts`
- [ ] `@medyll/css-base` tokens used, no hardcoded px/rem/colors
- [ ] Custom tags have explicit `display` in CSS

---

## 8. Key files (shortlist)

| File | Role |
|------|------|
| `src/lib/main/machine.ts` | Singleton lifecycle + getters |
| `src/lib/main/router/componentRegistry.ts` | Frame type registry |
| `src/lib/main/frame/MachineFrameManager.ts` | Frame host / mount / SvelteMap registry |
| `src/lib/shell/Frame.svelte` | Dynamic frame mount point |
| `src/lib/shell/frame/synthesis/Synthesis.svelte` | Record synthesis frame ('fullinfo') |
| `src/lib/data-ui/data/DataList.svelte` | List provider + renderer |
| `src/lib/data-ui/data/DataForm.svelte` | CRUD form engine |
| `src/lib/data-ui/data/DataListRfk.svelte` | Reverse-FK relation lists |
| `src/lib/data-ui/field/DataField.svelte` | Field type dispatch to input atoms |
| `src/lib/main/machine/MachineAction.ts` | `machine.action` dispatcher |
| `server/src/bootstrap/bootstrap-demo.ts` | MongoDB seed CLI |

**Do not confuse:**
- `shell/Frame.svelte` (mechanic) ≠ `shell/frame/` (frame types)
- `shell/Frame.svelte` (dynamic) ≠ `data-ui/fragments/Frame.svelte` (public layout export)
- `machine.framer` (public) ≠ `machineFrameManager` (internal singleton)
- `core` (system collections) ≠ `business` (app collections)

---

## 9. Notes

- `AGENTS.md` is a symlink to this file (`CLAUDE.md`) — edit only `CLAUDE.md`.
- Monorepo context: sibling packages in `D:/development/idae/packages/` (`qoolie`, `idae-router`, `idae-socket`, etc.).
