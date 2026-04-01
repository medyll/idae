# GitHub Copilot Instructions for Idae Monorepo

High-performance monorepo for full-stack development: data management, storage, and UI with advanced reactivity. Supports PostgreSQL, MySQL, SQLite, MongoDB, and PouchDB.

## Build, Test, Lint

**Package manager: pnpm** (not npm/yarn). Node >= 22 (see `.nvmrc`).

```bash
# Root commands
pnpm install
pnpm run package          # Build and package all workspaces
pnpm run lint             # ESLint across monorepo
pnpm run format           # Prettier across monorepo

# Per-package (use --filter to scope)
pnpm --filter <pkg> run build
pnpm --filter <pkg> run test
pnpm --filter <pkg> run check       # svelte-check — run before committing Svelte packages

# Single test (Vitest)
pnpm --filter <pkg> run test -- -t "test name pattern"
# Single test file
pnpm --filter <pkg> run test -- src/path/to/file.test.ts

# Integration tests (Playwright, where available)
pnpm --filter <pkg> run test:integration
```

Package build pipeline: `vite build` → `svelte-kit sync && svelte-package && publint`.

## Architecture

```
Frontend (Svelte 5)  ↔  Database Layer (idae-db / idae-idbql)  ↔  Backend (NestJS / MongoDB)
                           ↕ real-time sync via idae-socket (Socket.io)
```

**Package categories:**
- **UI**: `idae-slotui` — Svelte 5 component library (Tailwind v4)
- **Data**: `idae-db` (multi-DB server abstraction), `idae-idbql` (IndexedDB with MongoDB-like queries), `idae-query` (in-memory chainable query engine used by idbql), `idae-sync` (outbox/sync scaffolding)
- **DOM**: `idae-be` (callback-based DOM manipulation, always returns root for chaining), `idae-dom-events` (mutation/CSS observers), `idae-html` / `idae-htmlu` (HTML generation, Vite preprocessor)
- **Engine/Infra**: `idae-engine` (dataOp fluent API for arrays), `idae-api` (HTTP API framework), `idae-socket` (WebSocket sync), `idae-stator` (reactive state proxy for non-Svelte contexts)
- **Other**: `idae-machine` (AI-powered SvelteKit framework), `idae-router` (client-side SPA router), `idae-csss` (CSS utilities), `qoolie` (simplified IndexedDB + server sync), `skiller` (AI skill installer/evaluator)
- **Config**: `packages-config/` — shared ESLint (`idae-eslint-config`) and Prettier (`idae-config-prettier`) configs

**Data sync flow:**
Backend REST API → `idae-idbql` stores locally in IndexedDB → `idae-socket` relays change events via Socket.io → `idbqlEvent` fires ($state) → Svelte 5 reactivity re-renders UI.

**idae-query vs idae-idbql**: `idae-query` operates on in-memory arrays (stateless); `idae-idbql` wraps IndexedDB with transactions (stateful). Use query for pre-fetched data, idbql for browser persistence.

## Key Conventions

### Svelte 5 Runes — Mandatory (NOT Svelte 4)

Always use runes. Never use `export let`, `$:`, `createEventDispatcher`, or `writable`/`readable` stores.

```svelte
<!-- Props -->
let { propName = 'default' } = $props();

<!-- State -->
let count = $state(0);
let double = $derived(count * 2);

<!-- Effects -->
$effect(() => { /* reactive side effect */ });
```

- `.svelte.ts` files contain rune-based logic (e.g., `collection.svelte.ts`, `idbqlEvent.svelte.ts`)
- State in classes: `class Store { count = $state(0); double = $derived(this.count * 2); }`

### Code Style

Enforced by shared Prettier config:
- **Tabs** for indentation
- **Single quotes**
- **No trailing commas**
- **100-char line width**
- Svelte and Tailwind Prettier plugins active

ESLint: `@typescript-eslint/no-explicit-any` is warn (not error). `@ts-ignore`/`@ts-expect-error` require a description (5+ chars).

Commits follow **conventional commits** (commitizen + commitlint).

### Imports and Dependencies

- Import between packages via `@medyll/<package-name>` (workspace protocol `workspace:*`)
- Never import from `dist/` — use package source exports
- Use `$lib` path alias within SvelteKit packages
- Use `import type { X }` for type-only imports
- Barrel exports in `src/lib/index.ts` per package

### Package Structure

Every library package follows the SvelteKit packaging model:
```
packages/<name>/
├── src/lib/           # Library source (exported via svelte-package)
│   ├── index.ts       # Barrel exports
│   └── ...
├── src/routes/        # Demo/docs routes (not published)
├── vite.config.ts     # Vite + SvelteKit + Vitest
├── svelte.config.js
├── tsconfig.json
└── package.json
```

### idae-slotui Components

1. Atoms in `src/lib/base/`, interactive controls in `src/lib/controls/`
2. `ComponentName.svelte` with Svelte 5 runes; complex types in `types.ts`
3. Uses Tailwind CSS v4 + shadcn-svelte patterns
4. Export in `src/lib/index.ts`

### idae-be Chaining

All `idae-be` DOM methods must return the root object to preserve chaining:
```typescript
be('#el').append(toBe('<div>'), ({ be }) => be.addClass('x').on('click', handler))
```

## Pre-Commit Checklist

```bash
pnpm --filter <pkg> run check    # Type checking (svelte-check)
pnpm --filter <pkg> run test     # Unit tests (Vitest)
pnpm run lint && pnpm run format # Lint + format
```
