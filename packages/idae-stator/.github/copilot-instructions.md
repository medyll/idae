
# Copilot Instructions for idae-stator

## Project Architecture & Purpose
- **idae-stator** is a framework-agnostic, minimal state management library for JavaScript/TypeScript.
- The core logic is in [src/lib/stator/Stator.ts](../src/lib/stator/Stator.ts).
- SvelteKit ([src/routes/](../src/routes/)) is used only for demos/tests, not as a primary target.
- No external state management dependencies are used or allowed.

## Key Patterns & Conventions
  - Example: `let count = stator(0);`
  - Example: `count.onchange = (oldVal, newVal) => { ... }`
  - In vanilla JS, trigger UI updates manually (see `updateUI()` in [README.md](../README.md)).
  - In Svelte, rely on Svelte's reactivity.

## Future developments

- **Deep reactivity**
  - Reactivity on objects is shallow: mutation of nested properties is not automatically detected (no deep reactivity).
  - Possible improvement: support for deep reactivity (deep proxy) or another recursive observation mechanism.
- **Interoperability**
  - Integration with other frameworks (React, Vue, etc.) is not demonstrated, even though the library is agnostic.
  - Possible improvement: provide helpers or examples for other frameworks.
- **API ergonomics**
  - Accessing the value via `.stator` and mutating via the same property can be confusing, especially for objects.
  - Possible improvement: clarify the distinction between read/write, or offer an alternative API (e.g., `.get()` / `.set()`).
- **Performance**
  - Proxies are efficient for simple objects, but handling large or deeply nested structures may be problematic.
  - Possible improvement: benchmarks, profiling, and possibly optimizing change management.
- **Tests**
  - Tests cover basic cases, but lack coverage for deep mutation, performance, and edge cases (e.g., property deletion, arrays, etc.).
  - Possible improvement: expand test coverage.
- **Documentation**
  - Documentation is clear for basic usage, but could include FAQs, advanced cases, and comparisons with other libraries.
  - Possible improvement: add integration guides, diagrams, and advanced examples.
- **Extensibility**
  - Adding helpers is planned, but there are no complementary modules yet (e.g., undo/redo, persistence, etc.).
  - Possible improvement: provide official extensions or hooks to enrich the library.
- **Array handling**
  - Behavior on arrays is neither documented nor tested.
  - Possible improvement: clarify and test mutation handling on arrays.
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
