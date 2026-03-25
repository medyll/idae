# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

`@medyll/idae-machine` is a schema-driven SvelteKit library that bridges data modeling (`@medyll/idae-idbql` IndexedDB engine) and UI components (`@medyll/idae-slotui-svelte`). It provides CRUD components, field-level validation, and reactive state management for Svelte 5 apps.

## Commands

```bash
pnpm run dev              # Start dev server
pnpm run build            # Build library (vite build + svelte-package + publint)
pnpm run check            # Svelte type checking (svelte-kit sync + svelte-check)
pnpm run lint             # Prettier check
pnpm run format           # Auto-format
pnpm run test             # Run all unit tests once (vitest --run)
pnpm run test:unit        # Run unit tests in watch mode
pnpm vitest run src/lib/main/__tests__/machineParserForge.test.ts  # Single test file
pnpm run test:e2e         # Playwright e2e tests
```

**Use `pnpm`, not `npm`.**

## Architecture

```
UI Components (Svelte 5)  →  src/lib/data/, src/lib/field/, src/lib/fragments/
        ↓
Form & Validation Logic   →  src/lib/main/machine/MachineSchemeValidate.ts
        ↓
Schema DSL & Parsing      →  src/lib/main/machineParserForge.ts
        ↓
Machine Core              →  src/lib/main/machine.ts, machineDb.ts
        ↓
IndexedDB                 →  @medyll/idae-idbql (workspace dependency)
```

### Machine singleton

`machine.ts` exports a singleton with static `instanceRegistry`. Key accessors: `idbql` (queries), `idbqlState` (Svelte 5 reactive state), `machineDb` (schema logic). Initialize with `machine.init({ dbName, version, model })` then `machine.start()`.

### Schema DSL

Fields use a string DSL parsed by `MachineParserForge.parse()` (must stay pure/no side effects):

- `'text (required)'`, `'id (readonly)'`, `'fk-category.id (required)'`, `'array-of-number'`
- Modifiers: `required`, `readonly`, `private`

### MachineDb caching

`MachineDb#idbCollectionsList` caches `MachineScheme` per collection. Invalidate if changing schema parsing logic.

## Svelte 5 Rules (Strict)

- Use `$state`, `$derived`, `$effect` — never `onMount`/`onDestroy`
- Never use `$:` reactive declarations (Svelte 4 syntax)
- Always key `{#each}` blocks: `{#each items as item (item.id)}`
- Internal imports use `$lib` alias

## Code Conventions

- All classes/methods documented with jsDoc (`@role`, `@param`, `@return`) in English
- Errors: `MachineErrorValidation` for validation, `MachineError` for collection logic — never suppress silently
- New public APIs must be exported from `src/lib/index.ts`
- `src/_old/` is migration reference only — do not modify
- Tests use realistic schemas from `src/lib/demo/testScheme.ts`
- Test framework: Vitest + @testing-library/svelte + @testing-library/jest-dom
- Component tests colocated: `Component.svelte.spec.ts`
- Core logic tests in `src/lib/main/__tests__/`

## Pre-commit Checklist

- `pnpm run check` passes
- `pnpm run lint` passes
- `pnpm run test` passes
- Svelte 5 runes only (no Svelte 4 patterns)
