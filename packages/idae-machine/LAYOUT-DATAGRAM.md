# Layout Datagram — idae-machine

> Carte du système de layout : shell topology → zones → frame hosts → navigation → data-ui tree.
> Régénéré 2026-06-10 (lecture source, recoupé contre les fichiers réels).

---

## Ce qu'il faut faire pour générer ce document

Méthode reproductible. Lire le **code source** (pas la mémoire), recouper chaque assertion contre les fichiers réels.

### 1. Fichiers à lire (ordre)

| # | Fichier | Ce qu'on en tire |
|---|---------|-----------------|
| 1 | `src/lib/shell/layout/App.svelte` | Shell minimal : TaskBar + zone `main` |
| 2 | `src/lib/shell/layout/TemplateShell.svelte` | Shell complet : sidebar + content (`data-target-zone={zoneId}`) + right |
| 3 | `src/lib/shell/Frame.svelte` | Mécanique frame : register/load/host, CSS `position:absolute;inset:0` |
| 4 | `src/lib/main/frame/MachineFrameManager.ts` | Cœur : `createHost(fill)`, `loadFrame`/`loadIn`/`loadInDialog`, registry, zones, toggle |
| 5 | `src/lib/main/router/componentRegistry.ts` | Mapping clé → composant (types de frame chargeables) |
| 6 | `src/lib/data-ui/fragments/dialog/Dialog.svelte` | Host content-driven `fill:false`, dialog flottant |
| 7 | `src/lib/shell/frame/explorer/Explorer.svelte` | Exemple concret : TemplateShell + loadIn sous-zone |
| 8 | `src/lib/data-ui/field/DataField.svelte` | Dispatch fieldType → Input* atoms |

### 2. Globs de cartographie

```
src/lib/shell/**/*.svelte      → inventaire shell (layout, frame types, columner, auth)
src/lib/data-ui/**/*.svelte    → inventaire data-ui (data, controls, field, input, fragments)
```

### 3. Recoupements obligatoires (anti-dérive)

- **Zones** : chercher `data-target-zone` dans le DOM réel. Une zone documentée qui n'existe pas dans le markup = frame non montable. (Ici : `main` dans App ; `{zoneId}` dynamique dans TemplateShell ; `main.modal/window/panel` cités dans CLAUDE.md mais **aucun markup trouvé**.)
- **Registry vs fichiers** : comparer les clés de `REGISTRY_ENTRIES` à la liste des `.svelte` sous `shell/frame/`. Les fichiers absents du registry = **non chargeables** via framer (ici : `Dashboard.svelte`, `Space.svelte`).
- **`fill`** : vérifier qui passe `{ fill:false }` (Dialog) vs défaut `true` (Frame). Détermine `position:relative` vs `absolute;inset:0`.

### 4. Règle de méthode

> Ne pas faire confiance à la mémoire / CLAUDE.md pour les détails structurels — **lire le fichier**. CLAUDE.md décrit l'intention ; le code décrit l'état réel. Les écarts entre les deux sont les findings les plus utiles.

---

## 1. Shell Topology

