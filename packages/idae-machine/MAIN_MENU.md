# MAIN_MENU — global menu spec (recovered from idae-legacy)

> Recovered 2026-06-21. The global menu that filtered collections by **user
> preferences × user rights** existed in idae-legacy and was lost during the
> Svelte port. This file restores the spec and maps it onto idae-machine.

---

## 1. Source of truth

| Source | Path | What |
|--------|------|------|
| Legacy code | `D:/development/idae-legacy/idae/web/mdl/app/app_gui/` | 17 PHP modules, root `app_gui_main.php` |
| Legacy spec | `D:/development/idae-legacy/MAIN_MENU.md` | Full 597-line reverse-eng |
| bmad intake | `bmad/intake-sources/ORIGIN.md` §UI-tree | UI tree + RBAC §5 |
| bmad intake | `bmad/intake-sources/CONCORDANCE.md` §3.2 | Menu generation gap analysis |
| bmad intake | `bmad/intake-sources/ARCH-SOURCE.md` §3.5 / §11 | `buildMenu()` algo + bootstrap order |

---

## 2. Core mechanic — the lost idea

The global menu is **not** a static list of collections. It is the intersection
of two per-user dimensions:

```
visible collections = (rights where L=true) ∩ (prefs where app_menu_*=true)
```

1. **Rights** (`agent_groupe_droit` in legacy → `MachineRights` in idae-machine)
   - Per `codeAppscheme`, flags `R / C / U / D / L`.
   - `L` (list) is the menu gate: a collection appears in the menu **only if `L`
     is true** for the user's group.
   - `R/C/U/D` gate the per-item actions (Read fiche, Create, Update, Delete).

2. **User preferences** (`agent_pref` in legacy → `appuser_prefs` in idae-machine)
   - Visibility toggles, keyed by prefix. The user personalizes which permitted
     collections actually show, and in which zone:

| Pref prefix | Menu zone |
|-------------|-----------|
| `app_menu_{table}` | side menu (`app_gui_menu.php`) |
| `app_menu_start_{table}` | start/waffle menu (`app_gui_start_menu.php`) |
| `app_menu_create_{table}` | quick-create (`app_gui_today_create.php`) |
| `app_panel_{table}` | right recent-history panel (`app_gui_panel_list.php`) |
| `gui_menu_visible` | side menu open/closed |
| `cache_mode` | module caching (DEV) |

3. **Grouping** — menu items grouped by `appscheme_type` (each type carries
   `iconAppscheme_type`, `nomAppscheme_type`). Each collection carries
   `iconAppscheme`, `colorAppscheme`, `nomAppscheme`.

### Build algorithm (legacy `ARCH-SOURCE.md` §3.5)

```js
async function buildMenu(idagent) {
  const allowed = await rights({ code: 'L' });        // RIGHTS gate
  return Object.values(APPSCHEMES)
    .filter(s => allowed.includes(s.codeAppscheme))    // ∩ right L
    .filter(s => prefs[`app_menu_${s.codeAppscheme}`]) // ∩ pref visible
    .map(s => ({
      label: s.nomAppscheme,
      icon:  s.iconAppscheme,
      color: s.colorAppscheme,
      type:  s.idappscheme_type,
      path:  `/${s.codeAppscheme}`,
    }));
}
```

Legacy PHP equivalent (`app_gui_menu.php` lines 22-29):

```php
// prefs: distinct app_menu_* where valeur=true for this agent
$arr_pref      = agent_pref.distinct('codeAgent_pref', { app_menu_*, valeur:true });
$DIST_TBL_PREF = strip 'app_menu_' prefix;                  // pref tables
// rights: schemes where group has R=true AND in pref set
$arr_sch       = agent_groupe_droit.distinct('idappscheme', { group, codeAppscheme IN pref, R:true });
$arr_sch_type  = appscheme.distinct('idappscheme_type', { idappscheme IN sch });
$RS_TY         = appscheme_type.find({ id IN sch_type }).sort(nom);
// then: per type → per scheme → Espace/Créer/Explorer (each droit-gated)
```

---

## 3. Menu zones (legacy layout)

