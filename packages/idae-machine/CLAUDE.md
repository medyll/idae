# CLAUDE.md — idae-machine AI Reference

> Master reference for AI agents. Read this before touching any code.
> Last updated: 2026-05-28

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
machine.boot()            // async entry point recommandé
machine.destroy()

// Getters
machine.logic             → MachineDb (schema layer)
machine.store(name)       → reactive { items } (Svelte 5 runes, read-only)
machine.rights            → MachineRights (RBAC)
machine.sync              → qoolie sync controller
machine.socket            → EventDataClientInstance
machine.router            → MachineRouter (URL dispatcher hash, auth guard)
machine.framer            → MachineFrameManager
machine.componentRegistry → safe facade { register, registerMany, unregister, resolve, has, keys }
machine.action            → write dispatcher, appelable: machine.action(collection, vars, opts?)
machine.be                → builder helpers (query/field)

// Helpers
machine.collection(name)  → raw QoolieCollection (imperative CRUD)
machine.moduleDbName(base)
```

### machine.action — write dispatcher générique

```ts
// Point d'entrée unique pour tout write user-scoped (prefs/history/activity).
// Remplace les wrappers par collection. Injecte id + userId automatiquement.
machine.action(collection, vars, opts?)
// opts: { upsertOn?: string[]; bump?: string; touch?: string; code?: string; userId?: string }

// upsert sur clé naturelle, incrément count
await machine.action('appuser_history', { code: 'vehicle/42' }, { upsertOn: ['code'], bump: 'count', touch: 'lastSeen' });
```

#### Favoris — via `appuser_prefs` (pas de collection dédiée)

`appuser_prefs` porte `collection` + `collection_value` optionnels (alignés sur `appuser_activity`/`appuser_history`). Favoris = prefs user-scoped.

```ts
// Record-level: code fixe 'fav' + collection/collection_value (upsert dessus, pas de doublon)
await machine.action('appuser_prefs',
    { code: 'fav', collection: 'vehicle', collection_value: '42', name: 'BMW X5', value: true },
    { upsertOn: ['collection', 'collection_value'] });

// Collection-level (épinglé à une zone, façon legacy app_menu_start_*): laisser collection/collection_value vides
await machine.action('appuser_prefs',
    { code: 'menu_start_vehicle', name: 'Véhicules', value: true, order: 0 },
    { upsertOn: ['code'] });

// Lecture favoris record-level
machine.store('appuser_prefs').items.filter((p) => p.code === 'fav' && p.value === true);
```

Granularité legacy = collection only (`agent_pref` booléens). Record-level = extension idae-machine.

**Règle absolue:** Jamais `import { machineFrameManager }` ou `import { componentRegistry }` dans les composants UI. Toujours `machine.framer` / `machine.componentRegistry`.

### machine.framer — navigation frames

```ts
// Navigation (ADR-04)
machine.framer.loadFrame(modulePath, collection, collectionId?, vars?, zone?)
machine.framer.loadIn(zone, modulePath, collection, collectionId?, vars?)
machine.framer.loadInDialog(modulePath, collection, collectionId?, vars?)  // dialog flottant draggable, content-keyed
// → construit URL hash → idae-router → MachineFrameManager monte la Frame dans la zone
```

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

## 6. Structure UI — ÉTAT ACTUEL (2026-05-27)

```
src/lib/
├── data-ui/              ← composants bas niveau, machine-aware
│   ├── data/             → DataList, DataForm, DataFields, DataFk, DataRfk, TableInline
│   ├── controls/         → DataToolbar (export public), DataFind, DataGroup, DataSort
│   ├── field/            → FieldDisplay, FieldEditor
│   ├── input/            → InputBoolean, InputSelect, InputEmail, InputCurrency, InputTextarea
│   └── fragments/        → Confirm, Skeleton, InfoLine, Selector, dialog/ (Dialog + openDialog)...
│
└── shell/
    ├── Frame.svelte       ← mécanique frame dynamique (RACINE de shell, pas dans un sous-dossier)
    ├── frame/             ← types de frames (contenu chargeable dans une Frame)
    │   ├── explorer/      → Explorer.svelte
    │   ├── fullinfo/      → FullInfo.svelte
    │   ├── rbac/          → RbacMatrix.svelte
    │   └── (à venir: synthese/, planning/, dashboard/)
    └── layout/            ← structure UI statique
        ├── App.svelte           → shell minimal: TaskBar + data-target-zone="main"
        ├── TemplateShell.svelte → shell complet: sidebar + main + modal + window zones
        ├── TaskBar.svelte
        ├── DevResetPanel.svelte
        └── Pane, PaneRight, PaneRecents...
