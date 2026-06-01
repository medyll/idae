# Sprint 6 — qoolie self-contained engine

**Date:** 2026-05-20  
**Goal:** Make qoolie 100% distributable — internalize idae-idbql engine, remove `$state` from event bus, add Svelte adapter. `@medyll/idae-idbql` stays intact in monorepo.

---

## Context

### Problem

```
qoolie  →  @medyll/idae-idbql  (SvelteKit, .svelte.ts)
              IdbqlEvent uses  dataState = $state({})
              svelte-package does NOT compile $state in dist
              → distribution brisée, workaround signals.dataVersion requis
```

### Decision

- `@medyll/idae-idbql` reste 100% fonctionnel dans le monorepo (inchangé)
- qoolie **internalise** le engine IDB (copie + adapte les fichiers core)
- qoolie supprime sa dépendance vers `@medyll/idae-idbql`
- `$state` disparaît du engine — remplacé par `EventTarget` pur JS
- L'adapter Svelte (`src/adapters/svelte/`) souscrit aux events → crée `$state` local dans les composants consommateurs
- qoolie build = Vite → dist/ plain JS → distributable sans SvelteKit

### Architecture cible

```
qoolie/src/
├── lib/
│   ├── engine/                    ← NOUVEAU (migré depuis idae-idbql)
│   │   ├── IdbEngine.ts           ← createDb() (ex idbqlCore.ts)
│   │   ├── IdbSchema.ts           ← Schema class (ex idbqlSchema.ts)
│   │   ├── IdbCollection.ts       ← CollectionCore (ex collection.svelte.ts, sans runes)
│   │   ├── IdbEventBus.ts         ← EventTarget pur, SANS $state (ex idbqlEvent.svelte.ts)
│   │   ├── IdbState.ts            ← CollectionState sans adapter (ex idbstate.svelte.ts)
│   │   ├── pathResolver.ts        ← copie directe
│   │   └── types.ts               ← IdbqModel, Where, ResultSet…
│   │
│   ├── Qoolie.ts                  ← rewire → engine/ (plus idae-idbql)
│   ├── QoolieCollection.ts        ← rewire → engine/
│   └── … (sync, validation, encryption — inchangés)
│
└── adapters/
    ├── svelte/                    ← NOUVEAU
    │   ├── index.ts
    │   ├── useQoolieCollection.svelte.ts   ← $effect → EventBus → $state local
    │   └── useQoolieSync.svelte.ts
    ├── react/                     ← existant, déplacé depuis src/react/
    └── vue/                       ← existant, déplacé depuis src/vue/
```

### Règle d'or

> `src/lib/engine/` = zéro import Svelte. Pure TypeScript. Testable en Node.  
> `src/adapters/svelte/` = seul endroit où `$state`, `$effect`, `$derived` sont autorisés.

---

## Stories

### S6-01 — engine/types.ts + engine/pathResolver.ts

**Effort:** XS  
**Description:** Poser les fondations du engine — types et utilitaire de résolution de chemins.

**Acceptance:**
- Copier/adapter `IdbqModel`, `Where`, `ResultSet`, `ResultsetOptions` depuis idae-idbql
- Copier `pathResolver.ts` (zéro changement fonctionnel)
- Aucun import depuis `@medyll/idae-idbql`
- Tests unitaires pathResolver passent dans vitest node

---

### S6-02 — engine/IdbSchema.ts + engine/IdbEngine.ts

**Effort:** S  
**Description:** Schema IndexedDB et factory `createDb()` internes.

**Acceptance:**
- `IdbSchema.ts` — crée/migre la structure IndexedDB (version, keyPath, indexes)
- `IdbEngine.ts` — `createDb(model, version)` retourne `{ idbDatabase, idbql }`
- Zéro import `@medyll/idae-idbql`
- Test: createDb avec fake-indexeddb → collections accessibles

---

### S6-03 — engine/IdbCollection.ts

**Effort:** S  
**Description:** `CollectionCore` — opérations CRUD sur une collection IDB.

**Acceptance:**
- Adapté depuis `collection.svelte.ts` → `.ts` pur (aucun `.svelte.ts`)
- Méthodes: `getAll()`, `where(q)`, `get(id)`, `add(d)`, `put(d)`, `update(id, d)`, `delete(id)`, `updateWhere(q,d)`, `deleteWhere(q)`, `count(q)`
- Sur chaque mutation : appelle `eventBus.emit(collection, op, data)` (injection de dépendance)
- Tests CRUD avec fake-indexeddb

---

### S6-04 — engine/IdbEventBus.ts

**Effort:** S  
**Description:** Bus d'événements pur JS — remplace `idbqlEvent.svelte.ts` + son `$state`.

