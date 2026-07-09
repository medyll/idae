# Case Study — Global Main Menu (pref × right driven)

> Authored 2026-06-23 (Scrum + analysis). Source: `MAIN_MENU.md`, legacy screenshots
> (`bmad/archive/idae-screen-legacy/serie/idae.desktop.*.jpg`), current code.
> Decision request from user: *implémenter le menu principal* — complexe, `user_pref`
> vides aujourd'hui → besoin de **défauts** + **mode dev = tout visible**.
> Hint: *framer à enrichir*.

---

> ⚠ **Correction 2026-06-25:** "grouped by `appscheme_type`" below is wrong. Menu
> grouping = **`appscheme.fks.appscheme_base.code`** (company structure / services).
> See `MAIN_MENU.md` §2.3. Read every "by type" as "by base".

## 1. What the legacy menu does (target)

The global menu is **not** a static collection list. It is a per-user intersection:

```
visible collections = (rights where L = true) ∩ (prefs where app_menu_*  = true)
grouped by appscheme_base, decorated with icon/color/label.
```

Three legacy zones, all fed by the same intersection but different pref prefix:

| Zone | Legacy file | Pref prefix | Screenshot |
|------|-------------|-------------|------------|
| Side menu (collapsible tree by base) | `app_gui_menu.php` | `app_menu_{table}` | all 3 |
| Waffle / start overlay (type → collection launch) | `app_gui_start_menu.php` | `app_menu_start_{table}` | `menu.production` |
| Today dashboard (quick-create + my-lists + échéancier) | `app_gui_today.php` | `app_menu_create_{table}` | `today` |
| Right recent-history panel | `app_gui_panel_list.php` | `app_panel_{table}` | — |

Per-collection **contextual launch menu** (`contrat` screenshot): Créer / Espace /
Recherche rapide / Parcourir / Comparer / Trier / console / images — each entry gated
by a specific right (C / L / R / ADMIN).

---

## 2. Current idae-machine state (what exists)

| Need | Current state | Gap |
|------|---------------|-----|
| Rights check | `machine.rights.checkAccess(collection, op)` — **single collection** (MachineRights.ts:70) | No enumeration: cannot list collections where `L=true`. Menu must iterate all collections × checkAccess. |
| Prefs read/write | `useMachinePrefs` (datalist-scoped, key `{userId}:{scope}.{slot}`) + `machine.action('appuser_prefs', …)` | No **menu-zone** pref scope (`app_menu` / `app_menu_start` / `app_menu_create` / `app_panel`). Hook is list-centric. |
| Collections + grouping | `appscheme` + `fks.appscheme_base` (`fkRelations`), `machine.logic.collections()` | No join that yields a typed menu tree with icon/color/label. |
| Defaults when prefs empty | none | **User-critical**: prefs vides → menu vide. Need default policy + dev-mode "show all". |
| Navigation | framer `loadFrame / loadIn / loadInDialog / createHost` | No menu builder; no rights-gated launch actions (Espace/Créer/…). **Hint: enrich framer.** |
| Shell zones | `App.svelte` = TaskBar + `main` only. `TemplateShell` = sidebar+main+right. Sidebar = `<DataList collection="appscheme">` (flat, no type tree, no pref/right filter). TaskBar = hardcoded "Explorer→vehicle", mock ⚙. | Waffle overlay, today dashboard, type-tree sidebar, recent panel, per-zone settings gear = **not built**. |
| Contextual row menu | `framer.openContextMenu()` + `ContextMenu.svelte` host exists | Actions not rights-gated, not wired to launch verbs (Créer/Espace/Recherche/Parcourir/Comparer/Trier/console/images). |

**The actual lost piece** = the *menu generator*: a reactive `$derived` store joining
rights(L) ∩ prefs(app_menu_*) ∩ appscheme/appscheme_base → typed tree. Everything else
(zones, panels) consumes it.

---

## 3. Problems / risks to surface (reported)

1. **MachineRights has no enumeration API.** `checkAccess` answers one (collection, op).
   The menu needs "all collections where L". Either add `allowedCollections(op)` to
   MachineRights (clean) or iterate `machine.logic.collections()` calling checkAccess
   (works, O(n) per render — wrap in `$derived`). → ADR-worthy: where does enumeration live?

2. **Empty prefs = empty menu.** User confirmed `user_pref` empty. Without a default
   policy the menu shows nothing. Need: (a) default = show all *permitted* collections
   when no `app_menu_*` pref exists for the user; (b) **dev mode = bypass pref filter,
   show all** (`import.meta.env.DEV` or a `cache_mode`/dev pref). Must not silently
   persist defaults as user prefs (keep "unset" distinct from "explicitly hidden").

3. **Pref-scope keys must be centralized, not literal.** Per project memory
   `machine_app_naming` + CLAUDE.md: `app_menu_*` is a **convention, not a contract**.
   Don't scatter `'app_menu_' + table` string-building across components. One module
   owns the zone→scope mapping. Per-zone granularity must be preserved (same collection
   can show in sidebar but not waffle).

4. **Framer is navigation-only today.** The hint "framer à enrichir" = framer should
   own the menu model + launch verbs (Espace = loadFrame explorer, Créer = loadInDialog
   form, Recherche = …). Keeps shell components dumb; menu tree + actions derive from
   framer + rights + prefs. Risk: framer is a singleton — keep the menu builder pure /
   reactive, don't bloat the manager with UI state.

5. **`appscheme` decoration coverage.** Menu needs `icon/color/label/type` per scheme.
   Confirm every business collection's `appscheme` record carries these (legacy had
   `iconAppscheme`, `colorAppscheme`, `nomAppscheme`, `idappscheme_type`). Missing data
   → blank tree. Seed/migration check needed.

6. **Settings gear is a mock** (TaskBar.svelte:61). Per-zone pref editor (toggle which
   permitted collections show) is a real feature, not yet built. Legacy showed an orange
   warning when no pref configured — mirrors problem #2.

---

## 4. Proposed decomposition (epic MAIN-MENU)

Dependency-ordered. BL-11 is the dependency-free foundation.

| ID | Title | Effort | Depends |
|----|-------|--------|---------|
| BL-11 | MachineRights enumeration — `allowedCollections(op)` | S | — |
| BL-12 | Menu pref scopes module — centralized zone→pref keys + defaults + dev "show all" | M | — |
| BL-13 | Menu generator (framer) — reactive tree: rights(L) ∩ prefs ∩ appscheme/type | M | BL-11, BL-12 |
| BL-14 | Sidebar tree by appscheme_base (replaces flat `<DataList collection="appscheme">`) | M | BL-13 |
| BL-15 | Waffle/start overlay — type→collection launch + launch_all | L | BL-13 |
| BL-16 | Today dashboard frame — quick-create + my-lists + échéancier | L | BL-13 |
| BL-17 | Rights-gated contextual launch menu (Créer/Espace/Recherche/Parcourir/Comparer/Trier/console/images) | M | BL-11, BL-13 |
| BL-18 | Per-zone settings gear — pref editor (writes appuser_prefs via machine.action) | M | BL-12, BL-13 |
| BL-19 | Right recent-history panel — appuser_history, 30d/15 (pref app_panel_*) | M | BL-12, BL-13 |

Suggested first sprint slice: **BL-11 + BL-12 + BL-13 + BL-14** = a working pref/right
filtered sidebar tree end-to-end (foundation + first visible zone). Overlay/dashboard/
panel/gear follow.

ADR candidates: #1 (enumeration location), #4 (framer ownership of menu model).
