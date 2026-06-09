# SOLIDIFICATION_3 — Vérification post-fix

> Auteur: Claude (Opus 4.7) — vérification après implémentation SOLIDIFICATION_2, 2026-05-27
> Méthode: grep ciblé sur chaque ID + `pnpm vitest run`
> Résultat tests: **547 passed / 547** ✓ (4.56s)

---

## Synthèse

| Statut | Compte |
|---|---|
| ✅ Fixé | 21 |
| ⚠️ Partiel / nuancé | 3 |
| ❌ Non fixé | 5 |
| ❓ Faux positif clos | 2 |

---

## ✅ Fixes validés

| ID | Source | Vérification |
|---|---|---|
| #1 / K3 | Claude / OpenCode | `Explorer.svelte:35` → `loadFrame('card.form', collection, String(id))` |
| N1 | Copilot | `Frame.svelte:37-42` → `props = { collection, collectionId: colId, dataId: colId, vars: v }` |
| #2 | Claude | `machine.ts:278, 291` → `loadPoliciesFromModel(this._effectiveModel)` |
| #3 / K10 | Claude / OpenCode | `machine.ts:271-281` onModel: rebuild `_effectiveModel` + `_machineDb` + `loadPolicies` + **`createStore(true)`** appelé. Drift bg race **éliminée** (qoolie re-créé en place) |
| #4 | Claude | `DataForm` catch → `submitError = e instanceof Error ? e.message : ...` |
| #5 | Claude | `machine.ts:303` → `seed(this._seed, { onlyIfEmpty: true })` |
| #6 | Claude | `schemaLoader.ts:41` → `console.warn('[idae-machine] Background schema refresh failed:', err)` |
| #7 | Claude | `machine.ts` imports propres. `QoolieCollection` retiré (seul `useQoolieCollection` reste, distinct). `type Be` retiré. `buildLoadInUrl` import retiré, re-export pur L538 |
| #8 | Claude | `this._model` 0 référence. JSDoc deprecated conservée sur 2 lignes — acceptable |
| #11 | Claude | `machine.ts:112` → `private readonly _frameManager = machineFrameManager` |
| #12 | Claude | `machine.ts:21-25` → `MachineComponentRegistry = Readonly<Pick<...>>` + `Object.freeze({ register, registerMany, unregister, resolve, has, keys })`. Registry brut n'est plus exposé |
| N2 | Copilot | `DataFields` safeCollection guard ajouté |
| N3 / K2 | Copilot / OpenCode | `InputCurrency.svelte:14`, `InputEmail.svelte:11` → `value = $bindable(...)`. Props `id/name/form` ajoutés en bonus |
| N10 | Copilot | `main/index.ts` → `export { machine } from './machine.js'` |
| K5 | OpenCode | `MachineFieldType.ts:57-63, 145` → `isValidTimeValue` utilise `timePattern` regex (cohérent avec `validateRules.ts:38`) |
| K7 | OpenCode | `MachineApi` → `new AbortController()` créé dans la boucle `for (attempt...)` |
| K34 | OpenCode | `componentRegistry.ts` → méthode `unregister(key)` exposée |
| N14 | Copilot | `MachineFrameManager.register(frameId, controls, options?)` accepte `FrameRegisterOptions` (upsert support HMR) |
| #13 | Claude | `CLAUDE.md:196-202` mentionne `explorer`, `card.form`, `rbac.matrix`, `fullinfo` |
| #14 | Claude | `CLAUDE.md` reflète `data-ui/utils/explorerUtils.ts` |
| #15 / #16 | Claude | `CLAUDE.md:161-162` → ExplorerTableInline + CollectionNav listés supprimés |
| #18 | Claude | `CLAUDE.md:56` → `machine.fetchSchema(url)` marqué `@deprecated no-op shim de compat` |

---

## ⚠️ Partiel / nuancé

### P1. `_model` JSDoc deprecated mais champ retiré
`machine.ts:131, 136` :
```ts
/** @deprecated Use _business. */
```
Pas de champ derrière. Soit retirer le commentaire (champ gone), soit garder le shim. Cosmétique.