```
┌─────────────────────────────────────────────────────────┐
│  App.svelte  (minimal shell)                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │  TaskBar.svelte  (top bar + devSlot ⚠ DEV)       │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  <main data-target-zone="main">                 │   │
│  │  ← dynamic frames mount here via router         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│  TemplateShell.svelte  (sidebar + content + right)              │
│  ┌────────────┐  ┌────────────────────────┐  ┌──────────────┐  │
│  │  <aside>   │  │  <main class=shell-main>│  │  <aside>     │  │
│  │  shell-    │  │  └ div.shell-frame-zone │  │  shell-right │  │
│  │  sidebar   │  │    data-target-zone=    │  │  aria-hidden │  │
│  │  {leftbar} │  │    {zoneId}             │  │  {rightBar}  │  │
│  └────────────┘  └────────────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

App = `data-target-zone="main"`. TemplateShell zone = `data-target-zone={zoneId}` + `data-taskbar="false"` (sous-zone, pas une window taskbar).

---

## 2. Zone Map (named targets)

| Zone name      | Location                            | Usage                          |
|---------------|-------------------------------------|-------------------------------|
| `main`         | `App.svelte` `<main>`               | Primary content (explorer, form) |
| `{zoneId}`     | `TemplateShell` `div.shell-frame-zone` | Sous-zone dynamique (ex: explorer content) |
| `main.modal`   | (overlay — markup absent)           | Modal overlay (non monté)      |
| `main.window`  | (floating — markup absent)          | Floating window (non monté)    |
| `main.panel`   | right-side panel (markup absent)    | Detail side panel (non monté)  |

---

## 3. Frame Hosts — mount model

```
MachineFrameManager.createHost(getTarget, { fill })
         │
         ├─ fill: true  (default)
         │   div.frame-content → position:absolute; inset:0; overflow:hidden
         │   ← sized zone (main, panel) ; used by: Frame.svelte
         │
         └─ fill: false
             div.frame-content → position:relative; width:100%
             ← content-driven (Dialog grows to fit) ; used by: Dialog.svelte
```

**Toggle semantics** (not swap) : chaque clé `contentKey = modulePath::computeFrameId(collection,id,vars)` monte une fois dans son propre wrapper `div.frame-content`, reste vivante. Re-load = `hideAll()` + show existant. State préservé à travers la navigation. Guard re-entrancy via `seq` (résolution async out-of-order). `destroy()` démonte tout (teardown frame).

---

## 4. Frame Types (componentRegistry)

```
REGISTRY_ENTRIES
├─ 'explorer'         → shell/frame/explorer/Explorer.svelte
│    └─ uses TemplateShell: sidebar=DataList(appscheme, groupBy=fks.appscheme_base)
│    └─ sidebar clicks → loadIn:explorer.content@{frameId}
├─ 'explorer.content' → shell/frame/explorer/ExplorerContent.svelte
├─ 'form'             → data-ui/data/DataForm.svelte
├─ 'list'             → data-ui/data/DataList.svelte
├─ 'record'           → data-ui/data/DataRecord.svelte
├─ 'columner'         → shell/columner/Columner.svelte
├─ 'fiche'            → shell/layout/Fiche.svelte           (dialog, fill:false)
├─ 'fiche.update'     → shell/layout/FicheUpdate.svelte
├─ 'rbac.matrix'      → shell/frame/rbac/RbacMatrix.svelte
├─ 'synthesis'        → shell/frame/synthesis/Synthesis.svelte
├─ 'diagram'          → shell/frame/diagram/Diagram.svelte  (NEW : graphe relations SVG)
└─ 'login'            → shell/auth/Login.svelte
```

**Non enregistrés** (existent mais hors registry → non chargeables via framer) : `shell/frame/dashboard/Dashboard.svelte`, `shell/frame/space/Space.svelte`.

---

## 5. Navigation API (`machine.framer`)

```
machine.framer        (id?: string | number — accepté partout, plus de String() forcé côté appelant)
├─ loadFrame(modulePath, collection, id?, vars?, zone='main')
│    → buildLoadInUrl → _pushFn (router) → _onNavigate hook → Frame.svelte mount
│
├─ loadIn(zone, modulePath, collection, id?, vars?)
│    → loadFrame avec zone explicite en premier
│
├─ loadInDialog(modulePath, collection, id?, vars?, { modal?, closable? })
│    → frameId = "dialog:{mp}:{col}:{id}"
│    → déjà ouvert → show() + focus() (pas de duplication)
│    → nouveau → load() + openDialog() monte Dialog.svelte (fill:false)
│
└─ register / unregister / show / hide / toggle / close / has / getControls / clear
     + injections init : setRouter, setNavigationHook, setLabelResolver
