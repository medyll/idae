# Layout Datagram — idae-machine

> Carte du système de layout : shell topology → zones → frame hosts → navigation → data-ui tree.
> Généré 2026-06-09.

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

### 2. Globs de cartographie

```
src/lib/shell/**/*.svelte      → inventaire shell (layout, frame types, columner, auth)
src/lib/data-ui/**/*.svelte    → inventaire data-ui (data, controls, field, input, fragments)
```

### 3. Recoupements obligatoires (anti-dérive)

- **Zones** : chercher `data-target-zone` dans le DOM réel. Une zone documentée qui n'existe pas dans le markup = frame non montable. (Ici : `main` existe dans App ; `main.modal/window/panel` cités dans CLAUDE.md mais **aucun markup trouvé**.)
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
│  │  TaskBar.svelte  (top bar + dev toggle)          │   │
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
│  │  <aside>   │  │  <main>                │  │  <aside>     │  │
│  │  leftbar   │  │  data-target-zone=     │  │  rightBar    │  │
│  │  snippet   │  │  {zoneId}              │  │  (hidden)    │  │
│  └────────────┘  └────────────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Zone Map (named targets)

| Zone name      | Location                            | Usage                          |
|---------------|-------------------------------------|-------------------------------|
| `main`         | `App.svelte` `<main>`               | Primary content (explorer, form) |
| `main.modal`   | (overlay — markup absent)           | Modal overlay                  |
| `main.window`  | (floating — markup absent)          | Floating window                |
| `main.panel`   | right-side panel (markup absent)    | Detail side panel              |
| `{frameId}`    | `TemplateShell` dynamic zone        | Explorer content sub-zone      |

---

## 3. Frame Hosts — mount model

```
MachineFrameManager.createHost(getTarget, { fill })
         │
         ├─ fill: true  (default)
         │   position: absolute; inset: 0   ← sized zone (main, panel)
         │   used by: Frame.svelte
         │
         └─ fill: false
             position: relative; width: 100% ← content-driven (Dialog)
             used by: Dialog.svelte
```

**Toggle semantics** (not swap) : chaque clé `(modulePath, collection, id, vars)` monte une fois, reste vivante. Re-load = show existant + hide siblings. State préservé à travers la navigation. `destroy()` démonte tout (teardown frame).

---

## 4. Frame Types (componentRegistry)

```
componentRegistry
├─ 'explorer'         → shell/frame/explorer/Explorer.svelte
│    └─ uses TemplateShell: sidebar=DataList(appscheme) + content=zoneId
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
└─ 'login'            → shell/auth/Login.svelte
```

**Non enregistrés** (existent mais hors registry → non chargeables) : `shell/frame/dashboard/Dashboard.svelte`, `shell/frame/space/Space.svelte`.

---

## 5. Navigation API (`machine.framer`)

```
machine.framer
├─ loadFrame(modulePath, collection, id?, vars?, zone='main')
│    → URL hash push → router resolves → Frame.svelte mounts in zone
│
├─ loadIn(zone, modulePath, collection, id?, vars?)
│    → loadFrame avec zone explicite en premier
│
└─ loadInDialog(modulePath, collection, id?, vars?, opts?)
     → content-keyed: même (mp+col+id) = focus existant
     → nouveau contenu → Dialog.svelte monté (fill:false)
     → frameId = "dialog:{mp}:{col}:{id}"
```

---

## 6. Frame Lifecycle (Frame.svelte)

```
mount $effect
  → machine.framer.register(id, controls, { replace:true })
  → host.load(modulePath, collection, id, vars)   [si props fournis]

controls = { load, show, hide, toggle, close }
  close() → host.destroy() + framer.unregister(id)

$effect cleanup
  → framer.unregister(id) + host.destroy()
```

Garde-fous internes :
- `mountingZones` : ferme la race "même URL fire 2× avant register".
- `zoneFrames` : map zone → frameIds, pour hide/show des siblings (`activateZoneFrame`).
- re-entrancy guard dans `createHost.load` via `seq`.

---

## 7. Data-UI Component Tree

```
DataList
├─ DataToolbar / DataFind / DataSort / DataGroup  (controls/)
├─ DataField (field/)  ← rendu par cellule
│    └─ DataFieldEdit  ← mode édition
│         └─ Input* (input/): InputBoolean, InputSelect, InputEmail,
│                              InputCurrency, InputTextarea
└─ onClick → prop `link` déclenche framer.loadFrame / loadIn / loadInDialog

DataForm
└─ DataField* (tous éditables)

DataRecord
├─ source: prop `data` (controlled)  OU  machine.store(collection,{id}).records[0] (reactive)
├─ DataField* (mode show, uniquement champs présents dans le record)
├─ DataListFk / DataListRfk  (collections liées)
└─ DataFk / DataRfk (FK inline)
```

---

## 8. DataList → Frame Navigation Props

| Prop | Pattern | Effet |
|------|--------|--------|
| `link` | `"loadFrame:explorer"` | URL-nav zone `main` |
| `link` | `"loadIn:form@main.panel"` | Charge `form` dans zone `main.panel` |
| `link` | `"loadInDialog:fiche"` | Ouvre fiche en dialog flottant |
| `linkCollectionField` | `"code"` | Valeur du champ = nom de collection cible |
| `linkVars` | `{ key: val }` | Vars supplémentaires au framer |

---

## 9. Shell Support Files (layout/)

```
layout/
├─ App.svelte           minimal shell (TaskBar + main zone)
├─ TemplateShell.svelte sidebar + content zone + right
├─ TaskBar.svelte
├─ Fiche.svelte         record detail (via loadInDialog)
├─ FicheUpdate.svelte
├─ Navigation.svelte
├─ Breadcrumb.svelte
├─ Pane.svelte
├─ PaneRight.svelte
├─ PaneRecents.svelte
├─ PaneQuickCreate.svelte
└─ DevResetPanel.svelte  (DEV only)
```

---

## 10. Gaps / points d'attention

| Point | Status |
|-------|--------|
| `Dashboard.svelte`, `Space.svelte` non enregistrés | non chargeable via framer |
| Zones `main.modal/window/panel` — aucun `data-target-zone` dans App.svelte | frame non montable tant que la zone n'existe pas dans le DOM |
| `Columner.svelte` enregistré, structure non documentée | à détailler |
| `TemplateShell.rightBar` toujours `aria-hidden="true"` | pas encore utilisé |
| Dialogs empilés : ordre DOM = z-order (pas de z-index explicite) | `raise()` repositionne dans le parent |
