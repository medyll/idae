# Project Analysis — idae-stator
_Generated: 2026-03-16_

## Current Architecture Summary

**idae-stator** is a lightweight (~500 LOC) universal reactive state management library. It wraps any JavaScript value in a deep-reactive Proxy with EventTarget-compatible change notifications, working across Browser, Node.js, and SSR environments.

```
stator(initialState)
       │
       ▼
 AugmentedState<T>
  ├── .value / .stator   ← reactive proxy (deep, recursive)
  ├── .onchange          ← simple callback (oldVal, newVal)
  ├── .addEventListener  ← EventTarget API ('stator:change')
  ├── .removeEventListener
  └── .triggerChange
```

### File Structure

```
src/lib/
├── index.ts               ← re-exports stator()
└── stator/
    ├── Stator.ts          ← core (~500 LOC): Proxy engine, EventTarget polyfill, types
    └── Stator.test.ts     ← Vitest test suite
```

Single-file core — all logic in `Stator.ts`.

---

## Strengths

1. **Zero dependencies at runtime** — commanders/commander are dev/CLI only; no lib deps for consumers
2. **Deep reactivity via Proxy** — nested mutations trigger notifications without explicit paths
3. **WeakMap proxy cache** — prevents duplicate wrapping, memory efficient
4. **Universal EventTarget polyfill** — covers Browser, Node.js, legacy DOM
5. **Full TypeScript generics** — `AugmentedState<T>` preserves original type
6. **Good test coverage** — primitives, objects, arrays, nested structures, event listeners all covered

---

## Weaknesses / Technical Debt

1. **Single large file** — `Stator.ts` mixes core logic, type definitions, and platform polyfills; harder to maintain as it grows
2. **`commander` in production `dependencies`** — CLI tooling listed as runtime dep, should be `devDependencies` or in a separate CLI package
3. **No computed/derived state** — users must manually subscribe to compute derived values
4. **No batch update API** — multiple mutations trigger multiple change events
5. **Svelte peer dependency** — listed as peer dep but the core lib has no Svelte coupling; may confuse non-Svelte consumers
6. **Demo routes mixed with lib** — `src/routes/` (SvelteKit demo) lives alongside `src/lib/` (publishable code)
7. **`stator` alias for `value`** — two names for the same thing adds cognitive overhead
8. **No `unsubscribe` helper** — addEventListener/removeEventListener requires manual listener reference management

---

## Recommended Improvements (Prioritized)

| Priority | Item | Effort |
|----------|------|--------|
| High | Move `commander` to `devDependencies` | XS |
| High | Split `Stator.ts` into: `types.ts`, `polyfill.ts`, `proxy.ts`, `stator.ts` | S |
| Medium | Add `subscribe()` → returns unsubscribe fn (ergonomic DX) | S |
| Medium | Add `batch(fn)` utility to defer notifications | S |
| Low | Add `computed(fn, deps)` for derived state | M |
| Low | Clarify/remove Svelte peer dep if lib is truly framework-agnostic | XS |

---

## Technical Debt Inventory

- `Stator.ts:1` — monolithic file needs splitting
- `package.json:dependencies` — `commander` and `command` should not be runtime deps for a state lib
- No changelog automation despite `@semantic-release/github` in devDeps
- `src/routes/` demo should be documented or moved to `examples/`
