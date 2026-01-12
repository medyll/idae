# Copilot Instructions for AI Agents

This guide provides essential knowledge for AI coding agents working in the `idae-query` package. Follow these conventions and workflows to be immediately productive.

## Project Overview
- **Purpose:** Implements a query library for TypeScript/JavaScript, focused on flexible data querying and manipulation.
- **Major Components:**
  - `src/lib/` — Core library code, organized by feature (operators, path, query, resultSet).
  - `src/routes/` — Svelte page(s) for UI integration/testing.
  - `scripts/` — Utility scripts for packaging and build.
  - `static/` — Static assets for Svelte app.
- **Integration:** Designed to work with `@medyll/idae-engine` for data operations.

## Architecture & Patterns
- **TypeScript-first:** All core logic is in TypeScript. Use type definitions from `src/lib/types.ts`.
- **Operators:** Extend or modify query logic via `src/lib/operators/`.
- **Path Resolution:** Use helpers in `src/lib/path/` for resolving query paths.
- **ResultSet:** Central class for query results, tested in `src/lib/resultSet/resultset.test.ts`.
- **Testing:** All features have dedicated test files in their respective folders.
- **Svelte Integration:** UI is built with Svelte, configured via `svelte.config.js` and `vite.config.ts`.

## Developer Workflows
- **Build:** Use Vite for development and builds. See `vite.config.ts`.
- **Test:** Run tests with `npm test` or `yarn test`. Tests are in `src/lib/*/*.test.ts`.
- **Debug:** Debug TypeScript logic using your IDE; Svelte UI can be debugged via Vite dev server.
- **Scripts:** Use scripts in `scripts/` for packaging and pre-build steps.

## Conventions
- **File Structure:** Keep feature code in its own folder under `src/lib/`.
- **Type Safety:** Always use and extend types from `src/lib/types.ts`.
- **Test Coverage:** Add/modify tests in the same folder as the feature code.
- **Integration Points:** Reference `@medyll/idae-engine` for external data operations.
- **Exports:** Use `src/lib/index.ts` as the main export surface for the library.

## Examples
- To add a new operator: create `src/lib/operators/myOperator.ts` and test in `operators.test.ts`.
- To extend ResultSet: update `resultset.ts` and add tests in `resultset.test.ts`.
- For Svelte UI changes: edit `src/routes/+page.svelte` and static assets.

## Key Files
- `src/lib/index.ts` — Main library entry point
- `src/lib/types.ts` — Shared type definitions
- `src/lib/resultSet/resultset.ts` — Core result set logic
- `vite.config.ts`, `svelte.config.js` — Build and UI config
- `README.md` — High-level project info and usage

---
For questions or unclear conventions, review the README or ask for clarification.
