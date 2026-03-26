# Contributing to @medyll/idae-machine

Thank you for your interest in contributing to `@medyll/idae-machine`! This guide will help you get started.

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 8+ (this is a pnpm monorepo)

### Setup

```bash
# Clone the repository
git clone https://github.com/medyll/idae.git
cd idae/packages/idae-machine

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm run test
```

## Development Workflow

### Commands

```bash
pnpm run dev              # Start dev server
pnpm run build            # Build library (vite build + svelte-package + publint)
pnpm run check            # Svelte type checking
pnpm run lint             # Prettier check
pnpm run format           # Auto-format code
pnpm run test             # Run all tests (vitest --run)
pnpm run test:unit        # Watch mode tests
pnpm run test:e2e         # Playwright e2e tests
```

### Code Style

- Use **Svelte 5 runes** only: `$state`, `$derived`, `$effect` (no Svelte 4 patterns like `$:`)
- Always key `{#each}` blocks: `{#each items as item (item.id)}`
- Use `$lib` alias for internal imports
- Follow **TypeScript** for all new code
- Format with Prettier: `pnpm run format`

### Writing Tests

Tests use **Vitest** + **@testing-library/svelte**:

- **Unit tests**: `src/lib/main/__tests__/` for core logic
- **Component tests**: Colocate as `Component.svelte.spec.ts`
- Use realistic schemas from `src/lib/demo/testScheme.ts`
- Cover edge cases, error paths, and concurrent scenarios

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { MachineDb } from '../machineDb.js';

describe('MyFeature', () => {
  it('should handle edge case', async () => {
    const db = new MachineDb(testSchema);
    const validator = db.collection('users').validator;
    const result = await validator.validateField('email', 'test@example.com');
    expect(result.isValid).toBe(true);
  });
});
```

### Documentation

- All public APIs must have **JSDoc** comments in English:
  - `@param` — parameter descriptions
  - `@return` — return value
  - `@role` — for components, describe the UI role
- Update `src/lib/index.ts` exports for new public APIs
- Update `docs/API.md` and `docs/EXAMPLES.md` for user-facing features

### Before Submitting a PR

1. **Run checks**: `pnpm run check`
2. **Run linter**: `pnpm run lint`
3. **Run tests**: `pnpm run test` (all must pass)
4. **Format code**: `pnpm run format`
5. Create a clear commit message describing your changes

## Architecture

```
UI Components (Svelte 5)        →  src/lib/data/, src/lib/field/, src/lib/fragments/
       ↓
Form & Validation Logic         →  src/lib/main/machine/MachineSchemeValidate.ts
       ↓
Schema DSL & Parsing            →  src/lib/main/machineParserForge.ts
       ↓
Machine Core                    →  src/lib/main/machine.ts, machineDb.ts
       ↓
IndexedDB                       →  @medyll/idae-idbql (workspace dependency)
```

### Key Classes

- **`MachineDb`**: Schema engine, manages collections and validation
- **`MachineScheme`**: Per-collection schema wrapper
- **`MachineFieldType`**: Field type registry and validation rules
- **`MachineParserForge`**: DSL parser (must remain pure/no side effects)

### Field DSL

Fields are defined using a string DSL:

```typescript
'text (required)'
'id (readonly)'
'fk-category.id (required)'
'array-of-number'
```

Modifiers: `required`, `readonly`, `private`

## Error Handling

- **Validation errors**: Use `MachineErrorValidation` for field validation failures
- **Collection errors**: Use `MachineError` for collection logic errors
- Never suppress errors silently — always propagate or log

## Svelte 5 Strict Rules

- Use `$state`, `$derived`, `$effect` runes
- **Never** use `$:` reactive declarations (Svelte 4 syntax)
- **Never** use `onMount`, `onDestroy` (use `$effect` instead)
- Always key `{#each}` blocks
- Use `{@render snippet()}` for snippet rendering

## Performance Guidelines

- Single field validation should complete < 10ms
- Bulk validation (100+ fields) should complete < 1s
- Use `$derived` for computed state (not `$effect`)
- Avoid unnecessary re-renders with proper keying

## Reporting Issues

Use the [GitHub issue tracker](https://github.com/medyll/idae/issues) with:

- Clear title and description
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Test case if possible

## License

@medyll/idae-machine is licensed under the MIT License. By contributing, you agree your changes are licensed the same way.

## Questions?

- 📖 [API Documentation](./docs/API.md)
- 🔧 [Examples](./docs/EXAMPLES.md)
- 💬 [GitHub Discussions](https://github.com/medyll/idae/discussions)

Thank you for contributing! 🚀
