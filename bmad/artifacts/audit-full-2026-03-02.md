# Audit Report – full – 2026-03-02

## 🗺️ Project Map

- **Type**: Monorepo (pnpm workspaces)
- **Packages détectés**: 20 (dans `packages/`)
- **Stacks**: Svelte 5 (runes), TypeScript, NestJS, MongoDB/MySQL/PostgreSQL/PouchDB/SQLite, Tailwind CSS v4, shadcn-svelte, Vite, tshy
- **CI/CD**: GitHub Actions ✅ (`release.yml`, `release-next.yml`)
- **Docker**: ❌ non détecté
- **Fichiers .env**: ✅ aucun exposé
- **bmad/ présent**: ✅ racine + `packages/idae-slotui`

---

## 📊 Health Score: **28 / 100**

| Sévérité | Count |
|---|:---:|
| 🔴 Critical | 1 |
| 🟠 Major | 5 |
| 🟡 Minor | 6 |
| 🔵 Info | 5 |

> `score = 100 - (1×20) - (5×8) - (6×2) = 28`

---

## 🔴 Critical Findings

#### [AUDIT-001] – Credentials hardcodés dans `AuthService.ts`
- **Module**: security
- **Package**: `idae-api`
- **File**: `src/lib/server/services/AuthService.ts` (ligne 44)
- **Issue**: `if (username === 'admin' && password === 'password')` — credentials en dur dans la logique d'authentification.
- **Impact**: Toute build publiée expose un accès admin trivial. Risque de compromission immédiate de toute instance déployée.
- **Fix**: Remplacer par un appel à un store d'utilisateurs réel (hash bcrypt, base de données). Supprimer les credentials en dur.
- **BMAD Action**: `/dev-story AUDIT-001`

---

## 🟠 Major Findings

#### [AUDIT-002] – Typage `any` omniprésent (1 720 occurrences)
- **Module**: code
- **Package**: tous (`idae-api`, `idae-machine`, `idae-idbql`, `idae-db`, `idae-socket`…)
- **Issue**: 1 720 usages de `: any` dans les fichiers `.ts`. Certains packages critiques (ex: `idae-machine/MachineFieldType.ts` × 30) en sont particulièrement affectés.
- **Impact**: Annule les garanties TypeScript, cache des régressions, rend le refactoring dangereux.
- **Fix**: Activer `"strict": true` dans les `tsconfig.json` par package. Remplacer les `any` par des types/génériques appropriés progressivement.
- **BMAD Action**: `/dev-story AUDIT-002`

#### [AUDIT-003] – 111 suppressions `@ts-ignore` / `@ts-nocheck`
- **Module**: code
- **Package**: tous
- **Issue**: 111 occurrences de directives qui désactivent silencieusement la vérification de types.
- **Impact**: Masque des bugs à la compilation, crée une dette technique silencieuse.
- **Fix**: Traiter chaque occurrence : corriger le type réel ou utiliser un cast explicite documenté. Mettre en place une règle ESLint `@typescript-eslint/ban-ts-comment`.
- **BMAD Action**: `/dev-story AUDIT-003`

#### [AUDIT-004] – Syntaxe Svelte 4 non migrée (74 violations dans 22 fichiers)
- **Module**: code
- **Packages**: `idae-slotui` (52), `idae-machine` (21), `idae-dom-events` (1)
- **Issue**: Utilisation de `export let`, `$:` (reactive statements), `createEventDispatcher` dans des composants `.svelte`. Le projet cible Svelte 5 runes.
- **Impact**: Incompatibilité future avec Svelte 5 strict. Mauvaise ergonomie. Bloque les optimisations du compilateur Svelte 5.
- **Fix**: Migrer vers `$props()`, `$state()`, `$derived()`, `$effect()`. La migration `idae-slotui` est déjà en cours (Sprint 01).
- **BMAD Action**: Sprint 01 actif pour `idae-slotui` — créer une story pour `idae-machine` et `idae-dom-events`.