```

**SUPPRIMÉS (ne plus référencer):**
- `shell/card/` — supprimé. CardForm/CardPicker/CardFields/CardCreate/CardEdit = wrappers inutiles
- `shell/explorer/` → maintenant `shell/frame/explorer/`
- `shell/frame/Frame.svelte` → maintenant `shell/Frame.svelte`
- `AppShell.svelte` → maintenant `TemplateShell.svelte`
- `ExplorerTableInline.svelte` — remplacé par `data-ui/data/TableInline.svelte`
- `CollectionNav.svelte` — supprimé. Remplacé par `<DataList collection="appscheme" linkCollectionField="code" />`

### Zones frame (data-target-zone)

```
data-target-zone="main"        → zone primaire (liste, form)
data-target-zone="main.modal"  → overlay modal
data-target-zone="main.window" → fenêtre flottante
data-target-zone="main.panel"  → (à créer) panel latéral droit
```

Frame chargée dynamiquement — le dev place JUSTE `data-target-zone="main"` dans le DOM.
`machine.framer.loadFrame('explorer', 'vehicle')` monte `<Frame>` dans la zone automatiquement.

### DataList — props navigation (ADR-04)

```svelte
<!-- Mode data-record (défaut) : navigue vers collection + record.id -->
<DataList collection="vehicle" link="loadFrame:explorer" />
<DataList collection="vehicle" link="loadIn:card.form@main.panel" />

<!-- Mode collection-ref : record[linkCollectionField] = nom de la collection cible -->
<DataList collection="appscheme" link="loadFrame:explorer" linkCollectionField="code" />
```

| Prop | Type | Description |
|------|------|-------------|
| `link` | `string` | `"action:module"` ou `"action:module@zone"`. action = `loadFrame\|loadIn` |
| `linkCollectionField` | `string?` | Field du record utilisé comme collection cible (ex: `"code"` pour appscheme) |
| `linkVars` | `Record<string,any>?` | Vars passées à framer |

Invariant: chaque collection a `id` (PK auto-increment) ET `code` (string sémantique). `indexField` = `'id'` constant.

### componentRegistry — entrées actuelles

```ts
'explorer'             → shell/frame/explorer/Explorer.svelte
'card.form'            → data-ui/data/DataForm.svelte
'rbac.matrix'          → shell/frame/rbac/RbacMatrix.svelte
'fullinfo'             → shell/frame/fullinfo/FullInfo.svelte
```

### Hiérarchie composants

```
Explorer (frame type)
  └── DataList / TableInline
        └── DataFields
              └── FieldDisplay
                    └── Input* atoms

DataForm (frame type via card.form)
  └── DataFields
        └── FieldDisplay
              └── Input* atoms
```

**Invariant:** data-ui/ ne dépend PAS de shell/. shell/ peut dépendre de data-ui/.
`explorerUtils.ts` vit dans `src/lib/data-ui/utils/explorerUtils.ts` — le backlog BL-02 est déjà résorbé.

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
import { seed } from '$lib/main/machineSeed.js';
await seed({ vehicle: [...], category: [...] }, { onlyIfEmpty: true });
```

SyncMode: `'server-first'` (MongoDB = source de vérité) | `'mobile-first'` (IDB = source de vérité, futur)

---

## 8. Invariants (ne pas casser)

