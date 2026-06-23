# EPIC — MAIN-MENU (pref × right driven global menu)

> Authored 2026-06-23. Sources: `MAIN_MENU.md`, `bmad/artifacts/case-main-menu.md`,
> legacy `D:/development/idae-legacy/idae/web/mdl/app/app_gui/`, current shell code.
> This is the full epic spec: every story, file target, dependency, acceptance,
> and a 2-agent sprint sequencing. BL-11/BL-12 done, BL-13 planned (S50-01).

---

## 1. The lost idea (one sentence)

The global menu is **not** a static collection list — it is a per-user intersection,
grouped by type, decorated, and reactive:

```
visible(zone) = rights(L=true) ∩ prefs(app_*_{table}=true) ∩ appscheme(label/icon/color/type)
```

Four zones share the same intersection but different pref prefix:

| Zone | Pref prefix | Story |
|------|-------------|-------|
| Side menu (tree by type) | `app_menu` | BL-14 |
| Waffle / start overlay | `app_menu_start` | BL-15 |
| Today dashboard quick-create | `app_menu_create` | BL-16 |
| Right recent-history panel | `app_panel` | BL-19 |

Plus a per-collection **contextual launch menu** gated by R/C/U/D/L (BL-17), and a
per-zone **settings gear** that edits the pref set (BL-18).

---

## 2. Dependency DAG

```
BL-11 (allowedCollections)  ──┐
                              ├──> BL-13 (menu generator) ──┬──> BL-14 sidebar tree
BL-12 (menuPrefs module)  ────┘                            ├──> BL-15 waffle overlay
                                                            ├──> BL-16 today dashboard
BL-11 ──────────────────────────────────────────────────┐  ├──> BL-17 contextual menu
                                                          └──┤
BL-12 ──────────────────────────────────────────────────┐  ├──> BL-18 settings gear
                                                          └──┤
                                                            └──> BL-19 recent panel
```

Everything below BL-13 is **blocked until S50-01 (BL-13) lands**. Once it does, all six
leaf stories become eligible — sequence them by file-overlap, not by dependency.

---

## 3. Foundation status (already built)

| ID | Story | Status | Artifact |
|----|-------|--------|----------|
| BL-11 | `MachineRights.allowedCollections(op)` | ✅ done S48-02 | `MachineRights.ts` + `machineRights.test.ts` (26/26) |
| BL-12 | Menu pref scopes module | ✅ done S49-02 | `src/lib/data-ui/utils/menuPrefs.ts` (`menuPrefsScope`/`menuPrefsPrefix`/`isMenuCollectionVisible`/`filterMenuCollections`, `MENU_ZONES`) + 15 tests |
| BL-13 | Menu generator (framer enrichi) | 📋 planned S50-01 | new derived store + `MachineFrameManager` enrichment |

**Foundation contract for all leaf stories:**
- Permitted collections: `machine.rights.allowedCollections('L')`.
- Visibility filter: `filterMenuCollections(zone, collections, { prefs, permittedCollections, isDev })` from `menuPrefs.ts`. **Never build `'app_menu_' + table` literals** (convention not contract — memory `machine_app_naming`).
- Tree/decoration: consume BL-13's generator store, never re-join rights+prefs+appscheme inline.
- Reads via `machine.store` (reactive); writes via `machine.action` (CLAUDE.md invariants 8/10).
- Every custom tag needs explicit `display` CSS (invariant 7). Run `pseudo-html` then `css-base` before building — tag names below are suggestions, the skill is authoritative.

---

## 4. BL-13 — Menu generator (the keystone, planned S50-01)

