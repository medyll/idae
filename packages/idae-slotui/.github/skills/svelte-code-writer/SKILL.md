---
name: svelte-code-writer
description: CLI tools for Svelte 5 documentation lookup and code analysis. MUST be used whenever creating or editing any Svelte component (.svelte) or Svelte module (.svelte.ts/.svelte.js).
---

# Svelte 5 Code Writer

## Trigger

**This skill MUST be triggered automatically whenever:**

- A new `.svelte`, `.svelte.ts`, or `.svelte.js` file is created
- An existing `.svelte`, `.svelte.ts`, or `.svelte.js` file is modified
- The user explicitly requests to create or modify a Svelte file

_Always invoke the Svelte 5 Code Writer skill before generating, editing, or refactoring any Svelte component or module file._

## CLI Tools

You have access to `@sveltejs/mcp` CLI for Svelte-specific assistance. Use these commands via `npx`:

### List Documentation Sections

`npx @sveltejs/mcp list-sections`

### Get Documentation

`npx @sveltejs/mcp get-documentation "<section1>,<section2>,..."`

### Svelte Autofixer

`npx @sveltejs/mcp svelte-autofixer "<code_or_path>" [options]`
_Note: Escape $ as \$ in terminal (e.g., \$state)._

## Best Practices & Architecture Standards

When generating or refactoring Svelte 5 components, strictly adhere to these rules:

### 1. Script Module & Type Safety

- All property interfaces and exported types **must** be declared in a module script block.
- **Syntax**: `<script lang="ts" module>`
- This ensures types are exportable without side effects and prevents circular dependencies.

### 2. Mandatory Component Documentation

- Every component must include a standardized JSDoc block for IDE support.
- **Placement**: Add `/** @component */` followed by a concise English description.
- **Location**: Place it immediately after the closing tag of the primary `<script>` block.

### 3. Svelte 5 Runes Logic

- **State**: Use `$state()` for reactive variables. **Prohibited**: `.set()` or `.update()`.
- **Props**: Use `$props<T>()` with destructuring.
- **Binding**: Declare bindable props inside the interface using the `$bindable()` rune.
- **Derivations**: Use `$derived(() => ...)` for complex logic (e.g., filtering `showFields`).
- **Snapshots**: Always use `$state.snapshot(value)` when passing reactive state to external logic, stores, or API calls to strip proxies.

### 4. Events & Communication

- **Callbacks**: Replace `createEventDispatcher` with callback properties (e.g., `let { onsubmit } = $props()`).
- **Context**: Use `getContext` and `setContext` for deep tree communication, integrated within the `$props` defaults where applicable.

### 5. Declarative Template

- **No DOM manipulation**: Do not use `document.querySelector` or manual class toggling.
- **State-driven UI**: Use reactive state (`$state`) to drive UI changes (validation messages, error classes) directly in the template.
- **Snippets**: Use `{#snippet name(...)}` for reusable UI chunks to reduce boilerplate.

---

## Standard Component Template

```svelte
<script lang="ts" module>
  export interface MyComponentProps {
    collection: string;
    data: Record<string, any> = $bindable();
    mode?: 'show' | 'update';
    showFields?: string[];
    onsubmit?: (payload: any) => void;
  }
</script>

<script lang="ts">
  let {
    collection,
    data = $bindable(),
    mode = 'show',
    showFields,
    onsubmit
  } = $props<MyComponentProps>();

  // Reactive field filtering
  const visibleFields = $derived(() => {
    const keys = Object.keys(data);
    return showFields ? keys.filter(k => showFields.includes(k)) : keys;
  });
</script>

<div class="component-wrapper">
  {#each visibleFields() as field}
    <label>{field}</label>
    <input bind:value={data[field]} disabled={mode === 'show'} />
  {/each}

  {#if mode !== 'show'}
    <button onclick={() => onsubmit?.($state.snapshot(data))}>Submit</button>
  {/if}
</div>
```

---

## How do I document my components?

In editors which use the Svelte Language Server you can document Components, functions and exports using specially formatted comments in html comments.

```svelte
<script>
  /** What should we call the user? */
  export let name = 'world';
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```svelte
  <main name="Arethra">
-->
``` 