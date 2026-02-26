## Example component (Bits UI / shadcn-svelte pattern)

This is a safe, read-only example showing how to implement a small primitive using Svelte 5 runes and the `child` snippet pattern.

```svelte
<script lang="ts">
  // Props should be destructured via $props()
  const { id, disabled = false, child, children, ...rest } = $props();

  // Local reactive state via $state
  let open = $state(false);

  // Exported types (illustrative)
  export type ExampleRootProps = {
    id?: string;
    disabled?: boolean;
    children?: Snippet;
  };

  function toggle() {
    open.set(!open.get());
  }
</script>

{#if child}
  {@render child({ props: { id, disabled, open: open.get(), ...rest } })}
{:else}
  <div {...rest} role="group" aria-expanded={open.get()} id={id}>
    <button type="button" on:click={toggle} disabled={disabled}>
      {@render children?.()}
    </button>
  </div>
{/if}
```

Notes:
- Use `$props()` to read props and `...rest` to forward attributes.
- Use `child` snippet to delegate rendering (replacement for `asChild`).
- Provide appropriate ARIA attributes and manage focus/keyboard in the primitive logic.
