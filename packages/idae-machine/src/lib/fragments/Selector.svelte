<!--
Selector.svelte
Selection list that renders items via snippet prop
@role ui
@prop {any[]} [values] - Array of values to render
@prop {any} [value] - Current selected value
@prop {Snippet} item - Snippet for rendering an item (item, active)
@snippet selectorFallback - Fallback snippet when values empty
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    values = [],
    value,
    item,
    selectorFallback
  }: {
    values?: any[];
    value?: any;
    item?: Snippet<[any, boolean]>;
    selectorFallback?: Snippet;
  } = $props();
</script>

{#each values as valueO (valueO?.id ?? valueO)}
  <div class={' ' + (valueO == value ? 'active ' : 'inactive')}>
    {@render item?.(valueO, valueO === value)}
  </div>
{/each}
{#if !values.length}
  {@render selectorFallback?.()}
{/if}

<style lang="postcss">
  @reference "../../styles/references.css";
  .active {
    @apply border border-b-2 border-neutral-500; /* active */
  }
  .inactive {
    @apply border border-b-2 border-transparent opacity-60; /* inactive */
  }
  /* @apply  border border-b-2 border-neutral-500; 
  @apply  opacity-60 border border-b-2 border-transparent;   */
</style>
