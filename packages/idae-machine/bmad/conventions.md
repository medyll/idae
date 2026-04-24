# Project Conventions — idae-machine

Discovered conventions from codebase analysis. Append-only.

## Code Style

- **Indentation:** Tabs (enforced by @medyll/idae-config-prettier)
- **Quotes:** Single quotes
- **Trailing commas:** No
- **Line width:** 100 characters

## Svelte 5 Rules

- Use `$state` for local reactive state
- Use `$derived` for computed values  
- Use `$effect` for side effects
- Use `bind:` for two-way binding only when needed
- No `onMount`, `onDestroy` — use `$effect` instead
- No `each` without explicit key: `{#each items as item (item.id)}`

## File Organization

| Purpose | Location |
|---------|----------|
| Core schema logic | `src/lib/main/machine/*.ts` |
| Field parsing | `src/lib/main/machineParserForge.ts` |
| Form components | `src/lib/form/*.svelte` |
| Data components | `src/lib/data/*.svelte` |
| UI views | `src/lib/ui/*.svelte` |
| Fragments | `src/lib/fragments/*.svelte` |
| Tests | `src/lib/main/__tests__/*.test.ts` |
| Component tests | Colocated: `Component.svelte.spec.ts` |

## Naming Conventions

- **Classes:** PascalCase (MachineDb, MachineScheme)
- **Files:** camelCase for logic, PascalCase for components
- **Tests:** `.test.ts` for logic, `.svelte.spec.ts` for components

## Testing

- **Framework:** Vitest + @testing-library/svelte
- **Command:** `pnpm run test` (single run), `pnpm run test:unit` (watch)
- **Coverage:** Core classes must have unit tests

## Dependencies

- **Package manager:** pnpm (NOT npm/yarn)
- **Node:** 18+
- **Key deps:** Svelte 5, @medyll/idae-idbql, @medyll/idae-slotui-svelte

## Commands

```bash
pnpm run check      # Type checking (svelte-check)
pnpm run test       # Run all tests
pnpm run build      # Build library
pnpm run format     # Auto-format with Prettier
pnpm run lint       # Prettier check
```
