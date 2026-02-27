<script lang="ts">
  // Example headless Button primitive following Bits UI / shadcn-svelte patterns
  const { id, disabled = false, child, children, ...rest } = $props();

  let pressed = $state(false);

  export type ButtonProps = {
    id?: string;
    disabled?: boolean;
    children?: Snippet;
  };

  function toggle() {
    pressed.set(!pressed.get());
  }
</script>

{#if child}
  {@render child({ props: { id, disabled, pressed: pressed.get(), ...rest } })}
{:else}
  <button
    {...rest}
    id={id}
    disabled={disabled}
    aria-pressed={pressed.get()}
    on:click={toggle}
  >
    {@render children?.()}
  </button>
{/if}

<style global lang="scss">
  /* styling is intentionally omitted: registry components are copied into consumer projects for customization */
</style>
