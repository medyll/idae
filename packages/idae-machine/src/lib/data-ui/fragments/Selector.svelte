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

<style>
  .active {
    border: 1px solid;
    border-bottom-width: 2px;
    border-color: #737373;
  }
  .inactive {
    border: 1px solid transparent;
    border-bottom-width: 2px;
    opacity: 0.6;
  }
</style>
