

# AGENTS.md — Conventions for AI/Copilot Usage in idae-stator

## Project Context
- **idae-stator** is a framework-agnostic, reactive state management library written in TypeScript/JavaScript.
- The core logic is in `src/lib/stator/Stator.ts`.
- SvelteKit is used only for demos/tests, not as a primary target.

## Rules and Conventions for AI/Copilot Agents

- **Entry Point:** Use the `stator` function to create reactive state objects.
- **Change Handling:** State objects expose an `.onchange` handler to detect modifications.
- **State Mutation:** State is mutated via the `.stator` property (e.g., `countState.stator++`).
- **UI Updates:** UI updates are triggered manually (see `updateUI()` in the demo) or via Svelte reactivity.
- **Logic Co-location:** Prefer colocating state logic and UI logic for clarity.
- **No External Dependencies:** Do not use any external state management libraries.
- **Extensibility:** Add new state helpers in `src/lib/stator/` if needed.

## Best Practices for Copilot/AI
- Follow idiomatic TypeScript/JavaScript and Svelte patterns unless otherwise specified.
- Refer to `README.md` for usage examples and expected HTML structure.
- For tests, use Jest (`npx jest src/lib/stator/Stator.test.ts`).
- For builds, use Vite (`vite.config.ts`).
- For SvelteKit integration, see `svelte.config.js` if needed.

## Example Usage (for AI)

```js
import { stator } from './Stator.ts';
let count = stator(0);
count.onchange = (oldVal, newVal) => { /* ... */ };
count.stator++;
```

## Additional Notes
- The project does not define any AI-specific rules beyond those above.
- Always prioritize simplicity, clarity, and framework-agnostic compatibility.

---

## Future Improvements and Directions

- **Deep Reactivity**
  - Reactivity on objects is shallow: mutation of nested properties is not automatically detected (no deep reactivity).
  - Possible improvement: support for deep reactivity (deep proxy) or another recursive observation mechanism.
- **Interoperability**
  - Integration with other frameworks (React, Vue, etc.) is not demonstrated, even though the library is agnostic.
  - Possible improvement: provide helpers or examples for other frameworks.
- **API Ergonomics**
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
- **Array Handling**
  - Behavior on arrays is neither documented nor tested.
  - Possible improvement: clarify and test mutation handling on arrays.

For more details, see:
- [copilot-instructions.md](.github/copilot-instructions.md)
- [README.md](README.md)
- [src/lib/stator/Stator.ts](src/lib/stator/Stator.ts)
