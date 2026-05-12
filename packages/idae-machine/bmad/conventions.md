# Conventions — idae-machine

## Code style

- Indentation: Tabs
- Quotes: Single
- Trailing commas: No
- Line width: 100 chars

## Svelte 5 rules

- `$state`, `$derived`, `$effect` — no `$:`, no `onMount`, no `onDestroy`
- `$props()` for all props
- `$bindable()` for two-way binding
- Key all `{#each}` blocks: `{#each items as item (item.id)}`
- No `export let` in new components

## File locations

| Purpose | Location |
|---------|----------|
| Core schema logic | `src/lib/main/machine/*.ts` |
| Field parser | `src/lib/main/machineParserForge.ts` |
| Field builder helper | `src/lib/main/machine/fieldBuilder.ts` |
| Explorer components | `src/lib/main-ui/explorer/` |
| Card components | `src/lib/main-ui/card/` |
| Field components | `src/lib/main-ui/field/` |
| Input atoms | `src/lib/main-ui/input/` |
| Layout | `src/lib/main-ui/layout/` |
| Fragments | `src/lib/main-ui/fragments/` |
| Logic tests | `src/lib/main/__tests__/*.test.ts` |
| Component tests | Colocated: `Component.svelte.spec.ts` |

## Naming

- Classes: PascalCase (`MachineDb`, `MachineScheme`)
- Files: camelCase for logic, PascalCase for components
- Components: prefix = level (`Explorer*`, `Card*`, `Field*`, `Input*`)
- Tests: `.test.ts` for logic, `.svelte.spec.ts` for components

## Schema field declaration

```ts
import { field } from '$lib/main/machine/fieldBuilder.js';

fields: {
  name: field('text', { required: true }),   // ← new world
  // name: 'text (required)',                // ← deprecated string format
}
```

## Commands

```bash
pnpm run check   # TypeScript
pnpm run test    # vitest
pnpm run build   # build library
pnpm run format  # Prettier
pnpm run lint    # Prettier check
```

## Dependencies

- Package manager: **pnpm** (not npm/yarn)
- Key: Svelte 5, `@medyll/idae-idbql`, `@medyll/idae-slotui-svelte`
