# AGENTS.md - AI Coding Agent Guide for `idae-machine`

> Specific decision trees, workflows, and patterns for AI agents implementing features in idae-machine.

## Quick Decision Tree

### "I need to add a new field type"
→ See [Custom Field Type Workflow](#custom-field-type-workflow)

### "I need to fix a validation error"
→ Check [Error Handling & Validation](#error-handling--validation) then `src/lib/main/machine/MachineSchemeValidate.ts`

### "I need to add a UI component for a feature"
→ Start with [Component Creation Checklist](#component-creation-checklist)

### "I need to refactor schema logic"
→ Read [Refactoring Rules](#refactoring-rules) before modifying `src/lib/main/`

### "Tests are failing"
→ See [Testing Strategy](#testing-strategy) and run `pnpm run test`

---

## Task Patterns

### Custom Field Type Workflow

**Trigger:** New field DSL needed (e.g., `'currency'`, `'email-verified'`)

**Steps:**
1. **Define in schema** (`src/lib/demo/testScheme.ts` or user schema)
   - Add field: `fieldName: 'currency (required)'`
   - Decide: Will existing UI component work, or do you need custom rendering?

2. **Extend parser** (`src/lib/main/machineParserForge.ts`)
   - Add condition in `parse()` for your DSL pattern
   - Return `IDbForge` with `type`, `format`, `pattern`/`min`/`max`, `formatHint`
   - **Rule:** Parser must be pure—no I/O, no side effects

3. **Add validation** (`src/lib/main/machine/MachineSchemeValidate.ts`)
   - Extend `validateField()` to check format-specific rules
   - Throw `MachineErrorValidation(message)` on failure
   - Example: `if (forge.format === 'currency') { /* regex or range check */ }`

4. **Component (if needed)** (`src/lib/form/FieldYourType.svelte`)
   - Props: `value`, `error`, `metadata` (optional forge metadata)
   - Export: bind-able reactive state
   - Keep focused: one field type per component

5. **Wire in renderer** (`src/lib/form/CreateUpdate.svelte` or `FieldInPlace.svelte`)
   - Conditional: `if (fieldForge.format === 'currency') { render FieldCurrency }`
   - Fallback to generic if unmatched

6. **Test** (`src/lib/main/__tests__/machineParserForge.test.ts`)
   - Parse test: verify DSL → `IDbForge` transformation
   - Validation test: check error cases
   - Component test: (if created) test with `@testing-library/svelte`

**Checklist before commit:**
- [ ] Parser handles all DSL variants (with/without rules)
- [ ] Validation covers edge cases (empty, null, invalid format)
- [ ] Component (if exists) is reactive and exports value properly
- [ ] Tests pass: `pnpm run test`
- [ ] Type check passes: `pnpm run check`

---

### Component Creation Checklist

**When:** Adding new Svelte UI component (form, list, dialog, etc.)

**File location:** Determine by purpose:
- Form field input → `src/lib/form/FieldYourType.svelte`
- Form container → `src/lib/form/YourContainer.svelte`
- Collection view → `src/lib/ui/YourView.svelte`
- Reusable fragment → `src/lib/fragments/YourFragment.svelte`

**Template:**
```svelte
<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import type { IDbForge } from '@medyll/idae-idbql';

  /**
   * @role Props documentation
   */
  export let value: any = undefined;
  export let metadata: IDbForge | undefined = undefined;
  export let error: string | null = null;

  let internalState = $state(value);

  // Reactivity: sync with parent
  $effect(() => {
    internalState = value;
  });
</script>

<div class="component">
  <!-- Your markup -->
</div>

<style>
  /* Component styles */
</style>
```

**Svelte 5 Rules:**
- Use `$state` for local reactive state
- Use `$derived` for computed values
- Use `$effect` for side effects
- Use `bind:` for two-way binding only when needed
- No `onMount`, `onDestroy`—use `$effect` instead
- No `each` without explicit key: `{#each items as item (item.id)}`

**Export/Import:**
- Add to `src/lib/index.ts` export (auto-export entry)
- Import in parent via `$lib` alias: `import YourComponent from '$lib/form/YourComponent.svelte'`

**Testing:**
- Create `YourComponent.svelte.spec.ts` (jsdom environment)
- Use `@testing-library/svelte` for rendering tests
- Run: `pnpm run test:unit`

---

### Error Handling & Validation

**When validation fails:**
1. Throw `MachineErrorValidation` (from `src/lib/main/machine/MachineErrorValidation.ts`)
   ```typescript
   throw new MachineErrorValidation(`Field 'email' is invalid: ${value}`);
   ```

2. Caller catches and handles:
   ```typescript
   try {
     validator.validateField('email', userInput);
   } catch (e) {
     if (e instanceof MachineErrorValidation) {
       displayError(e.message);
     } else {
       throw e; // Re-throw unexpected errors
     }
   }
   ```

**Collection logic errors:**
- Throw `MachineError` (from `src/lib/main/machine/MachineError.ts`)
- Used by `MachineSchemeValues` when introspection fails
- Example: Invalid foreign key reference

**Never suppress errors silently**—always log or propagate for debugging.

---

### Refactoring Rules

**Before modifying `src/lib/main/`:**

1. **Check caching strategy**
   - `MachineDb#idbCollectionsList` caches `MachineScheme` per collection
   - Invalidate cache if changing schema parsing logic
   - See `machineDb.ts` for pattern

2. **Maintain jsDoc**
   - Add/update `@role`, `@param`, `@return`
   - Example roles: "Constructor", "Accessor", "Utility", "Internal"
   - Keep English; use backticks for types

3. **Pure functions**
   - `MachineParserForge.parse()` must be pure
   - No I/O, no state mutations, deterministic output

4. **Type safety**
   - Use generics: `MachineSchemeValues<T>`, `MachineSchemeFieldForge<T>`
   - Avoid `any` unless unavoidable
   - Let TypeScript infer when possible

5. **Test coverage**
   - Core classes must have unit tests
   - New public methods need test cases
  - Run: `pnpm run test` before committing

6. **Backward compatibility**
   - Mark deprecated APIs with `@deprecated` in jsDoc
   - Keep old accessors working (e.g., `collections` → `logic`)
   - Document migration path in code comment

---

## Testing Strategy

**Use `pnpm` for all commands in this repo (do not use `npm`).**

### Test Organization
```
src/lib/main/__tests__/
  machine.spec.ts           // Machine lifecycle & accessors
  machineDb.test.ts         // Schema introspection
  machineScheme.test.ts     // Collection utilities
  machineParserForge.test.ts // Field DSL parsing
  MachineFieldType.test.ts  // Field type detection

src/lib/form/
  CreateUpdate.svelte.spec.ts // Component behavior (jsdom)
```

### Running Tests

**All tests:**
```bash
pnpm run test:unit        # Watch mode
pnpm run test             # Single run
```

**Single test file:**
```bash
pnpm vitest run src/lib/main/machine.spec.ts
```

**Component tests only:**
```bash
pnpm vitest run --project=client
```

**Logic tests only:**
```bash
pnpm vitest run --project=server
```

### Test Patterns

**Schema parsing test:**
```typescript
import { MachineParserForge } from '$lib/main/machineParserForge.js';

describe('MachineParserForge', () => {
  it('parses text field with required rule', () => {
    const forge = new MachineParserForge();
    const result = forge.parse('text (required)');
    expect(result.type).toBe('text');
    expect(result.required).toBe(true);
  });
});
```

**Validation test:**
```typescript
import { MachineSchemeValidate } from '$lib/main/machine/MachineSchemeValidate.js';
import { MachineErrorValidation } from '$lib/main/machine/MachineErrorValidation.js';

describe('MachineSchemeValidate', () => {
  it('throws on missing required field', () => {
    const validator = schema.validator;
    expect(() => {
      validator.validateField('name', '');
    }).toThrow(MachineErrorValidation);
  });
});
```

**Component test (jsdom):**
```typescript
import { render } from '@testing-library/svelte';
import CreateUpdate from '$lib/form/CreateUpdate.svelte';

describe('CreateUpdate', () => {
  it('renders form with fields', () => {
    const { container } = render(CreateUpdate, {
      props: { collection: 'product' }
    });
    expect(container.querySelector('input')).toBeTruthy();
  });
});
```

---

## Code Organization Heuristics

### "Where should this code live?"

**New class/utility function:**
- Part of schema logic? → `src/lib/main/machine/*.ts`
- Field parsing/formatting? → `src/lib/main/machineParserForge.ts` or extend existing field class
- Error type? → `src/lib/main/machine/MachineError*.ts`
- Database operation (deprecated)? → `src/lib/db/` (avoid new code here)

**New component:**
- Form field input? → `src/lib/form/Field*.svelte`
- Form container/layout? → `src/lib/form/*.svelte`
- Collection view/list? → `src/lib/ui/*.svelte`
- Reusable shell/dialog? → `src/lib/fragments/*.svelte`

**New test:**
- Core logic test? → `src/lib/main/__tests__/*.test.ts` or `.spec.ts`
- Component test? → Colocated: `FileName.svelte.spec.ts` (same directory as component)

---

## Common Pitfalls & Solutions

| Pitfall | Solution |
|---------|----------|
| Parser not recognizing new DSL | Check `MachineParserForge.parse()` includes pattern. Test: `pnpm run test -- machineParserForge` |
| Component not updating when `machine.idbqlState` changes | Use `$derived` or `$effect`, not manual subscriptions. Avoid `onMount` |
| Validation error not thrown | Ensure `MachineSchemeValidate` method is called before form submission. Check error instance type |
| Tests failing on schema access | Use `testScheme` from `src/lib/demo/testScheme.ts` as reference. Verify `machine.start()` called first |
| TypeScript errors on generics | Explicitly type: `MachineSchemeValues<Product>` instead of relying on inference |
| Build fails with `svelte-package` | Run `pnpm run check` to sync Svelte Kit types first. Check `svelte.config.js` for lib path |

---

## Before Committing

**Checklist:**
- [ ] `pnpm run check` passes (no type errors)
- [ ] `pnpm run lint` passes (no style violations)
- [ ] `pnpm run test` passes (all tests green)
- [ ] jsDoc added/updated for new classes/methods
- [ ] No hardcoded field logic (use schema-first approach)
- [ ] Component uses Svelte 5 runes only
- [ ] `src/_old/` not modified (migration reference only)
- [ ] Exports added to `src/lib/index.ts` if public API

**If adding a PR:**
- Reference issue: "Closes #123"
- Describe architecture changes
- Note any breaking changes
- Include test coverage %

---

## Reference Links

- **Architecture diagram:** `docs/machine-architecture.md` (Mermaid + French notes)
- **Example schema:** `src/lib/demo/testScheme.ts`
- **Core entry point:** `src/lib/main/machine.ts`
- **IDBQL docs:** [@medyll/idae-idbql](https://github.com/medyll/idae-idbql)
- **Svelte 5 runes:** [Svelte 5 docs](https://svelte.dev/docs)
