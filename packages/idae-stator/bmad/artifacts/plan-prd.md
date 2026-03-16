# PRD — idae-stator v1.0 Stabilization & Professionalization
_Generated: 2026-03-16_

## Problem Statement

idae-stator est une librairie de gestion d'état réactive fonctionnelle mais qui souffre de dette technique, d'une API incohérente et d'un packaging imparfait. Elle ne projette pas encore la maturité attendue d'une librairie open-source publiée sur npm. L'objectif de cette version est de stabiliser l'API publique, corriger les problèmes de packaging, améliorer la DX (developer experience) et poser les bases d'une maintenance durable.

## Target Users

- **Développeurs JS/TS** utilisant idae-stator dans des projets vanilla, Node.js ou Svelte
- **Consommateurs npm** qui évaluent la lib sur sa qualité perçue (README, types, bundle size, docs)
- **Contributeurs potentiels** qui lisent le code source

---

## Features

### F1 — Nettoyage du packaging
**"As a consumer, I want to install idae-stator without pulling in CLI dependencies, so that my bundle stays lean."**

Acceptance criteria:
- `commander` et `command` retirés de `dependencies`, déplacés dans `devDependencies` ou dans un sous-package CLI séparé
- Le bundle distribué (`dist/`) ne contient aucune dépendance CLI
- `peerDependencies` Svelte documentée comme optionnelle ou retirée si non couplée

---

### F2 — Refactoring du core en modules distincts
**"As a contributor, I want the source to be split into focused files, so that I can understand and modify one concern at a time."**

Acceptance criteria:
- `Stator.ts` découpé en minimum 3 fichiers : types, polyfill EventTarget, logique core
- Chaque fichier a une responsabilité unique et clairement nommée
- L'API publique exportée reste identique (pas de breaking change)

---

### F3 — API `subscribe()` ergonomique
**"As a developer, I want a subscribe() function that returns an unsubscribe callback, so that I don't have to manage listener references manually."**

Acceptance criteria:
- `subscribe(listener)` disponible sur `AugmentedState<T>` retourne une fonction `() => void`
- L'appel de la fonction retournée supprime le listener
- Compatible avec le pattern `$effect` de Svelte 5 et les `useEffect` React

---

### F4 — API `batch()` pour grouper les mutations
**"As a developer, I want to batch multiple state mutations into a single change notification, so that I avoid unnecessary re-renders."**

Acceptance criteria:
- `batch(fn: () => void)` disponible, exécute `fn` et n'émet qu'un seul événement `stator:change` à la fin
- Si `fn` ne produit aucun changement réel, aucun événement n'est émis
- Compatible avec les mutations imbriquées

---

### F5 — Documentation publique complète
**"As a new user, I want a clear README with installation, API reference, and examples, so that I can start using the lib in under 5 minutes."**

Acceptance criteria:
- README couvre : installation, API complète, exemples vanilla JS, exemple Svelte, exemple Node.js
- Chaque méthode publique documentée avec signature TypeScript et exemple
- CHANGELOG maintenu à jour (semantic-release ou manuel)
- Badge npm version, license, et taille du bundle présents

---

### F6 — Couverture de tests à 90%+
**"As a maintainer, I want high test coverage, so that refactors don't introduce regressions silently."**

Acceptance criteria:
- Couverture de lignes ≥ 90% (Vitest coverage)
- Tests pour `subscribe()` et `batch()` (nouvelles APIs F3, F4)
- Tests cross-environnement : Browser (jsdom), Node.js
- CI vérifie la couverture à chaque PR

---

### F7 — CI/CD robuste
**"As a maintainer, I want automated checks on every push, so that the main branch is always releasable."**

Acceptance criteria:
- GitHub Actions : lint + typecheck + tests + coverage sur chaque PR
- Publication npm automatisée sur tag semver (semantic-release)
- Build vérifié (pas de dist cassé publié)

---

## Out of Scope (v1.0)

- **Computed/derived state** — utile mais non bloquant pour la stabilisation
- **DevTools / time-travel debugging** — complexité trop importante pour cette version
- **Intégration framework spécifique** (React hook, Vue plugin) — hors périmètre core
- **Persistence (localStorage/IndexedDB)** — déjà traité dans d'autres packages idae
- **Support IE11 / vieux navigateurs** — proxy non polyfillable, non supporté

---

## Risks & Dependencies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Refactoring F2 introduit une régression | Haut | Garder les tests verts tout au long du découpage |
| `batch()` complexifie la logique Proxy | Moyen | Implémenter avec un flag de contexte simple |
| Breaking change API accidentel | Haut | Snapshot de l'API publique avant refactoring, tests de non-régression |
| semantic-release mal configuré publie une mauvaise version | Moyen | Tester en dry-run sur une branche dédiée avant activation |

---

## Success Criteria

- `npm install @medyll/idae-stator` tire 0 dépendances runtime inattendues
- Couverture tests ≥ 90%
- CI verte sur chaque commit main
- README noté "complet" par un développeur externe (revue pair)
- Version 1.0.0 publiée sur npm