**Acceptance:**
- `IdbEventBus extends EventTarget`
- `dataState: Record<string, any[]>` = plain object (pas de `$state`)
- `emit(collection, op, data)` → mutate `dataState` + `this.dispatchEvent(new CustomEvent('change', { detail: { collection, op } }))`
- `on(collection, handler)` / `off(collection, handler)` — helpers filtrés par collection
- Singleton exporté : `export const idbEventBus = new IdbEventBus()`
- Tests : emit → dataState mis à jour, listener appelé

---

### S6-05 — engine/IdbState.ts

**Effort:** S  
**Description:** `CollectionState` — lecture réactive via `dataState` du bus.

**Acceptance:**
- Adapté depuis `idbstate.svelte.ts` — suppression de statorAdapter, suppression de `$state`
- `getAll()` → `idbEventBus.dataState[collection]`
- `where(q)` → filtre sur `dataState[collection]`
- Mutations délèguent à `IdbCollection` (qui émet sur le bus)
- Tests : add → getAll() retourne le nouveau record

---

### S6-06 — Rewire Qoolie.ts + QoolieCollection.ts

**Effort:** M  
**Description:** Couper la dépendance vers `@medyll/idae-idbql`, brancher sur `engine/`.

**Acceptance:**
- `Qoolie.ts` importe `createDb` depuis `./engine/IdbEngine.js`
- `Qoolie.ts` importe `createIdbState` depuis `./engine/IdbState.js`
- `QoolieCollection.ts` importe `CollectionState` depuis `./engine/IdbState.js`
- `package.json` : `@medyll/idae-idbql` retiré des `dependencies`
- `toIdbqModel()` supprimé (plus besoin de convertir)
- Tous les tests existants Qoolie + QoolieCollection passent

---

### S6-07 — adapters/svelte/

**Effort:** M  
**Description:** Adapter Svelte — souscrit aux events `IdbEventBus` → `$state` local.

**Acceptance:**
- `useQoolieCollection.svelte.ts` :
  ```ts
  export function useQoolieCollection<T>(qoolie: Qoolie<any>, collection: string) {
      let items = $state<T[]>([]);
      $effect(() => {
          items = qoolie.collection[collection].getAll() ?? [];
          const handler = (e: CustomEvent) => {
              if (e.detail.collection === collection)
                  items = qoolie.collection[collection].getAll() ?? [];
          };
          qoolie.eventBus.addEventListener('change', handler as EventListener);
          return () => qoolie.eventBus.removeEventListener('change', handler as EventListener);
      });
      return { get items() { return items; } };
  }
  ```
- `useQoolieSync.svelte.ts` — adapter sync (status réactif)
- `index.ts` — re-export
- `src/reactive/reactive.svelte.ts` existant : fusionné ou remplacé
- Fichiers `.svelte.ts` exportés via condition `"svelte"` dans `package.json`

---

### S6-08 — Build + tests finaux

**Effort:** S  
**Description:** Vérification build distributable, suppression `signals.dataVersion` dans idae-machine.

**Acceptance:**
- `pnpm run build` dans qoolie → dist/ sans aucune référence `svelte/internal`
- `dist/index.js` importable en Node sans SvelteKit
- `@medyll/idae-idbql` absent de `dependencies` qoolie
- Dans idae-machine : `signals.dataVersion` + `bumpDataVersion` supprimés de `DataList`, `SchemeList`, `machineSignals.svelte.ts`
- idae-machine passe `pnpm run test` 440+/440

---

## Dependency Graph

```
S6-01 (types + pathResolver)
  └─▶ S6-02 (IdbEngine + IdbSchema)
        └─▶ S6-03 (IdbCollection)
              └─▶ S6-04 (IdbEventBus)
                    └─▶ S6-05 (IdbState)
                          └─▶ S6-06 (Rewire Qoolie)
                                ├─▶ S6-07 (Svelte adapter)
                                └─▶ S6-08 (Build + cleanup)
```

## Effort

| ID | Story | Effort |
|----|-------|--------|
| S6-01 | types + pathResolver | XS |
| S6-02 | IdbEngine + IdbSchema | S |
| S6-03 | IdbCollection | S |
| S6-04 | IdbEventBus | S |
| S6-05 | IdbState | S |
| S6-06 | Rewire Qoolie | M |
| S6-07 | Svelte adapter | M |
| S6-08 | Build + cleanup | S |

**Total estimé : 2–3 jours dev**

## References

- `D:\development\idae\packages\idae-idbql\src\lib\` — source à adapter
- `D:\development\idae\packages\qoolie\src\lib\` — destination
- `D:\development\idae\packages\idae-machine\src\lib\main\machineSignals.svelte.ts` — workaround à supprimer en S6-08
