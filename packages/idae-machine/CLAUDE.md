# CLAUDE.md — idae-machine AI Reference

> Master reference for AI agents. Read this before touching any code.
> Last updated: 2026-05-22

---

## 1. What is idae-machine?

`@medyll/idae-machine` is the **modern rewrite** of `idae-legacy` (a PHP/PrototypeJS SPA from 2015).
Central package of the `/idae` monorepo — schema-driven, offline-first, full-stack framework.

- **SvelteKit + Svelte 5 runes** (UI)
- **IndexedDB via `@medyll/qoolie`** (client data layer + sync)
- **Express + MongoDB** (server, in `server/`)
- **Socket.IO** (real-time sync)

Philosophy: declare a schema once → get CRUD UI, validation, routing, real-time sync for free.

---

## 2. Monorepo context (`D:/development/idae/packages/`)

| Package | Role |
|---------|------|
| `idae-machine` | **Central package** — schema-driven CRUD framework |
| `qoolie` | IndexedDB + sync layer (replaced idae-idbql) |
| `idae-api` | HTTP client layer |
| `idae-router` | Schema-driven SPA routing |
| `idae-socket` | Socket.IO client |

---

## 3. Legacy lineage (`D:/development/idae-legacy/`)

| Legacy (PHP) | idae-machine | Notes |
|---|---|---|
| `app_liste` / `app_fiche_maxi` | `shell/frame/explorer/` | Frame types |
| `app_fiche` | `data-ui/data/DataForm` | Form engine |
| `app_field_update` | `data-ui/field/FieldDisplay` | Field edit in place |
| `appscheme_field` | `template.fields` + `FieldList` | Field catalog |
| `app_droit` / RBAC | `MachineRights` | Permissions |
| `act_target` + `mdl` + `vars` | `machine.framer.load(frameId, modulePath, col, id, vars)` | Frame navigation |

Legacy source: `D:/development/idae-legacy/idae/web/mdl/app/`

---

## 4. machine — surface publique (TOUT passe par machine)

```ts
// Lifecycle
machine.init({ core?, business?, org, domain, version, sync? })
machine.start()           // schema local
machine.fetchSchema(url)  // @framework-bootstrap — app shell only
machine.destroy()

// Getters
machine.logic             → MachineDb (schema layer)
machine.store(name)       → reactive { items } (Svelte 5 runes, read-only)
machine.rights            → MachineRights (RBAC)
machine.sync              → qoolie sync controller
machine.socket            → EventDataClientInstance
machine.router            → MachineRouter (URL dispatcher hash, auth guard)
machine.framer            → MachineFrameManager  ← PAS frameManager (deprecated)
machine.componentRegistry → ComponentRegistry

// Helpers
machine.collection(name)  → raw QoolieCollection (imperative CRUD)
machine.moduleDbName(base)
machine.loadFrame(modulePath, collection, collectionId?, vars?, zone?)  // push URL hash → idae-router → framer
```

**Règle absolue:** Jamais `import { machineFrameManager }` ou `import { componentRegistry }` dans les composants UI. Toujours `machine.framer` / `machine.componentRegistry`.

### machine.init — paramètres

```ts
machine.init({
    org: 'demo', domain: 'machine', version: 2,
    core:     appModelDeclaration,  // collections système (optionnel — inclus par défaut)
    business: demoScheme,           // collections métier
    sync: { mode: 'server-first', databaseHost: 'http://localhost:3000' },
})
```

- `core` = collections système (appscheme_*, appuser_*) — surcharge le baseline
- `business` = collections métier (vehicle, reservation...)
- `model` = @deprecated, alias de `business`

---

## 5. Schema declaration

```ts
import { field } from '$lib/main/machine/fieldBuilder.js';

export const myModel: MachineModel = {
    vehicle: {
        keyPath: '++id',
        base:    'machine_user',
        model:   {},
        ts:      {} as { id: string; brand: string; categoryId?: string },
        fields: {
            id:         field('id',           { readonly: true }),
            brand:      field('text',         { required: true }),
            categoryId: field('fk-category.id'),
        },
        fks: {
            category: { code: 'category', multiple: false },
        },
        template: { presentation: 'brand model year' },
    }
};
```

**Field types:** `id` `text` `text-long` `text-area` `number` `boolean` `date` `datetime` `email` `password` `url` `phone` `currency` `image` `fk-collection.field` `schemelink` `array-of-text`

---

## 6. Structure UI — ÉTAT ACTUEL (2026-05-22)

```
src/lib/
├── data-ui/              ← composants bas niveau, machine-aware
│   ├── data/             → DataList, DataForm, DataFields, DataFk, DataRfk
│   ├── field/            → FieldDisplay, FieldEditor
│   ├── input/            → InputBoolean, InputSelect, InputEmail, InputCurrency, InputTextarea
│   └── fragments/        → Confirm, Skeleton, InfoLine...
│
└── shell/
    ├── Frame.svelte       ← mécanique frame (RACINE de shell, pas dans un sous-dossier)
    ├── frame/             ← types de frames (contenu chargeable dans une Frame)
    │   ├── explorer/      → Explorer.svelte, ExplorerCollections, ExplorerTableInline, explorerUtils
    │   └── (à venir: synthese/, planning/, dashboard/)
    └── layout/            ← structure UI statique
        ├── App.svelte           → shell minimal: TaskBar + data-target-zone="main"
        ├── TemplateShell.svelte → shell complet: sidebar + main + modal + window zones
        ├── TaskBar.svelte
        ├── CollectionNav.svelte
        ├── DevResetPanel.svelte
        └── Pane, PaneRight, PaneRecents...
```

