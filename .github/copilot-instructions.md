# GitHub Copilot Instructions for Idae Monorepo

This monorepo contains core components for Idae applications (Web, Mobile, Desktop). It uses NPM Workspaces, Lerna, and Nx for orchestration.

## 🏗️ Architecture Overview

**Core Data Flow**: Frontend (Svelte 5) ↔ Database Layer (idae-db/idbql) ↔ Backend (NestJS/MongoDB)

**Package Categories**:
- **UI Layer** (`idae-slotui-svelte`): Svelte 5 component library with SCSS + UnoCSS
- **Data Layer** (`idae-db`, `idae-idbql`, `idae-query`, `idae-mongo`): Multi-DB abstraction, IndexedDB queries, query parsing
- **DOM/Event Layer** (`idae-be`, `idae-dom-events`): Callback-based DOM manipulation and event observation
- **Engine/Utils** (`idae-engine`, `idae-api`, `idae-socket`, `idae-stator`): Data operations, HTTP API, WebSocket, state management
- **Backend** (`idae-api-nest`): NestJS REST API with Mongoose/MongoDB
- **Shared** (`packages-config/`, `shared/`): ESLint, Prettier configs; shared types/utilities

## 🔑 Critical Patterns & Workflows

### Svelte 5 Runes (NOT Svelte 4)
- **Mandatory**: Use `$props()`, `$state()`, `$derived()`, `$effect()`, `$bindable()` — NEVER use `export let`, `$:`, `createEventDispatcher`, or writable stores
- **File Structure**: `.svelte.ts` files contain runes (e.g., `collection.svelte.ts`, `store.svelte.ts`)
- **Props**: `let { propName = 'default' } = $props()` (destructured binding)
- **State in Classes**: `class Store { count = $state(0); double = $derived(this.count * 2); }`

### Data Flow Patterns
- **idae-idbql**: IndexedDB queries use `@medyll/idae-query` for chainable filters, sorting, pagination
- **idae-db**: Server-side DB abstraction supporting MongoDB, MySQL; auto-increment via `autoIncrementFormat`
- **idae-be**: Callback-based DOM manipulation always returns root object for chaining:
  ```typescript
  be('#container').append(toBe('<div>'), ({ be }) => be.addClass('highlight').on('click', handler))
  ```
- **idae-engine**: `dataOp` utility for sorting, finding, grouping arrays with fluent API

### Build Commands
- **Root**: `npm run package` → builds and packages all workspaces
- **Single Package**: `npm run build` (Vite + svelte-package for libraries; nest build for backend)
- **Publish Prep**: `npm run prepackage` (pre-publish script) runs before packaging
- **Nx Tasks**: Prefer `nx run` over direct commands: `nx run idae-slotui:build`, `nx affected --target=test`

### Testing
- **Svelte/Frontend**: `npm run test:unit` (Vitest) + `npm run test:integration` (Playwright)
- **NestJS**: `npm run test` (Jest) + `npm run test:e2e` (end-to-end)
- **Type Check**: `npm run check` (svelte-check) — run before committing Svelte packages

### idae-slotui Component Authoring
1. Create folder in `src/lib/base/` (atoms like Badge, Icon) or `src/lib/controls/` (interactive like Button, TextField)
2. Create `ComponentName.svelte` with Svelte 5 runes; export type in `types.ts` if complex
3. Create `component-name.scss` and import via `<style global lang="scss"> @use './component-name.scss'; </style>`
4. Use `Slotted` component (`$lib/utils/slotted/Slotted.svelte`) for conditional slot fallbacks
5. Export in `src/lib/index.ts` or rely on build script discovery
6. Generate CSS exports: `npm run release-css` (outputs to `src/lib/slotui-css/`)

### idae-idbql Reactivity Pattern
- Use `createIdbqlState()` to wrap reactive proxy around database
- Listen to `idbqlEvent` (global event bus using `$state`) for DB change subscriptions
- Collections are accessed via `idbql.collectionName`; use `.where()` for queries (MongoDB-like)
- Do NOT access `IDBObjectStore` directly; use `CollectionCore` methods which handle transactions

### NestJS Architecture (idae-api-nest)
- **Modules**: Nest patterns (DI containers via @nestjs/core)
- **Database**: Mongoose via @nestjs/mongoose; auto-increment via mongoose-sequence
- **Config**: Environment variables via @nestjs/config; load from `.env` or process.env

