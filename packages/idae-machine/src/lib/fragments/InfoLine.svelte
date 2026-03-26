<!--
InfoLine.svelte
Inline information line with optional input snippet and title button
@role data-display
@prop {string} [title] - Title text
@prop {boolean} [vertical] - Vertical layout
@snippet input - Input snippet displayed when provided
@snippet titleButton - Small button snippet displayed beside title
@snippet children - Content snippet
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let className = $state('');
  let {
    title,
    label,
    value,
    vertical = false,
    input,
    titleButton,
    children
  }: {
    title?: string;
    label?: string;
    value?: string | number | boolean | null;
    vertical?: boolean;
    input?: Snippet;
    titleButton?: Snippet;
    children?: Snippet;
  } = $props();
  export { className as class };
</script>

{#if label}
  <div class="w-full py-2 text-sm font-semibold">
    <div class="flex justify-between">
      <div>{label}</div>
      <div>{value}</div>
    </div>
  </div>
{:else if input && !title}
  <div class="w-full py-2 text-sm font-semibold">
    {title}
  </div>
{/if}
<div class="{vertical ? 'flex-v' : 'flex-align-middle'} gap-4 py-4">
  <div class="flex flex-1 text-sm">
    <div class="flex-1 font-semibold">
      {#if input}
        {@render input?.()}
      {:else}
        - {title}
      {/if}
    </div>
    {@render titleButton?.()}
  </div>
  <div class="{vertical ? 'px-2' : ''} {className}">
    {@render children?.()}
  </div>
</div>
