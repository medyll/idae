<script lang="ts">
// Svelte 5 - Zoom (runes)
import { $props, $state } from 'svelte';

export interface ZoomProps {
  in?: boolean;
  duration?: number;
  class?: string;
  style?: string;
}

const {
  in: show = false,
  duration = 200,
  class: className = '',
  style = ''
} = $props<ZoomProps>();
const [$visible, setVisible] = $state(show);
</script>

{#if $visible}
  <div class={`slotui-zoom ${className}`}
       style={`transition:transform ${duration}ms,opacity ${duration}ms;transform:scale(${$visible ? 1 : 0});opacity:${$visible ? 1 : 0};${style}`}>
    <slot />
  </div>
{/if}

<style global lang="scss">
@use '../../styles/main.css';
.slotui-zoom {
  opacity: 1;
  transform: scale(1);
  transition: transform 0.2s, opacity 0.2s;
}
</style>
