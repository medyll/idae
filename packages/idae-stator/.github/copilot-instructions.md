
# Copilot Instructions for idae-stator

## Project Architecture & Purpose
- **idae-stator** is a framework-agnostic, minimal state management library for JavaScript/TypeScript.
- The core logic is in [src/lib/stator/Stator.ts](../src/lib/stator/Stator.ts).
- SvelteKit ([src/routes/](../src/routes/)) is used only for demos/tests, not as a primary target.
- No external state management dependencies are used or allowed.

## Key Patterns & Conventions
- **State Creation:** Use the `stator` function to create reactive state objects or primitives.
  - Example: `let count = stator(0);`
- **State Mutation:** Update state via the `.stator` property (e.g., `count.stator++` or `objState.stator.key = value`).
- **Change Detection:** Attach an `.onchange` handler to state objects for change tracking.
  - Example: `count.onchange = (oldVal, newVal) => { ... }`
- **UI Updates:**
  - In vanilla JS, trigger UI updates manually (see `updateUI()` in [README.md](../README.md)).
  - In Svelte, rely on Svelte's reactivity.
- **Colocation:** Prefer colocating state and UI logic for clarity.

## Directory Structure & Key Files
- [src/lib/stator/](../src/lib/stator/) — Core stator implementation and tests ([Stator.ts](../src/lib/stator/Stator.ts), [Stator.test.ts](../src/lib/stator/Stator.test.ts))
- [src/routes/](../src/routes/) — SvelteKit demo UI
- [scripts/](../scripts/) — Project scripts (e.g., packaging)
- [static/](../static/) — Static assets for demos

## Developer Workflows
- **Build:** Use Vite ([vite.config.ts](../vite.config.ts)) for local dev and builds.
  - Example: `npx vite build`
- **Test:** Run tests with Jest ([jest.config.js](../jest.config.js)).
  - Example: `npx jest src/lib/stator/Stator.test.ts`
- **Type Checking:** Use TypeScript ([tsconfig.json](../tsconfig.json)).
- **SvelteKit Integration:** See [svelte.config.js](../svelte.config.js) for demo/test integration.

## Project-Specific Conventions
- No external state management libraries allowed.
- Extend only by adding helpers in [src/lib/stator/](../src/lib/stator/).
- Follow idiomatic TypeScript/JavaScript and Svelte practices unless otherwise noted.
- See [AGENTS.md](../AGENTS.md) for additional agent conventions (mirrors these instructions).

## Example Usage
```js
import { stator } from './Stator.ts';
let count = stator(0);
count.onchange = (oldVal, newVal) => { /* ... */ };
count.stator++;
```

## References
- [README.md](../README.md) — Usage patterns, HTML structure, and demo logic
- [src/lib/stator/Stator.ts](../src/lib/stator/Stator.ts) — Core implementation
- [AGENTS.md](../AGENTS.md) — AI/agent conventions

---
If any section is unclear or incomplete, please provide feedback for further refinement.
