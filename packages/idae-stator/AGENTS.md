

# GitHub Copilot Instructions for idae-stator

**Package Manager**: This package is part of the Idae monorepo, which uses **pnpm** for dependency and script management. Use `pnpm install`, `pnpm run`, etc. to ensure consistency.

## Overview

`idae-stator` is a framework-agnostic, reactive state management library for TypeScript/JavaScript. Core logic is in `src/lib/stator/Stator.ts`. SvelteKit is used only for demos/tests.

### Critical Patterns
- Use the `stator` function to create reactive state objects.
- State objects expose an `.onchange` handler for change detection.
- Mutate state via the `.stator` property (e.g., `count.stator++`).
- UI updates are manual (see `updateUI()` in demo) or via Svelte reactivity.
- Do not use external state management libraries.
- Add new helpers in `src/lib/stator/` if needed.

### Build & Test
- Build: `pnpm run build` (Vite)
- Test: `pnpm run test` (Jest)
- Lint/format: `pnpm run lint && pnpm run format`

### Best Practices
- Prefer colocating state and UI logic for clarity.
- Follow idiomatic TypeScript/JavaScript and Svelte patterns.
- See [README.md](README.md) for usage and HTML structure.

### Example
```js
import { stator } from './Stator.ts';
let count = stator(0);
count.onchange = (oldVal, newVal) => { /* ... */ };
count.stator++;
```

---

For more, see the package [README.md](README.md) or monorepo documentation.
  - Possible improvement: add integration guides, diagrams, and advanced examples.
- **Extensibility**
  - Adding helpers is planned, but there are no complementary modules yet (e.g., undo/redo, persistence, etc.).
  - Possible improvement: provide official extensions or hooks to enrich the library.
- **Array Handling**
  - Behavior on arrays is neither documented nor tested.
  - Possible improvement: clarify and test mutation handling on arrays.

For more details, see:
- [copilot-instructions.md](.github/copilot-instructions.md)
- [README.md](README.md)
- [src/lib/stator/Stator.ts](src/lib/stator/Stator.ts)
