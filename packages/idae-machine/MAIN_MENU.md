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

3. **Grouping** — menu items grouped by **`appscheme_base`** (the company's
   structure / services). Each base carries `icon`, `color`, `name`, `order`;
   each collection (`appscheme` record) carries `icon`, `color`, `name` and an
   `fks.appscheme_base` pointing at its base.
   > ⚠ Earlier drafts of this file (and the epic/case) said *grouped by
   > `appscheme_type`* — that was wrong. `appscheme_type` is the scheme's
   > **nature** (Group/Standard/Status/Type), not a menu grouping axis.
   > Menu grouping = `appscheme.fks.appscheme_base.code`. Settled with the user
   > 2026-06-25.

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
      base:  s.idappscheme_base,   // grouping axis (was mis-recovered as appscheme_type)
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
> ⚠ This PHP block is verbatim legacy reverse-eng and groups by `appscheme_type`.
> The **machine** target groups by `appscheme_base` (see §2.3). Read the grouping
> axis here as `appscheme_base`, not `appscheme_type`.

---

## 3. Menu zones (legacy layout)

```
app_gui_main.php                          ← root container
├── TaskBar                               toggle, waffle, mail badge, agent, cache(DEV)
├── gui_pane (waffle overlay)             app_gui_start.php — TWO internal panes
│   ├── [left] app_gui_start_menu         appscheme grouped by appscheme_base (pref app_menu_start_*)
│   │     │                               clic collection → loadIn the RIGHT pane (menu stays open)
│   │     ├── launch (single collection)  Créer/Espace/Recherche/Parcourir/Comparer/Trier/console/images
│   │     └── launch_all (whole base)     all collections of a base
│   └── [right] content zone (loadIn)     STATE-DRIVEN target zone:
│         ├── HOME (no collection picked) → app_gui_today = mini-dashboard "Aujourd'hui"
│         │     ├── today_create          quick-create (pref app_menu_create_*)
│         │     ├── today_link            quick-access lists (owns records)
│         │     └── today_echeancier      collections having dateDebut+dateFin (NOT yet in machine)
│         └── COLLECTION picked           → that collection's records + actions/stats/recents
│                                           (cf. idae.desktop.contrat.jpg)
├── gui_menu (collapsible sidebar)        app_gui_menu.php (pref app_menu_*, tree by base)
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
| `appscheme` / `appscheme_base` | `appscheme` collection (`fks.appscheme_base` = grouping) | exists |
| `buildMenu()` filter | `IdaeMenuStore.buildMenuTree` + `useMenuTree` (rights ∩ prefs ∩ appscheme, grouped by base) | done |
| `app_gui_menu.php` (sidebar tree) | `Explorer.svelte` leftbar = `<DataList collection="appscheme" groupBy="fks.appscheme_base" />`; `MenuTree.svelte` (zone `side`) | done |
| `app_gui_start_menu.php` (waffle) | `WaffleMenu.svelte` (zone `start`) — still single-pane, NOT yet the 2-pane home/collection model | partial |
| `app_gui_today.php` (home pane) | `Today.svelte` (frame `today`) — échéancier section needs dateDebut/dateFin support | partial |
| `app_gui_panel.php` (recent history) | `RecentPanel.svelte` + `appuser_history` | done |
| `data-contextual` row menu | not built | TODO |

### What's missing (the actual lost piece)

1. **Menu generator** — ✅ built (`IdaeMenuStore.buildMenuTree` / `useMenuTree`).
   Joins `machine.rights` (L) ∩ `appuser_prefs` (`app_menu_*`) ∩ `appscheme`
   (label/icon/color + `fks.appscheme_base` for grouping). Reactive `$derived`.

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

### Target shape of the waffle (settled 2026-06-25)

The waffle/start menu is a **two-pane overlay**:
- **Left** — `appscheme` list grouped by `appscheme_base`. Clicking a collection
  `loadIn`s the right pane; the overlay **stays open** (today it opens a full
  Explorer frame and closes — to change).
- **Right** — a state-driven content zone: **HOME** (no collection picked) =
  `Today` mini-dashboard; **COLLECTION picked** = that collection's records +
  actions/stats/recents (cf. `idae.desktop.contrat.jpg`).

### Piste — drive the menu list with `DataList` instead of a bespoke tree

The pref×right filtering and the **rendering/grouping** are separable:
- The hook (`useMenuTree` / a `usePref`-style hook) should return **just the list
  of allowed `code`s** (rights ∩ prefs), not a pre-grouped tree — e.g. a flat
  `string[]` after a `.map`.
- The view is then a plain `<DataList collection="appscheme"
  where={{ code: { $in: allowedCodes } }} groupBy="fks.appscheme_base" />`.
  `DataList`/`DataGroup` own grouping + reactivity; no parallel tree builder.
- This also sidesteps the `user_prefs` complexity that made a direct DataList
  swap awkward: prefs only shape the `$in` set, DataList does the rest.

### Today échéancier — not yet in machine

Legacy `today_echeancier` = a **list of lists** of every collection that has both
a `dateDebut` and a `dateFin`, on a timeline. No machine equivalent yet — assess
feasibility later.