```

---

## 6. Frame Lifecycle (Frame.svelte)

```
mount $effect
  → untrack(framer.register(id, controls, { replace:true }))
  → host.load(modulePath, collection, id, vars)   [si props fournis]

controls = { load, show, hide, toggle, close, taskbar }
  show/hide/toggle  → visible state (style display block/none)
  close()           → host.destroy() + framer.unregister(id)
  taskbar           → bool (Frame=prop défaut true ; sous-zone loadIn=false)

$effect cleanup
  → untrack(framer.unregister(id)) + host.destroy()
```

DOM : `.frame { position:absolute; inset:0 }` > `.frame-body { absolute inset:0; flex column }`.

`FrameControls` (interface) : `load, show, hide, toggle, close, focus?, taskbar?`.
`focus?` implémenté **uniquement** par les frames flottantes (Dialog → raise + element.focus).

Garde-fous internes (MachineFrameManager) :
- `mountingZones` (Set) : ferme la race "même URL fire 2× avant register".
- `zoneFrames` (Map zone→Set<frameId>) : hide/show des siblings via `activateZoneFrame`.
- zone frame id = `"modulePath:zone"` (ne commence pas par `dialog:`) → tracké par zone.
- re-entrancy guard dans `createHost.load` via `seq`.

---

## 7. Data-UI Component Tree

```
DataList
├─ DataToolbar / DataFind / DataSort / DataGroup  (controls/)
├─ DataField (field/)  ← rendu par cellule
│    └─ dispatch par fieldType → Input* (input/)
│         id │ boolean→InputBoolean │ email→InputEmail │ currency→InputCurrency
│         *area*→InputTextarea │ select→InputSelect │ color→InputColor │ icon→InputIcon
│         défaut → <input type={htmlInputType}>
│    └─ DataFieldEdit  ← wrapper mode édition
└─ onClick → prop `link` déclenche framer.loadFrame / loadIn / loadInDialog

DataForm
└─ DataField* (tous éditables)

