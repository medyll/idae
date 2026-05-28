# NAVIGATION.md — idae-machine navigation

> Reference aligned with the current runtime. No legacy route table, no superseded variants.

---

## 1. Core shape

```text
SvelteKit shell
   └─ data-target-zone="main"
        └─ machine.router
             └─ machine.framer
                  └─ componentRegistry.resolve(modulePath)
                       └─ mount Svelte component in the target zone
```

**Rule:** SvelteKit hosts the shell. In-app navigation is owned by `machine.router` + `machine.framer`.

---

## 2. Runtime entry point

```ts
await machine.boot({
	org: 'demo',
	domain: 'machine',
	sync: { databaseHost: 'http://localhost:3000' }
});

machine.initRouter({ authEnabled: false });
```

- `boot()` resolves the schema, builds `machine.logic`, and creates the client store.
- `initRouter()` wires the runtime router once the machine is ready.

---

## 3. Navigation primitive

Use the frame manager facade:

```ts
machine.framer.loadFrame(modulePath, collection, collectionId?, vars?, zone?);
machine.framer.loadIn(zone, modulePath, collection, collectionId?, vars?);
```

Examples:

```ts
machine.framer.loadFrame('explorer', 'vehicle');
machine.framer.loadFrame('card.form', 'vehicle', '42');
machine.framer.loadFrame('card.form', 'vehicle', '42', { mode: 'card' }, 'main.modal');
machine.framer.loadIn('main.modal', 'card.form', 'vehicle', '42');
```

- default zone = `main`
- `collectionId` is optional
- `vars` becomes querystring state

---

## 4. URL shape

The router state is hash-driven and URL-complete:

```text
#/+<zone>/<modulePath>/<collection>
#/+<zone>/<modulePath>/<collection>/<collectionId>
#/+<zone>/<modulePath>/<collection>/<collectionId>?key=value
```

Examples:

```text
#/+main/explorer/vehicle
#/+main/card.form/vehicle/42
#/+main.modal/card.form/vehicle/42?mode=card
```

The active URL is parsed back into frame loads on refresh.

---

## 5. Zones

Zones are declared in the DOM with `data-target-zone`.

```html
<main data-target-zone="main"></main>
<div data-target-zone="main.modal"></div>
<div data-target-zone="main.window"></div>
```

Recommended zone ids:

| Zone | Purpose |
|---|---|
| `main` | primary content |
| `main.modal` | overlay/modal |
| `main.window` | floating window |
| `main.panel` | secondary side panel |

One zone hosts one mounted frame at a time.

---

## 6. Component registry

Current runtime registry (`src/lib/main/router/componentRegistry.ts`):

```ts
componentRegistry.registerMany({
	'explorer':    () => import('$lib/shell/frame/explorer/Explorer.svelte'),
	'card.form':   () => import('$lib/data-ui/data/DataForm.svelte'),
	'rbac.matrix': () => import('$lib/shell/frame/rbac/RbacMatrix.svelte'),
	'fullinfo':    () => import('$lib/shell/frame/fullinfo/FullInfo.svelte'),
});
```

Rules:

1. `modulePath` must match a registry key.
2. Navigation code talks to keys, never to file paths.
3. Plugins extend navigation by calling `machine.componentRegistry.register(...)`.

---

## 7. DataList link convention

`DataList` can trigger navigation declaratively:

```svelte
<DataList collection="vehicle" link="loadFrame:card.form" />
<DataList collection="appscheme" link="loadFrame:explorer" linkCollectionField="code" />
<DataList collection="vehicle" link="loadIn:card.form@main.modal" />
```

Parsing rules:

- `loadFrame:<module>`
- `loadFrame:<module>@<zone>`
- `loadIn:<module>@<zone>`

If `linkCollectionField` is set, the clicked record provides the target collection name.

---

## 8. Frame manager contract

`machine.framer` is the only frame runtime surface exposed to components.

Responsibilities:

1. convert navigation intent to URL
2. resolve target zone
3. resolve component from registry
4. mount / replace frame content
5. maintain `openFrames` for UI like `TaskBar`

Direct singleton imports are internal-only. UI code should use `machine.framer`.

---

## 9. Architectural invariants

1. `boot()` happens before any machine-aware UI renders.
2. `data-ui/` does not depend on `shell/` for structural helpers.
3. `modulePath` vocabulary is small and explicit.
4. URL state is the navigation source of truth.
5. There is no deprecated `machine.loadFrame()` compatibility layer anymore.
