<script lang="ts">
// Svelte 5 - Collapse (runes)
import { $props, $state } from 'svelte';

export interface CollapseProps {
  open?: boolean;
  class?: string;
  style?: string;
}

const {
  open = false,
  class: className = '',
  style = ''
} = $props<CollapseProps>();
const [$open, setOpen] = $state(open);
</script>

<div class={`slotui-collapse ${$open ? 'open' : ''} ${className}`} style={style}>
  {#if $open}
    <slot />
  {/if}
</div>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-collapse {
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
  &.open { max-height: 1000px; }
  &:not(.open) { max-height: 0; }
}
</style>