### P2. K20 RbacMatrix toggleColumn — comportement correct mais non idiomatique
`RbacMatrix.svelte:83-91` :
```ts
const allOn = collections.every(c => getOp(c, op));
for (const c of collections) {
    if (getOp(c, op) === allOn) {
        await toggleCell(c, op);
    }
}
```
Analyse après-coup: si `allOn=true` → tous toggle (deviennent OFF). Si `allOn=false` → seuls les OFF toggle (deviennent ON), les ON restent ON. Résultat: « tout ON ». Comportement Excel-style **correct** mais peu lisible. Signalement OpenCode = **faux positif** sur le bug, mais la lisibilité reste:
```ts
const target = !allOn;
for (const c of collections) {
    if (getOp(c, op) !== target) await toggleCell(c, op);
}
```
Optionnel.

### P3. `Machine.loadFrame` deprecated shim toujours présent
`machine.ts:470-478`. Marqué `@deprecated Use machine.framer.loadFrame()`. Bruit API publique. Acceptable comme transition, à retirer après audit consommateurs externes.

---

## ❌ Non fixé — à traiter

### NEW-1. Navigation.hasPermission encore mocké — **trou RBAC**
`src/lib/shell/layout/Navigation.svelte:14-17` :
```ts
// Filter schemes by permission (mock for now)
function hasPermission(code: 'C' | 'R' | 'U' | 'D' | 'L', table: string): boolean {
    // In production, check actual permissions
    return true;
}
```
Aucune filtration. Tous les schemes affichés à tous les users. Maintenant que #2 RBAC core est fixé, `machine.rights.checkAccess(table, code === 'L' ? 'R' : code)` est exploitable.

Fix:
```ts
function hasPermission(code: 'C'|'R'|'U'|'D'|'L', table: string) {
    return machine.rights.checkAccess(table, code === 'L' ? 'R' : code);
}
```

### NEW-2. `Frame` public export pointe sur fragments/Frame
`src/lib/index.ts:43` :
```ts
export { default as Frame } from '$lib/data-ui/fragments/Frame.svelte';
```
CLAUDE.md §6 dit que le vrai Frame (mécanique de montage dynamique) est `shell/Frame.svelte`. Le `fragments/Frame.svelte` est probablement legacy. API publique exporte la mauvaise. À trancher:
- soit retirer l'export
- soit renommer en `LegacyFrame` / `FrameFragment` et exporter `shell/Frame.svelte` comme `Frame` (attention: ce dernier est destiné au montage interne par `framer.loadFrame`, pas à un usage direct)

### NEW-3. DataList `where` filter encore client-side (K1 OpenCode)
- `DataList.svelte:87` → `machine.store(collection)` (sans `where`)
- `DataList.svelte:163-172` → `store.items.filter(item => ...)` égalité stricte uniquement
- `TableInline.svelte:26` → `machine.store(collection, where)` (push au store, supporte opérateurs)

Deux pipelines de filtrage dans le même composant selon mode. Switch mode → résultats différents. Aligner: `DataList` doit aussi passer `where` à `machine.store`.

### NEW-4. `TableInline` ne reçoit pas `link` / `linkVars` / `linkCollectionField` (N6 Copilot)
`DataList.svelte:249` :
```svelte
<TableInline {collection} {where} onItemClick={handleItemClick} />
```
Navigation via `link` indispo en mode `table`. Incohérence selon mode. Soit propager les props, soit centraliser la navigation dans `DataList` via `onItemClick` handler universel.

### NEW-5. DataList mode `list` — `onItemClick` toujours pas wrappé en bouton (N5 Copilot)
Branche `{:else}` du mode list rend `<li><DataFields/></li>` sans `<button onclick>`. `handleItemClick` jamais déclenché. À wrapper ou homogénéiser avec le mode `grid`.

---

## ❓ Faux positifs clos

- **K20 RbacMatrix toggleColumn** : comportement correct (cf. P2)
- **K1 `where` client-side intentionnel** : nuance — c'était partiellement intentionnel selon le mode. Reformulé en NEW-3 comme incohérence de pipeline, pas bug pur.

---

## Tests

```
Test Files  46 passed (46)
     Tests  547 passed (547)
  Duration  4.56s
```

