# AGENTS.md — AI Coding Guide for `idae-machine`

> Read `CLAUDE.md` first for full context. This file focuses on workflows and decision trees.

---

## Quick Decision Tree

### "I need to add a new field type"
→ See [Custom Field Type Workflow](#custom-field-type-workflow)

### "I need to add a UI component"
→ See [Component Hierarchy](#component-hierarchy) then [Component Checklist](#component-checklist)

### "I need to fix a validation error"
→ `src/lib/main/machine/MachineSchemeValidate.ts`

### "I need to refactor schema logic"
→ Read [Refactoring Rules](#refactoring-rules) before modifying `src/lib/main/`

### "Tests are failing"
→ Run `pnpm run test`, check `src/lib/main/__tests__/`

---

## Component Hierarchy

```
explorer/ → card/ → field/ → input/
```

| Folder | Prefix | Receives | Knows |
|--------|--------|----------|-------|
| `explorer/` | `Explorer*` | `collection` + scheme | paginate, filter, sort |
| `card/` | `Card*` | `collection` + record `id` | CRUD, FK relations |
| `field/` | `Field*` | `fieldName` + `value` | display, edit, validate |
| `input/` | `Input*` | `value` + type opts | render input only |

**New component location:**
- Collection browser → `src/lib/main-ui/explorer/`
- Record form/view → `src/lib/main-ui/card/`
- Field renderer → `src/lib/main-ui/field/`
- Atomic input → `src/lib/main-ui/input/`
- Structural shell → `src/lib/main-ui/layout/`
- Micro UI → `src/lib/main-ui/fragments/`

---

## Custom Field Type Workflow

**Trigger:** Need new field type (e.g. `'color'`, `'rating'`)

1. **Schema** — use `field()` builder:
   ```ts
   import { field } from '$lib/main/machine/fieldBuilder.js';
   rating: field('rating', { required: true })
   ```

2. **Input atom** — create `src/lib/main-ui/input/InputRating.svelte`:
   ```svelte
   <script lang="ts">
     let { value = $bindable(0), id, name, form } = $props();
   </script>
   <!-- your markup -->
   ```
   Export from `src/lib/main-ui/input/index.ts`

3. **Wire in FieldDisplay** — add dispatch case in `fieldInput` snippet:
   ```svelte
   {:else if fieldForge.fieldType === 'rating'}
       <InputRating bind:value={internalValue} {id} {name} {form} />
   ```

4. **MachineFieldType** (optional) — register formatter/validator:
   ```ts
   import { MachineSchemeFieldType } from '$lib/main/machine/MachineFieldType.js';
   MachineSchemeFieldType.registerFieldType({
     id: 'rating',
     formatter: (v) => Number(v),
     validator: (v) => Number(v) >= 0 && Number(v) <= 5
   });
   ```

5. **Test** — `src/lib/main/__tests__/machineParserForge.test.ts`

---

## Component Checklist

**Svelte 5 rules:**
- `$state`, `$derived`, `$effect` — no `$:`, no `onMount`, no `export let`
- `$props()` for all props
- `$bindable()` for two-way binding
- Key all `{#each}` blocks: `{#each items as item (item.id)}`

**Template for input atom:**
```svelte
<script lang="ts">
  let { value = $bindable(), id, name, form, disabled = false } = $props<{
    value?: YourType;
    id?: string; name?: string; form?: string; disabled?: boolean;
  }>();
</script>
<!-- markup -->
```

**Export:** add to `src/lib/main-ui/input/index.ts`

---

## Schema Declaration

**Always use `field()` for new schemas:**
```ts
import { field } from '$lib/main/machine/fieldBuilder.js';

fields: {
  id:    field('id',    { readonly: true }),
  name:  field('text',  { required: true }),
  email: field('email', { required: true }),
  catId: field('fk-category.id'),
  desc:  field('text-long'),
}
```

**Do NOT write new string rules** like `'text (required)'` — they are deprecated.  
Old string rules still parse correctly (backward compat), but do not add new ones.

---

## Refactoring Rules

Before modifying `src/lib/main/`:

1. `MachineDb` caches `MachineScheme` — invalidate if changing parse logic
2. `MachineParserForge` must stay pure (no I/O, deterministic)
3. `idae-idbql` changes must be backward-compatible (other monorepo packages)
4. Mark deprecated code with `@deprecated` JSDoc + migration path

---

## Testing

```bash
pnpm run test          # all tests
pnpm run test:unit     # watch mode
pnpm run check         # TypeScript
```

Test files: `src/lib/main/__tests__/*.test.ts`  
Reference schema: `src/lib/demo/demoScheme.ts`  
Always call `machine.start()` in test setup before accessing store/logic.

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| FK field shows raw id in `show` mode | FK show rendering not yet implemented — display `internalValue` for now |
| `machine.store[collection]` is undefined | Call `machine.init()` + `machine.start()` first |
| Component not reactive | Use `$derived`/`$effect`, not manual subscriptions |
| New field type not dispatched | Add case to `FieldDisplay` `fieldInput` snippet |
| TypeScript error on `TplFieldRules` | Object rules need `TplFieldRulesObject` — use `field()` builder |

---

## Before Committing

- [ ] `pnpm run check` — no type errors
- [ ] `pnpm run test` — all green
- [ ] New components use Svelte 5 runes only
- [ ] New fields use `field()` builder, not string rules
- [ ] Exports added to relevant `index.ts`
