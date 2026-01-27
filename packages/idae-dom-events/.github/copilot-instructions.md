# Copilot Instructions for @medyll/idae-dom-events

## Project Overview
- **Purpose**: Library for observing and reacting to DOM and CSS changes in web applications.
- **Key Modules**: `cssDom` (CSS change tracking), `htmlDom` (DOM mutation observation), event management utilities.
- **Structure**: Main source code in `src/lib/`, with tests in `src/index.test.ts` and `src/lib/*.test.ts`.

## Architecture & Patterns
- **Entry Points**: `src/lib/index.ts` re-exports main modules.
- **Component Pattern**: Utilities are function-based, not class-based. Use `cssDom(selector, options)` and `htmlDom.track(selector, options)` for core functionality.
- **Event Handling**: Callbacks are passed as options (e.g., `onAttributesChange`, `onChildListChange`).
- **Selectors**: Most APIs accept CSS selectors or DOM elements directly.

## Developer Workflows
- **Development**: Use `npm run dev` to start the dev server.
- **Build**: Use `npm run build` to compile for production.
- **Testing**: Use `npm run test` to run unit tests (see `src/index.test.ts`, `src/lib/cssDom.test.ts`).
- **Debugging**: No custom debug scripts; use standard Node.js or browser debugging tools.

## Conventions & Practices
- **TypeScript**: All source code is TypeScript. Type definitions in `src/app.d.ts`.
- **File Naming**: Utility modules in `src/lib/`, grouped by domain (e.g., `cssDom.ts`, `htmlDom.ts`).
- **Tests**: Co-located with source files, named `*.test.ts`.
- **Svelte Integration**: Svelte files in `src/routes/` and `src/lib/components/` for demo or integration purposes.
- **No global state**: All observers are instance-based or selector-based.

## Integration & Dependencies
- **External**: No unusual dependencies; standard npm install.
- **Usage**: Import from `@medyll/idae-dom-events` in consumer projects.

## Examples
- See `README.md` for usage patterns and API details.
- Example: `cssDom('[data-cssDom]', { trackChildList: true }).each(cb)`
- Example: `htmlDom.track('#widget', { onAttributesChange: cb })`

## References
- Main API: `src/lib/cssDom.ts`, `src/lib/htmlDom.ts`
- Entry: `src/lib/index.ts`
- Tests: `src/index.test.ts`, `src/lib/cssDom.test.ts`
- Svelte: `src/routes/+page.svelte`, `src/lib/components/content.html`

---
For more, see the [README.md](../../README.md) or open issues for clarification.