#### [AUDIT-005] – Absence de configuration de test dans 18/20 packages
- **Module**: code / doc
- **Packages**: tous sauf `idae-socket` (vitest) et `idae-stator` (jest)
- **Issue**: Aucun `vitest.config.ts` ni `jest.config.ts` dans 18 packages. Pourtant des fichiers `.test.ts` existent (ex: `idae-idbql` : 61 fichiers de test, `idae-api` : 47, `idae-be` : 57).
- **Impact**: Les tests ne peuvent pas être lancés de manière cohérente et automatisée via CI. Couverture inconnue.
- **Fix**: Ajouter un `vitest.config.ts` minimal par package (ou un config partagé root-level). Standardiser sur **vitest** (déjà dans les peerDeps root).
- **BMAD Action**: `/dev-story AUDIT-005`

#### [AUDIT-006] – Code mort : `idae-machine/src/_old/` (9 fichiers)
- **Module**: code / arch
- **Package**: `idae-machine`
- **Files**: `_old/CollectionFieldGuess.svelte`, `CrudZone.svelte`, `Entity.ts`, `SchemeFieldClass.ts`, `SchemeModel.ts`, `schemeModelClass.ts`, `types.ts` + `.d.ts`
- **Issue**: Dossier `_old/` committé contenant des fichiers obsolètes (Svelte 4, anciennes classes de schéma). Les mêmes classes existent en double dans `idae-mongo/` et `idae-slotui/_data/`.
- **Impact**: Confusion sur quel code est canonical. Risque d'imports accidentels du mauvais module.
- **Fix**: Supprimer `src/_old/` et son dossier `coverage/idae-machine/src/_old`. Identifier le canonical et supprimer les doublons dans `idae-mongo` et `idae-slotui/_data/`.
- **BMAD Action**: `/dev-story AUDIT-006`

---

## 🟡 Minor Findings

#### [AUDIT-007] – Fichiers `example*.ts` exposés à la racine des packages
- **Module**: code
- **Packages**: `idae-api` (`example.ts`, `example-client.ts`, `example-server.ts`), `idae-db` (`example.ts`)
- **Issue**: 4 fichiers d'exemple au niveau `src/` sont potentiellement inclus dans le build / exports.
- **Fix**: Déplacer dans un dossier `examples/` exclu du build, ou supprimer.

#### [AUDIT-008] – `idae-socket` : JWT secret et URL de vérification avec valeurs par défaut dangereuses
- **Module**: security
- **Package**: `idae-socket`
- **File**: `src/lib/server/_config/config.ts` (ligne 26, 33)
- **Issue**: `jwtSecret: process.env.IDAE_SOCKET_JWT_SECRET || 'change-me-in-production'` et `urlTokenVerify: "https://.../json_token.php"` (placeholder non fonctionnel).
- **Fix**: Supprimer le fallback `'change-me-in-production'` — lever une erreur si non défini en production. Remplacer l'URL placeholder ou documenter clairement.

#### [AUDIT-009] – `idae-csss` et `idae-router` à la version `0.0.1`
- **Module**: deps / doc
- **Packages**: `idae-csss`, `idae-router`
- **Issue**: Version `0.0.1` non synchronisée avec le reste du monorepo (versions `0.x.y`, `1.x.y`). Suggère ces packages n'ont jamais été publiés ou sont abandonnés.
- **Fix**: Publier ou marquer explicitement comme `private: true` si non destinés à la publication.

#### [AUDIT-010] – Package `shared` non configuré
- **Module**: arch / doc
- **Package**: `shared`
- **Issue**: Pas de `tsconfig.json`, pas d'`exports` dans `package.json`, pas de `README.md`. 0 fichiers source `.ts`/`.svelte`. Package vide ou non initialisé.
- **Fix**: Soit initialiser (tsconfig, exports, types partagés), soit supprimer du workspace.