DataRecord
├─ source: prop `data` (controlled)  OU  machine.store(collection,{id}).records[0] (reactive)
├─ useViewFields → itère champs présents dans le record
├─ DataField* (mode show, uniquement champs `in effectiveData`)
├─ DataListFk / DataListRfk / DataListRelations  (collections liées)
└─ DataFk / DataRfk (FK inline)
```

**Résolution relations forward** (`utils/dataRelationUtils.ts`, ordre par relation) :
1. `fks.{relationKey}_{id}` (suffixe = id référencé) → fieldName `fks.{relationKey}`, targetIndex `id`, supporte multi-réf
2. format imbriqué `record.fks[relationKey] = { id, code }` → fieldName `fks.{relationKey}`, targetIndex `id` (fallback `code`)
3. fallback : champ FK scalaire plat legacy (ex. `category: '2'`)

**Reverse** (`MachineScheme.parseReverseFkFields`) : `fieldName`/`targetIndex` restent ceux de `findFkField` (plat) — `foldFksIntoFields` ne permet pas de distinguer un champ synthétisé d'un champ déclaré (mêmes clé/fieldType dans les deux cas), donc pas de chemin imbriqué côté reverse pour l'instant. `diagramUtils.matchWhere` sait résoudre des chemins pointés via `getPath` si un `where` imbriqué est produit ailleurs.

Atoms input (input/) : `InputBoolean, InputSelect, InputEmail, InputCurrency, InputTextarea, InputColor, InputIcon`.
`InputColor` / `InputIcon` supportent `mode="show"` (rendu lecture) en plus de l'édition.

---

## 8. DataList → Frame Navigation Props

| Prop | Pattern | Effet |
|------|--------|--------|
| `link` | `"loadFrame:explorer"` | URL-nav zone `main` |
| `link` | `"loadIn:explorer.content@{frameId}"` | Charge dans sous-zone dynamique |
| `link` | `"loadIn:form@main.panel"` | Charge `form` dans zone `main.panel` |
| `link` | `"loadInDialog:fiche"` | Ouvre fiche en dialog flottant |
| `linkCollectionField` | `"code"` | Valeur du champ = nom de collection cible |
| `linkVars` | `{ key: val }` | Vars supplémentaires au framer |
| `groupBy` | `"fks.appscheme_base"` | Regroupement (ex: sidebar explorer) |

---

## 9. Shell Support Files

```
shell/
├─ Frame.svelte           mécanique frame (mount point dynamique)
├─ layout/
│  ├─ App.svelte           minimal shell (TaskBar + main zone)
│  ├─ TemplateShell.svelte sidebar + content zone + right
│  ├─ TaskBar.svelte
│  ├─ Fiche.svelte         record detail (via loadInDialog)
│  ├─ FicheUpdate.svelte
│  ├─ Breadcrumb.svelte
│  └─ DevResetPanel.svelte  (DEV only, monté via TaskBar devSlot)
├─ frame/
│  ├─ explorer/   Explorer.svelte, ExplorerContent.svelte
│  ├─ synthesis/  Synthesis.svelte
│  ├─ rbac/       RbacMatrix.svelte
│  ├─ diagram/    Diagram.svelte           (registry: 'diagram')
│  ├─ dashboard/  Dashboard.svelte         (NON enregistré)
│  └─ space/      Space.svelte             (NON enregistré)
├─ columner/      Columner.svelte          (registry: 'columner')
└─ auth/          Login.svelte             (registry: 'login')
```

---

## 10. Diagram frame ('diagram') — relation graph

```
Diagram.svelte  (props: collection, collectionId, depth=1, direction='both')
├─ pre-check : machine.logic.collection(collection) avant buildGraph (erreur claire si collection inconnue)
├─ buildGraph(collection, id, { depth, direction })  → DiagramGraph { root, nodes, edges }
│    ├─ valide collection/recordId, normalise l'id via MachineRecordIdentity.normalizeKey
│    └─ root sans champ `id` → fallback recordId + console.warn
├─ layout radial SVG : root au centre (CX,CY=300), neighbors sur ORBIT=200
├─ edges dédupliqués (from→to:relationKey), marker fwd (primary) / rev (secondary dashed)
├─ status 'error' → message + tip si "not found"
└─ click node neighbor → machine.framer.loadInDialog('fiche', node.collection, node.record['id'])  (id brut, string|number)
```

Entrée : bouton `diagram` dans `Fiche.svelte` → `loadFrame('diagram', collection, collectionId)` (à côté de `synthese`/`update`).

Custom tags : `diagram-component` (flex column, 100%) + `diagram-canvas` (flex:1). Display déclaré en `@layer components :global()`.

---

## 11. Gaps / points d'attention

| Point | Status |
|-------|--------|
| `Dashboard.svelte`, `Space.svelte` non enregistrés | non chargeable via framer |
| Zones `main.modal/window/panel` — aucun `data-target-zone` dans App.svelte | frame non montable tant que la zone n'existe pas dans le DOM |
| `Columner.svelte` enregistré, structure non documentée | à détailler |
| `TemplateShell.rightBar` toujours `aria-hidden="true"` | pas encore utilisé — `Pane`/`PaneRight`/`PaneQuickCreate`/`PaneRecents`/`Navigation` supprimés 2026-06-10 (dead code, jamais montés) |
| Dialogs empilés : ordre DOM = z-order (`--z-modal`, pas de z-index par dialog) | `raise()` repositionne dans le parent |
| `DataListRelations.svelte` présent | rôle vs DataListFk/Rfk à documenter |
| `Diagram` couleurs en fallback hardcodé (`#4f8ef7`…) | tokens css-base via `var(--color-*, fallback)` — fallback à retirer si tokens garantis |