**Goal:** a reactive `$derived` store joining rights(L) ∩ prefs ∩ appscheme/appscheme_type
→ typed tree grouped by type, with label/icon/color and launch verbs. Framer carries the
menu model + launch verbs; the builder stays pure/reactive (don't bloat the singleton).

**Files:** new `src/lib/main/menu/menuModel.svelte.ts` (or similar) + `MachineFrameManager.ts` enrichment.

**Shape (target):**
```ts
type MenuNode = {
  collection: string;       // appscheme.code
  label: string;            // appscheme.name
  icon?: string; color?: string;
  type: string;             // appscheme_type.code
  verbs: MenuVerb[];        // resolved launch actions, rights-gated
};
type MenuVerb = { id: 'espace'|'creer'|...; label: string; run(): void; right: 'R'|'C'|'U'|'D'|'L'|'ADMIN' };
type MenuTree = { type: string; typeLabel: string; typeIcon?: string; nodes: MenuNode[] }[];

// per-zone:
useMenuTree(() => zone) → { tree: MenuTree }  // reactive
```

**Launch verbs** owned by framer (the "framer à enrichir" hint):
| Verb | Right | Framer call |
|------|-------|-------------|
| Espace | L | `framer.loadFrame('explorer', collection)` |
| Créer | C | `framer.loadInDialog('form', collection)` |
| Parcourir | L | `framer.loadFrame('explorer', collection)` (browse variant) |
| (Recherche/Comparer/Trier/console/images) | R/ADMIN/… | guarded — verb only present when its frame is registered (`machine.componentRegistry.has(key)`); otherwise omitted. Most target frames not built yet → scope to Espace+Créer first. |

**Acceptance:** derived tree from mocked rights+prefs+appscheme fixtures; re-derives on
pref/right change; empty-prefs-default + dev-bypass paths (reuse `menuPrefs.ts` semantics);
verbs filtered by `allowedCollections`/registry presence. Unit tests, full suite green.

**ADR candidate:** framer ownership of the menu model (flag `> Assumed:` if revisited).

---

## 5. Leaf stories (BL-14 … BL-19)

### BL-14 — Sidebar tree by appscheme_type — effort M — dep BL-13

Replace the flat sidebar `<DataList collection="appscheme" linkCollectionField="code" />`
with the generator tree (zone `side`), grouped by `appscheme_type`, collapsible,
icons/colors. Open/closed state persists (legacy `gui_menu_visible` pref).

- **Files:** `src/lib/shell/layout/` — new `MenuTree.svelte` (+ `MenuTreeGroup`/`MenuTreeItem` if split); wire into `TemplateShell.svelte` sidebar zone. Remove the flat DataList sidebar usage.
- **Consumes:** `useMenuTree('side')` (BL-13).
- **pseudo-html:** suggested tags `menu-tree` / `menu-tree-group` / `menu-tree-item` — confirm via skill; each needs explicit `display`.
- **Acceptance:** sidebar renders grouped collapsible tree filtered by right+pref; collapse state persisted via `machine.action('appuser_prefs', …)`; dev-mode shows all permitted; empty-pref shows all permitted. Component test with mocked generator.

### BL-15 — Waffle / start overlay — effort L — dep BL-13

Legacy `app_gui_start_menu.php` / `menu.production` screen. Full-screen-ish overlay:
columns per `appscheme_type`, each listing collections (zone `start`, pref `app_menu_start`).
Launch a single collection (its verbs) or `launch_all` for a whole type. Toggled from a
TaskBar waffle button.

- **Files:** new `src/lib/shell/frame/start/StartMenu.svelte` (or `shell/layout/WaffleMenu.svelte`); register if frame-loaded; add waffle toggle button in `TaskBar.svelte`.
- **Consumes:** `useMenuTree('start')` + framer launch verbs; `launch_all` iterates a type's nodes.
- **pseudo-html:** `waffle-overlay` / `waffle-column` / `waffle-launch` — confirm via skill.
- **⚠ TaskBar overlap:** touches `TaskBar.svelte` (waffle button) — do NOT run in the same sprint as BL-18 (gear, also TaskBar).
- **Acceptance:** overlay opens from TaskBar; columns by type; single + launch_all wire to framer verbs; pref/right filtered; dev/empty default policy. Component test.

### BL-16 — Today dashboard frame — effort L — dep BL-13

Legacy `app_gui_today.php` / `today` screen. Frame loaded in zone `main`. Three sections:
- **quick-create** (pref `app_menu_create`, zone `create`) — `Créer` verb per permitted collection.
- **my-lists** — quick access to lists of records the user owns.
- **échéancier** — start/end-date timeline (`dateDebut`/`dateFin`).

- **Files:** new `src/lib/shell/frame/today/Today.svelte` + componentRegistry entry `'today'`. (Note: existing `'dashboard'` → `Dashboard.svelte` is the Espace/accueil frame — Today is distinct, do not merge.)
- **Consumes:** `useMenuTree('create')` for quick-create; `machine.store` for my-lists/échéancier (owner filter, date fields).
- **pseudo-html:** `today-dashboard` / `today-section` / `today-create` / `today-echeancier` — confirm via skill.
- **Acceptance:** quick-create lists permitted+pref collections, fires `Créer` verb; my-lists shows owned records; échéancier renders date-bounded records; registry entry added + exported. Component test for quick-create section at minimum.

### BL-17 — Rights-gated contextual launch menu — effort M — dep BL-11, BL-13

Build the per-collection action menu from R/C/U/D/L (MAIN_MENU.md §2 table). `ContextMenu`
host already exists (`framer.openContextMenu` + `ContextMenu.svelte`); actions are NOT yet
rights-gated or wired to verbs.

| Right | Action | Framer verb (built / guarded) |
|-------|--------|-------------------------------|
| C | Créer | `loadInDialog('form', collection)` ✅ |
| L | Espace | `loadFrame('explorer', collection)` ✅ |
| L | Parcourir | explorer browse ✅ |
| R | Recherche rapide | guarded (frame TBD) |
| R | Comparer | guarded (frame TBD) |
| ADMIN | Trier | guarded (frame TBD) |
| L + dateDebut + status | console | guarded (frame TBD) |
| any | images | guarded (frame TBD) |

- **Files:** `src/lib/data-ui/fragments/ContextMenuContent.svelte` — build entries from `machine.rights.checkAccess(collection, op)` per verb; reuse BL-13 verb resolver.
- **⚠ Single-file contention:** `ContextMenuContent.svelte` is also touched by **BL-22** (include RecordToolbar) and **BL-24** (useRecordData extraction). These three must be **sequenced single-file, never parallel**. Recommended order: BL-24 (record-data refactor) → BL-22 (RecordToolbar inclusion) → BL-17 (rights-gated verbs), so BL-17 builds on clean record-data + toolbar plumbing. Also migrate the file off `onMount`+`machine.collection().delete` to runes+`machine.action` while here (noted in BL-22).
- **Acceptance:** menu entries appear only for rights the user holds; built verbs fire framer calls; unbuilt verbs omitted (registry-guarded); no `onMount`/`machine.collection` write left. Component test with mocked rights.

### BL-18 — Per-zone settings gear — effort M — dep BL-12, BL-13

Legacy `app_gui_tile_user.php`. Replace the mock gear (`TaskBar.svelte:61`). Per zone
(`side`/`start`/`create`/`panel`), toggle which **permitted** collections show; writes
`appuser_prefs` via `machine.action` (`upsertOn` per scope, keys from `menuPrefs.ts`).
Orange warning when no pref configured (mirrors empty-pref default policy).

- **Files:** `TaskBar.svelte` (real gear button + open) + new `src/lib/shell/layout/MenuSettings.svelte` (the per-zone editor).
- **Consumes:** `allowedCollections` (candidates) × `menuPrefsScope(zone, collection)` (pref keys) × current `appuser_prefs`.
- **⚠ TaskBar overlap:** touches `TaskBar.svelte` — do NOT run in the same sprint as BL-15.
- **pseudo-html:** `menu-settings` / `menu-settings-zone` / `menu-settings-toggle` — confirm via skill.
- **Acceptance:** gear opens editor; per-zone toggles list permitted collections; toggle writes `appuser_prefs` via `machine.action`; "unset" ≠ "hidden" preserved (don't persist defaults); warning shown when zone has no prefs. Component test for write path.

### BL-19 — Right recent-history panel — effort M — dep BL-12, BL-13

Legacy `app_gui_panel_list.php` / `app_gui_panel.php`. Right-zone panel, per collection
(zone `panel`, pref `app_panel`), shows `appuser_history` (last 30 days, limit 15). Data
+ `machine.action` already exist (memory) — UI only.

- **Files:** new `src/lib/shell/layout/RecentPanel.svelte` + wire into `TemplateShell.svelte` right zone.
- **Consumes:** `machine.store('appuser_history', { … })` filtered to 30d/15 per permitted+pref collection; click → framer navigate to the record.
- **pseudo-html:** `recent-panel` / `recent-panel-group` / `recent-panel-item` — confirm via skill.
- **No TaskBar / no ContextMenu overlap** — clean new component.
- **Acceptance:** panel lists recent history grouped by collection, 30d/15 cap, pref/right filtered; click navigates; dev/empty default policy. Component test.

---

## 6. Recommended 2-agent sprint sequencing

All leaf stories gate on S50-01 (BL-13). After it lands:

| Sprint | Agent A | Agent B | Overlap-safe? | Rationale |
|--------|---------|---------|---------------|-----------|
| 50 (current) | S50-01 BL-13 (keystone) | S50-02 BL-20 (groupBy fix) | ✅ disjoint | new menu layer vs DataList branches |
| 51 | BL-14 sidebar tree | BL-16 today dashboard | ✅ disjoint | TemplateShell sidebar vs new `today` frame |
| 52 | BL-19 recent panel | BL-15 waffle overlay | ✅ disjoint | right-zone component vs start overlay+waffle btn |
| 53 | BL-18 settings gear | BL-24 useRecordData (ContextMenu prep) | ✅ disjoint | TaskBar gear vs ContextMenuContent record-data |
| 54 | BL-22 RecordToolbar in ContextMenu | (single-file — pair with non-ContextMenu story, e.g. BL-21 snippet rename) | ⚠ ContextMenu serialized | BL-22 after BL-24 |
| 55 | BL-17 rights-gated contextual menu | (pair with any remaining/polish) | ⚠ ContextMenu serialized | BL-17 last on that file |

**Hard overlap rules (enforce in every sprint pick):**
1. `TaskBar.svelte` — BL-15 (waffle) and BL-18 (gear) must be in **different** sprints. ✅ (52 vs 53).
2. `ContextMenuContent.svelte` — BL-24, BL-22, BL-17 are **single-file, serialized**, in that order. Never two in one sprint, never parallel with each other.
3. `TemplateShell.svelte` — BL-14 (sidebar zone) and BL-19 (right zone) edit different zones of the same file. Low risk but **schedule in different sprints** (51 vs 52) to avoid merge churn. ✅.

**Still ADR-blocked, not in this epic:** BL-05, BL-23.

---

## 7. Pre-build checklist per UI story (BL-14..BL-19)

- [ ] `pseudo-html` skill first — confirm tag names + file hierarchy + display-hint suffixes.
- [ ] `css-base` skill — tokens, no hardcoded px/rem/colors, dark mode.
- [ ] Every custom tag has explicit `display` CSS (invariant 7).
- [ ] Reads via `machine.store`, writes via `machine.action` (invariants 8/10).
- [ ] Consume BL-13 generator + `menuPrefs.ts` — no inline rights/prefs joins, no `'app_*_'+table` literals.
- [ ] New exports added to `src/lib/index.ts`.
- [ ] `pnpm run check` 0 errors, `pnpm run test` green, full suite captured to test artifact.

---

## 8. Decoration data risk (surface before BL-14)

Menu tree needs `icon/color/label/type` per `appscheme` record (legacy `iconAppscheme`,
`colorAppscheme`, `nomAppscheme`, `idappscheme_type`). Confirm every business collection's
`appscheme` row carries these + a valid `appscheme_type` fk, or the tree renders blank.
**Seed/migration check is a BL-13/BL-14 precondition** — if data is missing, add a story
(BL-25 "appscheme menu-decoration seed audit") ahead of BL-14.
