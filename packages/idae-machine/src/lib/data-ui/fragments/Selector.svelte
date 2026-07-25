<!--
Selector.svelte
Selection list that renders items via snippet prop
@role ui
@prop {unknown[]} [values] - Array of values to render
@prop {unknown} [value] - Current selected value
@prop {Snippet} item - Snippet for rendering an item (item, active)
@snippet selectorFallback - Fallback snippet when values empty
-->
<script module lang="ts">
  import type { Snippet } from 'svelte';

  export interface SelectorProps {
    values?: unknown[];
    value?: unknown;
    item?: Snippet<[unknown, boolean]>;
    selectorFallback?: Snippet;
  }
</script>

<script lang="ts">
  let {
    values = [],
    value,
    item,
    selectorFallback
  }: SelectorProps = $props();
</script>

{#each values as valueO ((valueO as Record<string, unknown>)?.id ?? valueO)}
  <div class={' ' + (valueO == value ? 'active ' : 'inactive')}>
    {@render item?.(valueO, valueO === value)}
  </div>
{/each}
{#if !values.length}
  {@render selectorFallback?.()}
{/if}

<style lang="postcss">
  @layer components {
    .active,
    .inactive {
      border: var(--border-width) solid transparent;
      border-bottom-width: calc(var(--border-width) * 2);
    }

    .active {
      border-color: var(--color-border-strong);
      background: var(--color-surface-alt);
    }

    .inactive {
      color: var(--color-text-muted);
    }
  }
</style>
