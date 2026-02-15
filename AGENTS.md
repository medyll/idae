# GitHub Copilot Instructions for Idae Monorepo

**Package Manager**: Ce monorepo utilise **pnpm** pour la gestion des dépendances et des scripts. Il est recommandé d'utiliser `pnpm install`, `pnpm run`, etc. Les fichiers `pnpm-workspace.yaml` et `pnpm-lock.yaml` assurent la cohérence des dépendances entre les packages.

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
- **Hybrid Gateway**: Accepts HTTP POST requests from Backend; Broadcasts them as Socket.IO events to Frontend.
- Bi-directional real-time sync using Socket.io.
- Listens for backend data changes and updates local state.
- Works alongside `idae-idbql` to push updates to IndexedDB when backend changes.
- Pattern: Backend publishes change events via HTTP POST → `idae-socket` relays → triggers `idbqlEvent` → UI updates via Svelte reactivity.

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

---

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>canvas-design</name>
<description>Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists' work to avoid copyright violations.</description>
<location>project</location>
</skill>

<skill>
<name>doc-coauthoring</name>
<description>Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer context, refine content through iteration, and verify the doc works for readers. Trigger when user mentions writing docs, creating proposals, drafting specs, or similar documentation tasks.</description>
<location>project</location>
</skill>

<skill>
<name>frontend-design</name>
<description>Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.</description>
<location>project</location>
</skill>

<skill>
<name>mcp-builder</name>
<description>Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).</description>
<location>project</location>
</skill>

<skill>
<name>skill-creator</name>
<description>Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.</description>
<location>project</location>
</skill>

<skill>
<name>template</name>
<description>Replace with description of the skill and when Claude should use it.</description>
<location>project</location>
</skill>

<skill>
<name>theme-factory</name>
<description>Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.</description>
<location>project</location>
</skill>

<skill>
<name>webapp-testing</name>
<description>Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
