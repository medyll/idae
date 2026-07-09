<!--
Frame.svelte
Layout frame with optional left navigation panel
@role layout
@prop {boolean} [showPanel] - Show left panel (default true)
@prop {'expanded'|'reduced'} [panelMode] - Panel display mode
@snippet leftNav - Left navigation snippet
@snippet children - Main content snippet
-->
<script module lang="ts">
  import type { Snippet } from 'svelte';

  export interface FrameProps {
    showPanel?: boolean;
    panelMode?: 'expanded' | 'reduced';
    leftNav?: Snippet;
    children?: Snippet;
  }
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';

  let {
    showPanel = true,
    panelMode = 'expanded',
    leftNav,
    children
  }: FrameProps = $props();
</script>

<div class="relative flex h-full gap-4">
  {#if showPanel}
    <div transition:slide={{ axis: 'x' }} class="paper h-64 w-64 overflow-auto overflow-x-hidden">
      {@render leftNav?.()}
    </div>
  {/if}
  <div class="flex-1">
    <div class="flex h-full w-96 flex-col gap-1">
      {@render children?.()}
    </div>
  </div>
</div>