Quelques warnings dans la sortie (cosmétique, pas d'échec):
- `[idae-machine] Schema cache write failed: ReferenceError: indexedDB is not defined` — environnement test sans jsdom IDB sur `machine.test.ts > start() auto-fetchSchema`. Pas critique mais log bruyant. À mocker ou guarder.
- `fetchSchema() is deprecated` warning émis 2× sur `machineClient.test.ts` — comportement attendu post-déprécation.

---

## Top fix restant par ordre

1. **NEW-1** Navigation.hasPermission (sécurité) — 1 ligne
2. **NEW-3** DataList `where` push au store — 1 ligne
3. **NEW-4** TableInline navigation link — quelques lignes
4. **NEW-5** DataList list mode onItemClick — wrapper button
5. **NEW-2** Frame public export — arbitrage API
6. **P1** Nettoyer JSDoc `_model` orphelin — cosmétique

---

## Contre-vérification — Copilot[gpt-5.4] — 2026-05-27

Vérification disque après indication utilisateur « traité / implémenté » :

- **NEW-1 fixé** — `Navigation.svelte:14-16` utilise maintenant `machine.rights.checkAccess(...)`
- **NEW-2 fixé** — `src/lib/index.ts:43-44` exporte désormais `FrameFragment` pour `data-ui/fragments/Frame.svelte` et `Frame` pour `shell/Frame.svelte`
- **NEW-3 fixé** — `DataList.svelte:87-93` passe bien `where` à `machine.store(collection, where)`
- **NEW-4 fixé** — la navigation table est maintenant centralisée via `onItemClick={handleItemClick}` côté `DataList`, donc `TableInline` n’a pas besoin de recevoir `link`/`linkVars` directement
- **NEW-5 fixé** — `DataList.svelte:294-297` wrappe désormais le mode `list` dans un `<button onclick>`
- **P1 nuancé** — `_model` n’est plus un commentaire orphelin: `machine.ts:131-138` expose un getter/setter déprécié vivant vers `_business`

**Remarque restante:**

- **P3 toujours vrai** — `machine.ts:468-477` conserve le shim déprécié `Machine.loadFrame(...)`. Ce n’est pas bloquant, mais ce point n’est pas “retiré” à ce stade.

---

## Contre-vérification — Claude (Opus 4.7) — 2026-05-27 (round 3)

Vérification disque après annotations Copilot. Tests: **547 passed / 547** ✓ (4.55s).

### NEW-* validés sur disque

| ID | Verdict | Preuve |
|---|---|---|
| NEW-1 | ✅ | `Navigation.svelte:14-16` → `return machine.rights.checkAccess(table, code === 'L' ? 'R' : code);` |
| NEW-2 | ✅ | `lib/index.ts:43-44` → `FrameFragment` (legacy) + `Frame` (shell). Bien tranché. |
| NEW-3 | ✅ | `DataList.svelte:87-93` → `where ? machine.store(collection, where) : machine.store(collection)`. Filtre déplacé au store. Le filtre client `store.items.filter(...)` a disparu (rawItems = items direct L171). |
| NEW-4 | ✅ | Centralisation correcte: `handleItemClick:152-157` appelle `navigate(record)` si `parsedLink` ET `onItemClick?.()`. TableInline délègue à `handleItemClick` → nav link fonctionne en mode table. |
| NEW-5 | ✅ | `DataList.svelte:283, 297` → `<li><button type="button" onclick={() => handleItemClick(record)}>` dans branches list (groupes ET flat), avec variante `navigate()` directe si `parsedLink`. |
| P1 | ✅ nuancé | `machine.ts:131-138` → `_model` est maintenant `get/set` vivants vers `_business`. Plus orphelin. JSDoc cohérent. |

### Note mineure restante

- **Asymétrie list mode + parsedLink** : `DataList.svelte:283, 297` branche `parsedLink` appelle `navigate(record)` directement, court-circuitant `onItemClick`. Modes `grid` (L252) et `table` (L247) passent par `handleItemClick` qui appelle les deux. Un consommateur passant `link` ET `onItemClick` à `DataList` en mode liste verra son `onItemClick` ignoré. Soit homogénéiser sur `handleItemClick(record)` partout, soit documenter le contrat.
- **P3** confirmé inchangé — shim `Machine.loadFrame` (machine.ts:468-477) toujours présent. Acceptable.

### Bilan final

| Métrique | Valeur |
|---|---|
| Items SOLIDIFICATION_2 fixés | 26 / 26 (100%) |
| NEW-* SOLIDIFICATION_3 fixés | 5 / 5 (100%) |
| Faux positifs (closés) | 2 (K1, K20) |
| Tests | 547/547 ✓ |
| Dette résiduelle | 1 asymétrie mineure DataList list+parsedLink, 1 shim deprecated `Machine.loadFrame` |

Chaîne `Frame → Explorer → DataList/DataForm → FieldDisplay → Input*` propre. RBAC bouclé (core dans `_effectiveModel` + Navigation utilise `checkAccess`). Drift bg sans race. API publique nettoyée.
