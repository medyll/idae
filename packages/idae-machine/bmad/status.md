# BMAD Status — idae-machine v2
> Vérifié: 2026-05-17 | Progress: 89% | Phase: development

---

## Sprint 13 — Foundations ✅ complete

| Story | Titre | Priorité | État | Dépend |
|-------|-------|----------|------|--------|
| S13-01 | Type `schemelink` (polymorphic FK, registry + tests, no UI) | 🟠 high | ✅ complete | — |
| S13-02 | Meta-collections `_prefs`/`_activity`/`_history` dans idae-model-core.ts | 🟠 high | ✅ complete | — |
| S13-03 | Service `machine.prefs` (key-value IDB dynamique) | 🟠 high | ✅ complete | S13-02 |
| S13-04 | Service `machine.activity` (event log insert-only) | 🟡 medium | ✅ complete | S13-02 |
| S13-05 | Service `machine.history` (projection agrégée recents) | 🟡 medium | ✅ complete | S13-02 |
| S13-06 | `Pane` overlay (workspace, "gui" interdit) | 🟡 medium | ✅ complete | S13-03/04/05 |

---

## Décisions architecturales clés (2026-05-17)

- **schemelink** = nom retenu (pas symlink/datalink/collectionlink). Polymorphic FK : `{ collection, collection_value, collection_vars? }`. FS analogy: hard link (fk) vs soft link (schemelink).
- **"gui"** = mot interdit dans tous les noms. `GUIPane` → `Pane`/`Workspace`.
- **Drops** : `agent_recherche` (useless), `activity_expl` (useless).
- **3 meta-collections core** : `_prefs` (key-value), `_activity` (log brut insert-only), `_history` (projection agrégée).
- **Meta-collections** dans `idae-model-core.ts` suivent le format `appModelDeclaration` (simple `{required, readonly}`, fks à part), PAS le format user `field('xxx')`.
- **Pattern `table` + `table_value`** legacy révélé → devient `collection` + `collection_value` (+ `collection_vars` venu de activity_expl).
- **machine.rights** ajouté (getter sur singleton machineRights).
- **`@medyll/css-base`** = lib de style (pnpm linked).
- **Tailwind purgé** complètement.

---

## Bugs ouverts

Aucun. BUG-01 (CreateUpdate) et BUG-02 (qoolie build) closed.

---

## Résultats tests (2026-05-17)

| Suite | Commande | Tests | État |
|-------|---------|-------|------|
| Server | `cd server && pnpm vitest run` | **82/82** | ✅ |
| Client | `pnpm vitest run --project server` | **325/325** | ✅ |
| idae-sync | `npm run build` + tests | **93/93** | ✅ |
| qoolie | `npm run build` | exit 0 | ✅ |

**Total green: 500/500**

---

## Context clé

- **MongoDB demo org**: seeded — demoScheme (6 collections) + demoSeed + users (admin/user/viewer)
- **MongoDB legacy exploré** : `idaenext_sitebase_*` analysé (agent_pref/history/activity)
- **Machine API surface** : `collection()`, `sync`, `destroy()`, `rights`, `init({sync,stateEngine,hooks})`
- **Prochaine action** : S13-01 (type schemelink)
