# Idae Database Library - AI Coding Instructions

## Project Overview

**@medyll/idae-db** is a TypeScript library providing a flexible database abstraction layer for MongoDB, MySQL, and ChromaDB with event-driven CRUD operations, auto-increment support, and connection pooling via singleton pattern.

### Architecture

The library uses a **Strategy pattern** with adapters:
- **IdaeDb** (singleton): Entry point, manages instances per URI+DbType combo, handles initialization
- **IdaeDbConnection**: Per-database connection instance, creates collections/tables via adapters
- **IdaeDbAdapter**: Generic adapter facade with pre/post hooks via decorators
- **Database-specific adapters**: MongoDBAdapter, MySQLAdapter, ChromaDBAdapter (implement IdaeDbAdapterInterface)
- **IdaeDBModel**: Per-collection model for MongoDB, handles auto-increment tracking

Key flow: `IdaeDb.init()` → `db(dbName)` → `collection<T>(name)` → operations with events

## Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Build and package (runs vite build + svelte-package + publint)
npm run test         # Run Vitest tests (src/**/*.{test,spec}.{js,ts})
npm run lint         # Check Prettier + ESLint
npm run format       # Auto-fix formatting
npm run check        # Svelte type checking
 # idae-cadenzia — AI Coding Instructions

This file guides AI coding agents working on the `@medyll/idae-cadenzia` Svelte component package.

**Quick commands**

```bash
npm run dev        # start local dev server (vite)
npm run build      # build library (vite)
npm run preview    # preview production build
npm run check      # svelte type checking (svelte-check)
npm run format     # prettier --write
npm run lint       # prettier check + eslint
npm run test       # run unit tests (vitest)
npm run prepackage # run scripts/package-pre.js before publishing
```

**Big-picture architecture**
- This package is a Svelte component library and demo using Svelte v5 + TypeScript. Main UI pieces live under `src/lib/components/` (e.g. `App.svelte`, `CadencePanel.svelte`, `ChordTable.svelte`, `ChordVisualization.svelte`).
- Exports for consumers are assembled in `src/lib/index.ts` — add new public components there.
- `src/lib/functions/` contains non-UI logic: `functions.svelte.ts` (component helpers) and `rules.ts` (domain rule engine). Keep pure logic in these files to ease unit testing.
- Types are centralized under `src/lib/types/types.ts` and constants under `src/lib/constants/constants.ts`.
- A small demo route is available at `src/routes/+page.svelte` used by the dev server and demos.

**Project-specific conventions**
- Svelte components use strict TypeScript; keep types in `src/lib/types/types.ts` and reference them across components.
- Prefer splitting logic into `functions/*.svelte.ts` or `rules.ts` rather than large script blocks inside `.svelte` files.
- Expose only public API from `src/lib/index.ts` so consumers import from the package root.
- Example: to add `MyWidget.svelte`, place it in `src/lib/components/`, then export from `src/lib/index.ts`.

**Testing & demo guidance**
- Unit tests use `vitest`. Example test file: `src/demo.spec.ts` — follow the same pattern (`describe`, `it`, `expect`).
- Keep UI logic small and testable by moving computation out of `.svelte` into `functions.svelte.ts`.

**Linting / formatting**
- Formatting: `prettier` + `prettier-plugin-svelte` (run `npm run format`).
- Lint: `eslint` with project presets (`npm run lint`).

**Build / Publish notes**
- `npm run prepackage` runs `scripts/package-pre.js` — update that script when changing package outputs or entry points.
- The package uses ESM (`type: module`) and Svelte v5. Keep exports compatible with Svelte packaging expectations.

**Files to reference when coding or reviewing**
- `src/lib/components/` — main components
- `src/lib/index.ts` — public exports
- `src/lib/functions/functions.svelte.ts` — component helpers
- `src/lib/functions/rules.ts` — rule engine/logic
- `src/lib/types/types.ts` — shared types
- `src/routes/+page.svelte` — demo page
- `src/demo.spec.ts` — example test

If anything in this file seems unclear or you'd like more detail (examples of adding a component, test templates, or the `prepackage` workflow), tell me which area and I'll expand the instructions.
```
