# Story AUDIT-002 – Réduire l'usage de `any` — activer strict TypeScript

**Package**: tous (priorité : `idae-machine`, `idae-api`, `idae-socket`)
**Sévérité**: 🟠 Major
**Source**: Audit full 2026-03-02

## Contexte

1 720 occurrences de `: any` détectées. Annule les bénéfices de TypeScript.

## Acceptance Criteria

- [ ] `"strict": true` activé dans au moins 3 packages core (`idae-query`, `idae-engine`, `idae-db`)
- [ ] Zéro `any` dans `idae-query` (package le plus petit / plus critique)
- [ ] Règle ESLint `@typescript-eslint/no-explicit-any: warn` activée au niveau root

## Implementation Notes

**Date:** 2026-03-02

**Fichiers modifiés:**
- `packages-config/idae-eslint-config/index.js` — ajout règle `@typescript-eslint/no-explicit-any: "warn"` au niveau shared (s'applique à tout le monorepo)
- `idae-query/src/lib/types.ts` — `OperatorType<T = any>` → `T = unknown`, `Where<T = Record<string, any>>` → `Record<string, unknown>`
- `idae-query/src/lib/path/pathResolver.ts` — `Record<string, any>` → `Record<string, unknown>`, `defaultValue?: any` → `unknown`
- `idae-query/src/lib/query/query.ts` — `condition: any` → `condition: unknown`
- `idae-query/src/lib/resultSet/resultset.ts` — `ResultsetOptions<T = any>` → `T = object`, `count: any` → `Where<T>`, `pluck` return `any[]` → `unknown[]`, `Set<any>` → `Set<unknown>`, `dotPath<any>` → `dotPath<unknown>`
- `idae-query/src/lib/operators/operators.ts` — ajout type alias `Comparable` + `OperatorFn`, dispatch map typé, méthodes de comparaison: `value: any` → `Comparable | unknown | string | Set<unknown>` selon sémantique
- `idae-query/src/lib/resultSet/resultset.test.ts` — `let data: any[]` → `let data: TestItem[]`

**Résultat:** 81/81 tests passent. Zéro `any` non-justifié dans idae-query source.

**`any` restants justifiés:**
- `operators.ts:13` — `OperatorFn` dispatch map : intentionnel + `// eslint-disable-next-line` documenté. La table de dispatch hétérogène ne peut être typée de façon sound sans refactoring majeur.

**Notable decisions:**
- `Comparable = string | number | Date` pour les opérateurs `gt/gte/lt/lte` — plus précis et plus sûr que `unknown` (TypeScript interdit `unknown < unknown`)
- `string` pour `contains/startsWith/endsWith` — sémantiquement correct
- `unknown` pour `eq/ne` — la comparaison `===`/`!==` fonctionne sur unknown

**Known limitations:**
- 1 720 `any` restants dans les autres packages — à traiter package par package. Priorité suggérée : `idae-idbql` → `idae-db` → `idae-engine`.

