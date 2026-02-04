# Copilot Instructions for idae-html

## Project Overview
- **idae-html** is a raw HTML utility library for dynamic web apps/sites, client and client-server, inspired by Svelte/React but without a builder.
- Focus: advanced HTML generation, parsing, and manipulation in JS/TS, usable in browser and Node.js.
- All code is raw HTML—no build step required for core usage.

## Architecture & Key Patterns

Main entry: `src/lib/` (see `index.ts`, `main.ts`).
Utilities: `html`, `escapeHtml`, `parseHtml` (see README usage example).
Dynamic content: use template literals and helpers for safe, composable markup.
No framework-specific abstractions; everything is plain JS/TS and HTML.
Integration: designed to work with other Idae packages for UI/data flow, but remains standalone.

### Monorepo Dependencies
- `@medyll/idae-dom-events`: DOM event helpers and advanced event-driven logic (see `main.ts`).
- `idae-idbql`: IndexedDB query layer for client-side persistence (used in advanced scenarios; check monorepo for details).
- `@medyll/idae-stator`: state management and reactivity utilities (used for advanced stateful UI/data flows; see monorepo for usage patterns).

## Developer Workflows
- **Install dependencies:** `pnpm install`
- **Build:** `pnpm run build` (if needed for packaging)
- **Test:** `pnpm run test`
- **Lint/Format:** `pnpm run lint && pnpm run format`
- No custom build tools—avoid assumptions about Webpack, Vite, etc. for this package.

## Conventions & Practices
- Follow monorepo code style and commit message conventions.
- Add tests for new features/bug fixes in `src/`.
- Use safe escaping (`escapeHtml`) for user input in templates.
- Prefer composable, functional helpers over class-based or OOP patterns.
- Reference the monorepo root README for broader conventions.

## Integration Points
- Works with other Idae packages (UI/data flow), but does not depend on external frameworks.
- No direct Svelte/React/Vue integration—focus on raw HTML and JS/TS.

## Key Files & Directories
- `src/lib/index.ts`, `src/lib/main.ts`: core logic and exports
- `src/routes/+page.svelte`: example integration (if present)
- `README.md`: usage, features, and workflow summary

---
For questions or missing context, see the monorepo documentation or contact maintainers.