#### [AUDIT-011] – Package `idae-mono-expand-vitrine` non configuré
- **Module**: arch
- **Package**: `idae-mono-expand-vitrine`
- **Issue**: Pas de `tsconfig.json`, pas d'`exports` dans `package.json`, 0 fichiers source. Probablement un outil CLI (`bin/cli.js`) sans structure formelle.
- **Fix**: Soit formaliser (tsconfig, exports), soit retirer du workspace pnpm.

#### [AUDIT-012] – 24 TODO/FIXME non résolus
- **Module**: code
- **Packages**: `idae-db`, `idae-mongo`, `idae-machine`, `idae-idbql`, `idae-stator`, `idae-csss`…
- **Issue**: 24 marqueurs `TODO`/`FIXME`/`HACK` en production code.
- **Fix**: Triager — transformer en issues GitHub ou stories BMAD pour les TODO critiques, supprimer les cosmétiques.

---

## 🔵 Info

- **[INFO-001]** GitHub Actions CI/CD présent ✅ — `release.yml` + `release-next.yml` couvrent `main` et `dev`.
- **[INFO-002]** Aucun fichier `.env` détecté dans le repo ✅ — pas d'exposition de secrets via git.
- **[INFO-003]** `pnpm-lock.yaml` présent ✅ — cohérence des dépendances garantie.
- **[INFO-004]** 17/20 packages ont `exports` et `types` définis dans `package.json` ✅.
- **[INFO-005]** BMAD actif sur `idae-slotui` — Sprint 01 en cours (Zero Violations CSS).

---

## 🏗️ Matrice par Package

| Package | Tests | Test Config | Svelte4 Violations | Dead Code | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| idae-api | 47 | ❌ | 0 | `example*.ts` x3 | ⚠️ |
| idae-be | 57 | ❌ | 0 | — | ⚠️ |
| idae-cadenzia | 5 | ❌ | 0 | — | 🟡 |
| idae-csss | 5 | ❌ | 0 | — | 🟡 v0.0.1 |
| idae-db | 12 | ❌ | 0 | `example.ts` | ⚠️ |
| idae-dom-events | 6 | ❌ | 1 | — | 🟡 |
| idae-engine | 6 | ❌ | 0 | — | 🟡 |
| idae-html | 3 | ❌ | 0 | — | 🟡 |
| idae-htmlu | 2 | ❌ | 0 | — | 🟡 |
| idae-idbql | 61 | ❌ | 0 | — | ⚠️ |
| idae-machine | 25 | ❌ | 21 | `_old/` x9 | 🔴 |
| idae-mongo | 1 | ❌ | 0 | — | 🟡 |
| idae-mono-expand-vitrine | 0 | ❌ | 0 | — | 🟡 non configuré |
| idae-query | 26 | ❌ | 0 | — | 🟢 |
| idae-router | 12 | ❌ | 0 | — | 🟡 v0.0.1 |
| idae-slotui | 2 | ❌ | 52 | — | 🔴 Sprint 01 actif |
| idae-socket | 3 | ✅ vitest | 0 | placeholder URL | ⚠️ |
| idae-stator | 5 | ✅ jest | 0 | — | 🟡 |
| pseudo-html-template | 0 | ❌ | 0 | — | 🟡 no tsconfig |
| shared | 0 | ❌ | 0 | — | 🔴 vide |

---

## ✅ Recommended Next Steps

1. **`/dev-story AUDIT-001`** – Supprimer les credentials hardcodés dans `AuthService.ts` *(critique, avant tout déploiement)*
2. **`/dev-story AUDIT-005`** – Standardiser vitest dans tous les packages *(débloque CI test coverage)*
3. **`/dev-story AUDIT-006`** – Supprimer `idae-machine/src/_old/` et nettoyer les doublons SchemeModel
4. **`/dev-story AUDIT-002`** – Plan de réduction du `any` — activer `strict` par package par vague
5. **`/sprint-planning idae-slotui`** – Intégrer AUDIT-004 (Svelte 4 migration idae-machine) dans prochain sprint
6. **`/dev-story AUDIT-008`** – Sécuriser `idae-socket` config (fallback JWT secret)