1. `machine.init(opts)` puis `machine.boot()` avant tout accès store/logic
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
| `src/lib/main/machineSchemaLoader.ts` | SWR schema fetch interne à `boot()` |
| `src/lib/main/machineIdbAdapter.ts` | IDB drift detection + upgrade |
| `src/lib/main/machineSeed.ts` | `seed()` |
| `src/lib/main/machine/MachineRights.ts` | RBAC — `loadPoliciesFromModel()` |
| `src/lib/main/machine/MachineAction.ts` | Write dispatcher générique (`machine.action`) — upsert/bump/touch/code |
| `src/lib/data-ui/fragments/dialog/dialog.svelte.ts` | `openDialog()` — mount Dialog flottant (préférer `framer.loadInDialog`) |
| `src/lib/data-ui/controls/DataToolbar.svelte` | Toolbar find/group/sort au-dessus d'une DataList |
| `src/lib/main/machine/MachineSocket.ts` | Socket client factory |
| `src/lib/main/frame/MachineFrameManager.ts` | Registry frames (SvelteMap réactif) |
| `src/lib/main/router/componentRegistry.ts` | registry des frame types (`explorer`, `card.form`, `rbac.matrix`, `fullinfo`) |
| `src/lib/shell/Frame.svelte` | Mécanique frame — monté dynamiquement |
| `src/lib/data-ui/fragments/Frame.svelte` | composant layout public exporté sous `Frame` — ne pas confondre avec `shell/Frame.svelte` |
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
- `shell/Frame.svelte` (frame dynamique montée par router/framer) ≠ `data-ui/fragments/Frame.svelte` (layout exporté publiquement)
- `TemplateShell` (shell complet avec sidebar) ≠ `App.svelte` (shell minimal sans sidebar)
- `machine.framer` (surface publique) ≠ `machineFrameManager` (singleton interne)
- `core` (collections système) ≠ `business` (collections métier)

---

## 11. Workflows agents

> `AGENTS.md` est un symlink vers ce fichier — source unique.

### Decision tree

| Besoin | Aller à |
|--------|---------|
| Ajouter un field type | → Workflow field type ci-dessous |
| Ajouter un composant UI | → §6 hiérarchie + checklist ci-dessous |
| Fixer erreur de validation | `src/lib/main/machine/MachineSchemeValidate.ts` |
| Refactor schema logic | → Refactoring rules ci-dessous + §8 invariants |
| Tests rouges | `pnpm run test`, voir `src/lib/main/__tests__/` |
| Write user-scoped (prefs/history/activity) | `machine.action(...)` — §4 |

### Skills LLM — usage obligatoire

Lorsque la tâche touche au HTML, au CSS, à la structure de composants UI ou au naming de fichiers/composants, les skills suivantes **doivent être activées** :

| Skill | Quand l'utiliser |
|-------|------------------|
| `pseudo-html` | **AVANT** toute décision de structure HTML, de nom de composant, de tag custom, d'organisation de dossiers UI, ou de suffixe display-hint. Prend le pas sur toute convention HTML/CSS générique. |
| `css-base` | Dès qu'il s'agit d'écrire du CSS, styler un composant, utiliser des tokens, des layouts, du dark mode, ou refactorer des styles. Guide la migration vers `@medyll/css-base`. |

> **Règle:** `pseudo-html` détermine le *nom et la structure* ; `css-base` détermine le *style et les tokens*. Toujours consulter `pseudo-html` avant `css-base`.

### Workflow: nouveau field type

1. **Schema** — `field('rating', { required: true })` (import `$lib/main/machine/fieldBuilder.js`)
2. **Input atom** — créer `src/lib/data-ui/input/InputRating.svelte`, props `$bindable`. Exporter dans `src/lib/index.ts`
3. **Dispatch** — ajouter case dans `FieldDisplay` snippet `fieldInput`: `{:else if fieldForge.fieldType === 'rating'}`
4. **MachineFieldType** (option) — `MachineSchemeFieldType.registerFieldType({ id, formatter, validator })`
5. **Test** — `src/lib/main/__tests__/machineParserForge.test.ts`

### Refactoring rules (avant modif `src/lib/main/`)

1. `MachineDb` cache `MachineScheme` — invalider si changement parse logic
2. `MachineParserForge` reste pur (no I/O, déterministe)
3. Changements data layer = backward-compat (qoolie partagé monorepo)
4. Deprecated = JSDoc `@deprecated` + chemin de migration

### Checklist composant (Svelte 5)

- Runes uniquement: `$state` `$derived` `$effect` `$props()` `$bindable()`. Pas de `$:` / `onMount` / `export let`
- `{#each items as item (item.id)}` toujours keyé
- Export ajouté au `index.ts` pertinent

### Avant commit

- [ ] `pnpm run check` — 0 erreur type
- [ ] `pnpm run test` — vert
- [ ] Runes Svelte 5 only
- [ ] Nouveaux fields via `field()`, pas string rules
- [ ] Exports ajoutés aux `index.ts`