```
app_gui_main.php                          ← root container
├── TaskBar                               toggle, waffle, mail badge, agent, cache(DEV)
├── gui_pane (waffle overlay)             app_gui_start.php
│   ├── [left 50%] app_gui_start_menu     appscheme_type → appscheme (pref app_menu_start_*)
│   │     ├── launch (single collection)  Créer/Espace/Recherche/Parcourir/Comparer/Trier/console/images
│   │     └── launch_all (whole type)     all collections of a type
│   └── [right 50%] app_gui_today         dashboard "Aujourd'hui"
│         ├── today_create                quick-create (pref app_menu_create_*)
│         ├── today_link                  quick-access lists (owns records)
│         └── today_echeancier            start/end date timeline
├── gui_menu (collapsible sidebar)        app_gui_menu.php (pref app_menu_*, tree by type)
│         └── per scheme → Espace / Créer / Explorer (droit-gated)
└── desktop                               widgets + right panel
    └── app_gui_panel_list                per-collection recent history (pref app_panel_*)
          └── app_gui_panel               agent_history, 30d, limit 15
```

### Per-collection action menu (right-click / launch) — `data-contextual`

Built from R/C/U/D rights (legacy `app_gui_start_menu_launch.php`):

| Right | Action | Legacy target |
|-------|--------|---------------|
| `C` | Créer {table} | `app_create` |
| `L` | Espace {table} | `app_explorer` |
| `R` | Recherche rapide | `app_prod_search` |
| `L` | Parcourir | `app_prod` |
| `R` | Comparer | `app_compare` |
| `ADMIN` | Trier | `app_dispatch` |
| `L` + has `dateDebut` + status | console {table} | `app_console` |
| any | images {table} | `app_img` |

---

## 4. Permission + preference chain

```
session.idagent / idagent_groupe
  → agent_groupe_droit   (R/C/U/D/L per codeAppscheme)    = RIGHTS
  → agent_pref           (app_menu_* / app_panel_* = true) = VISIBILITY
  → intersection                                           = final menu
```

Settings gear (`app_gui_tile_user.php`) per zone lets the user edit the
`agent_pref` set for that `code` scope (`app_menu`, `app_menu_start`,
`app_menu_create`, `app_panel`). Shows an orange warning when no pref configured.

---

## 5. Mapping legacy → idae-machine

| Legacy | idae-machine | Status |
|--------|--------------|--------|
| `agent_groupe_droit` + `droit_table()` | `machine.rights` (`MachineRights`) | exists |
| `agent_pref` (`app_menu_*`) | `appuser_prefs` via `machine.action` / `useMachinePrefs` | exists |
| `appscheme` / `appscheme_type` | `appscheme` collection (`fkRelations` to type) | exists |
| `buildMenu()` filter | **MISSING** — pref×right menu generator | TODO |
| `app_gui_menu.php` (sidebar tree) | shell sidebar (currently `<DataList collection="appscheme" linkCollectionField="code" />`) | partial |
| `app_gui_start_menu.php` (waffle) | not built | TODO |
| `app_gui_panel.php` (recent history) | `appuser_history` + `machine.action` | data exists, UI TODO |
| `data-contextual` row menu | not built | TODO |

### What's missing (the actual lost piece)

1. **Menu generator** — a derived store that joins:
   - `machine.rights` (collections where `L`),
   - `appuser_prefs` (`app_menu_*` = true),
   - `appscheme` + `appscheme_type` (label/icon/color/grouping),
   and emits a typed tree. Reactive (`$derived`) so pref/right changes re-filter.

2. **Pref scopes** — settled `app_menu` / `app_menu_start` / `app_menu_create` /
   `app_panel` pref codes wired to `appuser_prefs` (`upsertOn: ['code','collection']`).
   Per CLAUDE.md: the `app*_` literal prefix is a **convention, not a contract** —
   centralize the scope keys, don't scatter string literals.

3. **Settings UI** — per-zone gear that toggles which permitted collections show
   (writes `appuser_prefs`).

---

## 6. Notes / decisions

- Per project memory `machine_app_naming`: `appscheme` = collection-of-collections;
  do not hardcode `appscheme_*` literals as a contract.
- Reads must go through `machine.store` (reactive), writes via `machine.action`
  (CLAUDE.md invariants 8/10).
- Custom tags need explicit `display` CSS (invariant 7). Run `pseudo-html` then
  `css-base` before building the menu components.
- The legacy menu had **per-zone** preference sets (same collection could show in
  sidebar but not waffle). Preserve that granularity — one pref code per zone.