### idae-query vs idae-idbql Separation
**idae-query** (generic query engine):
- Operates on **in-memory arrays** of objects
- Provides chainable `ResultSet` API: `.sortBy()`, `.groupBy()`, `.getPage()`
- Supports dot-path resolution for nested properties
- Used by idae-idbql internally for result processing
- Example: `getResultset(data).sortBy({ age: 'asc' }).getPage(1, 10)`

**idae-idbql** (IndexedDB-specific wrapper):
- Wraps IndexedDB with **MongoDB-like query interface**
- Uses `idae-query` as a dependency for result set operations
- Provides `CollectionCore` for transactional CRUD operations
- Returns queries that execute against IndexedDB stores
- Example: `await idbql.users.where({ age: { $gt: 18 } }).toArray()`
- **Key difference**: idae-query is stateless; idae-idbql is stateful with transactions

**When to use which**:
- Use `idae-query` when working with pre-fetched data (API responses, local arrays)
- Use `idae-idbql` for browser-side persistence with reactive updates

### idae-mongo & Server-Side Patterns
**idae-mongo** (MongoDB adapter):
- Complements `idae-db` (multi-DB abstraction layer)
- Backend integrates MongoDB via `@nestjs/mongoose` in `idae-api-nest`
- Use `idae-db` connection factory with `DbType.MONGODB` to auto-increment via `autoIncrementFormat`
- Example: `IdaeDb.init(mongoUri, { dbType: DbType.MONGODB, autoIncrementFormat: (col) => \`id${col}\` })`
- Collections accessed as standard Mongoose models; queries return arrays (not reactive)

**Data sync pattern**:
1. **Backend**: `idae-api-nest` exposes REST endpoints with `idae-mongo` collections
2. **Frontend**: `idae-idbql` stores fetched data locally
3. **Sync**: `idae-socket` (real-time sync) pushes updates to keep IndexedDB in sync with backend

### idae-socket & idae-stator in Data Flow
**idae-socket** (WebSocket synchronization):
- Purpose: "Keep your app in sync with your backend"
- Bi-directional real-time sync using Socket.io
- Listens for backend data changes and updates local state
- Works alongside `idae-idbql` to push updates to IndexedDB when backend changes
- Pattern: Backend publishes change events → `idae-socket` receives → triggers `idbqlEvent` → UI updates via Svelte reactivity

**idae-stator** (Lightweight state management):
- Purpose: Reactive state proxy for non-Svelte contexts
- Creates observable state: `stator(0)` or `stator({ count: 0 })`
- Fires `onchange` callbacks when state mutates
- Alternative to Svelte 5 runes for vanilla JavaScript
- Less commonly used in Svelte 5 codebase (Svelte runes preferred)

**Integration flow**:
```
Backend (NestJS + MongoDB) 
  ↓ (REST API + Schema)
Frontend (idbql receives data)
  ↓ (Stores in IndexedDB via CollectionCore)
Local State (createIdbqlState reactive proxy)
  ↓ (Socket.io listens for changes)
Socket emits DB change event
  ↓ (idbqlEvent fires via $state)
UI re-renders (Svelte 5 reactivity kicks in)
```

## 📋 Monorepo-Specific Rules

1. **Imports Between Packages**: Check `package.json` `dependencies` field; use workspace links `@medyll/package-name`
2. **Nx Configuration**: Use Nx MCP tools (`nx_workspace`, `nx_project_details`, `nx_docs`) for task orchestration
3. **Path Aliases**: 
   - Svelte projects: `$lib`, `$components`, `$utils`, `$styles`
   - Check `tsconfig.json` `compilerOptions.paths` for each package
4. **ESLint/Prettier**: Shared configs in `packages-config/`; respect per-package overrides in `eslint.config.*` and `prettier.config.*`
5. **CSS Build**: SCSS compiles co-located with components; UnoCSS handles utilities; CSFabric provides framework vars/mixins

## ⚠️ Dos & Don'ts for AI Agents

✅ DO:
- Use Svelte 5 Runes syntax exclusively in `.svelte` files
- Preserve callback-based chaining in idae-be (always return root)
- Test new features with `npm run test:unit` before commit
- Check types with `npm run check` for Svelte packages
- Run `npm run lint && npm run format` locally before pushing

❌ DON'T:
- Generate Svelte 4 code (no `export let`, `$:`, createEventDispatcher)
- Use writable/readable stores instead of `$state`/`$derived`
- Import from `dist/` folders; import from package source exports
- Assume Mongoose/MongoDB; some packages support MySQL via idae-db abstraction
- Skip type safety; strict TypeScript is enforced via tsconfig
