# Architecture — idae-stator v1.0
_Generated: 2026-03-16_

## Objectif

Découper le monolithe `Stator.ts` en modules cohérents, ajouter `subscribe()` et `batch()` sans breaking change, et corriger le packaging. L'API publique reste identique.

---

## Vue d'ensemble

```
src/lib/
├── index.ts                  ← re-export public API (inchangé)
└── stator/
    ├── types.ts              ← tous les types et interfaces
    ├── polyfill.ts           ← EventTarget cross-env (Browser/Node/SSR)
    ├── proxy.ts              ← moteur Proxy récursif + WeakMap cache
    ├── batch.ts              ← contexte de batch (flag + queue)
    └── stator.ts             ← assemblage final, factory stator()
```

### Dépendances entre modules

```
types.ts   ←── polyfill.ts
types.ts   ←── proxy.ts  ←── batch.ts
types.ts   ←── stator.ts ←── proxy.ts, polyfill.ts, batch.ts
index.ts   ←── stator.ts
```

Aucun cycle. Chaque module n'importe qu'en direction des couches inférieures.

---

## Composants

### `types.ts`
**Responsabilité :** définir toutes les interfaces et types exportés.

Contenu :
- `Primitive`
- `StateChangeHandler<T>`
- `StateWrapper<T>` (interne)
- `HandlerContext<T>` (interne)
- `AugmentedState<T>` — API publique complète incluant `subscribe()` et `batch()`

Pas de logique, pas d'imports externes.

---

### `polyfill.ts`
**Responsabilité :** fournir une instance `EventTarget` utilisable dans tous les environnements.

```
getEventTarget() → EventTarget
  ├── Browser      : new EventTarget()
  ├── Node.js      : registre custom léger
  └── Legacy DOM   : élément invisible
```

Isolé ici → testable indépendamment, remplaçable sans toucher au core.

---

### `proxy.ts`
**Responsabilité :** créer et gérer les Proxies récursifs.

- `createProxy(target, context)` → Proxy<T>
- WeakMap cache pour éviter le double-wrapping
- Trap `set` : détecte les vraies mutations, délègue la notification à `context.notify()`
- Trap `get` : wrap récursif des sous-objets/tableaux

`notify()` est injecté depuis `stator.ts` → découplage propre, batch-compatible.

---

### `batch.ts`
**Responsabilité :** gérer le contexte de batch global.

```typescript
// API interne
batchContext = {
  active: boolean,
  pending: Set<() => void>   // callbacks de notification en attente
}

function batch(fn: () => void): void
  // active le contexte, exécute fn, flush les notifications une fois
```

- Un seul contexte global (suffisant pour usage synchrone)
- Si `batchContext.active === true` lors d'une mutation → la notification est mise en queue
- À la fin de `batch()` → toutes les notifications en queue sont appelées une fois

---

### `stator.ts`
**Responsabilité :** factory principale, assemblage de tous les modules.

```typescript
function stator<T>(initialState: T): AugmentedState<T>
```

Crée :
1. Un `StateWrapper` avec `_value`
2. Un `EventTarget` via `polyfill.ts`
3. Une fonction `notify()` qui : vérifie batch, émet `stator:change`, appelle `onchange`
4. Un Proxy via `proxy.ts` avec `notify` injecté
5. Retourne `AugmentedState<T>` avec toutes les méthodes publiques

---

## Nouvelles APIs

### `subscribe(listener)`

```
state.subscribe((newValue, oldValue) => { ... })
→ returns () => void   (unsubscribe)
```

Implémentation : wrapper autour de `addEventListener` / `removeEventListener`.
Aucune nouvelle infrastructure — juste sucre syntaxique sur l'existant.

### `batch(fn)`

```
state.batch(() => {
  state.value.x = 1
  state.value.y = 2
})
// → un seul événement stator:change émis
```

Délègue à `batch.ts`. Disponible aussi comme import standalone :
```typescript
import { batch } from '@medyll/idae-stator'
```

---

## Packaging

### Corrections `package.json`

```json
// AVANT
"dependencies": {
  "command": "^1.1.1",
  "commander": "^14.0.3"
}

// APRÈS
"dependencies": {}            ← aucune dep runtime
"devDependencies": {
  "command": "...",
  "commander": "..."
}
"peerDependencies": {
  "svelte": "^5.0.0-next"    ← optionnel, documenté comme tel
}
"peerDependenciesMeta": {
  "svelte": { "optional": true }
}
```

### Exports

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  }
}
```

Inchangé — un seul point d'entrée suffit.

---

## CI/CD

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  ci:
    steps:
      - lint (eslint + prettier)
      - typecheck (svelte-check)
      - test + coverage (vitest --coverage, seuil 90%)
      - build (vite build)

# .github/workflows/release.yml
on: push to main
jobs:
  release:
    steps:
      - ci (réutilisé)
      - semantic-release → bump version + publish npm + GitHub release
```

---

## Décisions clés

| Décision | Choix | Raison |
|----------|-------|--------|
| Split fichiers | 5 fichiers | Séparation des responsabilités sans sur-ingénierie |
| `batch()` global vs par-instance | Global (module-level) | Suffisant pour usage sync, plus simple |
| `subscribe()` | Wrapper addEventListener | Zéro nouvelle infrastructure |
| Aucune nouvelle dep runtime | Oui | C'est une lib minimaliste, doit rester à 0 dep |
| Export `batch` standalone | Oui | Permet batching multi-instances |

---

## Tradeoffs

- **batch global** : ne gère pas les cas async (setTimeout, Promise). Acceptable pour v1.0, documenté.
- **Pas de `computed()`** : hors scope PRD — la complexité n'est pas justifiée maintenant.
- **Pas de breaking change API** : priorité absolue pour ne pas casser les consommateurs existants.
