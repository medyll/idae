# Copilot Instructions for idae-stator

## Project Overview
- **idae-stator** provides reactive state management for JavaScript/TypeScript, focusing on simplicity and framework-agnostic usage.
- SvelteKit is used as a test/demo environment; the package is compatible but not designed specifically for Svelte/SvelteKit (which has its own state management).
- The core logic is in `src/lib/stator/Stator.ts`.
- Example usage and patterns are shown in `README.md`.

## Key Patterns & Conventions
- Use the `stator` function to create reactive state objects or primitives.
- State objects expose an `.onchange` handler for change detection.
- State is updated via the `.stator` property (e.g., `countState.stator++`).
- UI updates are triggered manually (see `updateUI()` in the demo) or via Svelte reactivity.
- Prefer colocating state logic and UI logic for clarity.

## Directory Structure
- `src/lib/stator/` — Core stator implementation and tests.
- `src/routes/` — SvelteKit routes and demo UI.
- `scripts/` — Project scripts (e.g., packaging).
- `static/` — Static assets for demos.

## Developer Workflows
- **Build:** Use Vite (`vite.config.ts`) for local dev and builds.
- **Test:** Run tests with Jest (`jest.config.js`). Example: `npx jest src/lib/stator/Stator.test.ts`.
- **Type Checking:** Use TypeScript (`tsconfig.json`).
- **SvelteKit:** Used for testing/demo only; see `svelte.config.js` for integration details if needed.

## Integration & Extensibility
- Framework-agnostic: works in vanilla JS/TS and is compatible with Svelte/SvelteKit, but not tailored for them.
- No external state management dependencies.
- Extend by adding new state helpers in `src/lib/stator/`.

## Examples
- See `README.md` for usage patterns and HTML structure.
- Example state creation:
  ```js
  import { stator } from './Stator.ts';
  let count = stator(0);
  count.onchange = (oldVal, newVal) => { /* ... */ };
  count.stator++;
  ```

## Additional Notes
- No project-specific AI rules or agent conventions found in AGENTS.md.
- Follow idiomatic TypeScript/JavaScript and Svelte best practices unless otherwise noted.

---
For more, see [README.md](../README.md) and [src/lib/stator/Stator.ts](../src/lib/stator/Stator.ts).