**SUPPRIMÉS (ne plus référencer):**
- `shell/card/` — supprimé. CardForm/CardPicker/CardFields/CardCreate/CardEdit = wrappers inutiles
- `shell/explorer/` → maintenant `shell/frame/explorer/`
- `shell/frame/Frame.svelte` → maintenant `shell/Frame.svelte`
- `AppShell.svelte` → maintenant `TemplateShell.svelte`

### Zones frame (data-target-zone)

```
data-target-zone="main"        → zone primaire (liste, form)
data-target-zone="main.modal"  → overlay modal
data-target-zone="main.window" → fenêtre flottante
data-target-zone="main.panel"  → (à créer) panel latéral droit
```

Frame chargée dynamiquement — le dev place JUSTE `data-target-zone="main"` dans le DOM.
`machine.loadFrame('explorer', 'vehicle')` monte `<Frame>` dans la zone automatiquement.

### componentRegistry — entrées actuelles

```ts
'explorer'             → shell/frame/explorer/Explorer.svelte
'explorer.collections' → shell/frame/explorer/ExplorerCollections.svelte
'card.form'            → data-ui/data/DataForm.svelte
// à venir: 'synthese', 'planning', 'dashboard'
```

### Hiérarchie composants

```
Explorer (frame type)
  └── DataList / ExplorerTableInline
        └── DataFields
              └── FieldDisplay
                    └── Input* atoms

DataForm (frame type via card.form)
  └── DataFields
        └── FieldDisplay
              └── Input* atoms
```

**Invariant:** data-ui/ ne dépend PAS de shell/. shell/ peut dépendre de data-ui/.
Exception actuelle: `explorerUtils.ts` est dans `shell/frame/` mais importé par data-ui/ — BL-02 backlog.

---

## 7. Seed & sync

```ts
// Server bootstrap (CLI)
tsx server/src/bootstrap/bootstrap-demo.ts [org] [mongoUri]
// → clear + schema + users + business data dans MongoDB

// Runtime client
machine.init({ sync: { mode: 'server-first', databaseHost: url } })
// → qoolie sync ramène MongoDB → IDB automatiquement

// Seed unifié (même API core et business)
import { seed, seedIfEmpty } from '$lib/main/machineSeed.js';
await seedIfEmpty({ vehicle: [...], category: [...] });
```

SyncMode: `'server-first'` (MongoDB = source de vérité) | `'mobile-first'` (IDB = source de vérité, futur)

---

## 8. Invariants (ne pas casser)

1. `machine.init(opts)` puis `machine.start()` avant tout accès store/logic
2. Tout passe par `machine.*` — pas d'imports directs des singletons internes
3. `$state` dans `$effect` → utiliser `untrack()` autour des appels qui écrivent dans SvelteMap
4. Svelte 5 runes uniquement (`$state`, `$derived`, `$effect`) — pas de `$:`, `onMount`, `export let`
5. `MachineParserForge` = pur — pas d'I/O
6. `Frame.svelte` est monté DYNAMIQUEMENT — jamais placé à la main dans le HTML
7. `SvelteMap` dans `MachineFrameManager.registry` — register/unregister via `untrack()`

---

## 9. Dev commands

```bash
pnpm run dev             # SvelteKit dev server
pnpm run test            # vitest (456 tests)
pnpm run check           # TypeScript check (0 erreurs)
pnpm run build           # svelte-package build

# Server
cd server && pnpm run dev
tsx server/src/bootstrap/bootstrap-demo.ts   # seed MongoDB
```

---

## 10. Fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/lib/main/machine.ts` | Singleton machine — lifecycle + getters |
| `src/lib/main/machineModelBuilder.ts` | `buildEffectiveModel(core?, business?)` |
| `src/lib/main/machineSchemaLoader.ts` | SWR schema fetch (@framework-bootstrap) |
| `src/lib/main/machineIdbAdapter.ts` | IDB drift detection + upgrade |
| `src/lib/main/machineSeed.ts` | `seed()` + `seedIfEmpty()` |
| `src/lib/main/machine/MachineRights.ts` | RBAC — `loadPoliciesFromModel()` |
| `src/lib/main/machine/MachineSocket.ts` | Socket client factory |
| `src/lib/main/frame/MachineFrameManager.ts` | Registry frames (SvelteMap réactif) |
| `src/lib/main/router/componentRegistry.ts` | 3 frame types enregistrés |
| `src/lib/shell/Frame.svelte` | Mécanique frame — monté dynamiquement |
| `src/lib/shell/frame/explorer/Explorer.svelte` | Frame: liste/table/card/actions |
| `src/lib/shell/layout/App.svelte` | Shell minimal (TaskBar + zone main) |
| `src/lib/shell/layout/TemplateShell.svelte` | Shell complet (sidebar + zones) |
| `src/lib/types/idae-model-core.ts` | Collections système (appscheme_*, appuser_*) |
| `src/lib/types/machine-model.ts` | MachineModel types publics |
| `server/src/MachineServer.ts` | Server singleton |
| `server/src/bootstrap/bootstrap-demo.ts` | CLI seed complet org demo |
| `server/src/models/demo/demoScheme.ts` | Schéma + seed demo (13 collections) |
| `bmad/status.yaml` | État sprints + backlog |

**NE PAS CONFONDRE:**
- `shell/Frame.svelte` (mécanique) ≠ `shell/frame/` (types de frames)
- `TemplateShell` (shell complet avec sidebar) ≠ `App.svelte` (shell minimal sans sidebar)
- `machine.framer` (correct) ≠ `machine.frameManager` (@deprecated)
- `core` (collections système) ≠ `business` (collections métier)
