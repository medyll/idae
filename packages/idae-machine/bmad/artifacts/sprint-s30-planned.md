# Sprint 30 — machine.init({ core, business }) + seed unifié

**Goal:** Une seule déclaration. Un seul seed. Un seul pipeline. `appscheme` et `vehicle` traités identiquement.

**Date:** 2026-05-22
**Status:** planned
**Depends on:** S28, S29 (S29 mis en pause — UI, pas bloquant)

---

## Principe

```
Avant:  machine.init({ model: demoScheme })
Après:  machine.init({ core: appModelDeclaration, business: demoScheme })
```

`core` = collections système (appscheme, appuser_*, appimage_preset…) — framework territory.
`business` = collections métier (vehicle, reservation…) — app territory.

Même format `MachineModel` pour les deux. Même seed. Même pipeline runtime.

---

## Stories

### S30-01 — machine.init : `model` → `core` + `business` (S)

**Fichier:** `src/lib/main/machine.ts`

**AC:**
- `init(opts)` accepte `core?: MachineModel` et `business?: MachineModel`
- `model` conservé avec `@deprecated` → alias vers `business` pour rétro-compat
- `_coreModel` et `_businessModel` comme champs internes
- Aucune logique changée dans `start()` — la fusion reste dans `buildEffectiveModel`

---

### S30-02 — `buildEffectiveModel` fusionne core + business (S)

**Fichier:** `src/lib/main/machineModelBuilder.ts`

**AC:**
- Signature: `buildEffectiveModel(core?, business?)` — les deux optionnels
- Fusion: `system (hardcoded) → core → business` (business prend priorité sur collision)
- `appModelDeclaration` reste comme system de base si `core` absent
- Tests mis à jour pour nouvelle signature

---

### S30-03 — `seed()` unifié (M)

**Fichier:** nouveau `src/lib/main/machineSeed.ts`

**Contexte:** Actuellement deux mécanismes séparés:
- `seedSchemeFromModel()` — seed les rows appscheme depuis le modèle TypeScript
- `demoSeed` — seed les données métier

**AC:**
- `seed(data: Record<string, unknown[]>)` — un seul appel
- `data` peut contenir n'importe quelle collection: `{ appscheme: [...], vehicle: [...] }`
- Insère dans IDB via `machine.store[collection].create(row)` pour chaque row
- Aucune distinction core/business au moment du seed
- Export depuis `src/lib/main/index.ts`

---

### S30-04 — `demoScheme` = business uniquement (S)

**Fichiers:** `server/src/models/demo/demoScheme.ts`, `src/lib/demo/demoScheme.ts`, `src/routes/+layout.svelte`

**AC:**
- `demoScheme` ne sert plus à bootstrapper `machine.init` directement
- `+layout.svelte` utilise: `machine.init({ core: appModelDeclaration, business: demoScheme })`
- `demoScheme` est clairement documenté: "business model only — for seeding MongoDB, not machine bootstrap"
- `demoSeed` utilise le nouveau `seed()` unifié

---

### S30-05 — `appModelDeclaration` aligné format business (S)

**Fichier:** `src/lib/types/idae-model-core.ts`

**AC:**
- Vérifier que `appModelDeclaration.collections` est un `MachineModel` valide (même format que demoScheme)
- Si des champs manquent (template, fields…) → les ajouter minimalement
- Objectif: `machine.init({ core: appModelDeclaration })` seul suffit à démarrer sans erreur
- `machine.store.appscheme.getAll()` fonctionne après `start()`

---

### S30-06 — Tests (M)

**AC:**
- `machine.init({ core, business })` → `start()` → stores créés pour les deux
- `machine.init({ core })` seul → start OK (business absent = pas d'erreur)
- `machine.init({ business })` seul → start OK (core absent = appModelDeclaration par défaut)
- `machine.init({ model: demoScheme })` (legacy) → warning + fonctionne encore
- `seed({ appscheme: [...], vehicle: [...] })` insère dans les deux collections
- `machine.store.appscheme` et `machine.store.vehicle` accessibles identiquement
- Full suite: 455+N / 455+N

---

## Effort total

2S + 2S + 1M + 1M = sprint équilibré

---

## Non inclus dans S30

- Suppression de `fetchSchema` — conservé @framework-bootstrap, suppression = S31+
- `MachineDb` réactif depuis IDB:appscheme — vision long terme, pas ce sprint
- S29 (Explorer vars, CollectionNav, mode switcher) — mis en pause, reprise après S30

---

## Definition of Done

- [ ] 6/6 stories
- [ ] `machine.init({ core, business })` API publique
- [ ] `seed()` exporté et fonctionnel
- [ ] `model` deprecated mais compatible
- [ ] Tests verts
- [ ] CLAUDE.md mis à jour
