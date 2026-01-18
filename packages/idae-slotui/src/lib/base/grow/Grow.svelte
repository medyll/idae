<script lang="ts">
// Svelte 5 - Grow (runes)
import { $props, $state } from 'svelte';

export interface GrowProps {
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
} = $props<GrowProps>();
const [$visible, setVisible] = $state(show);
</script>

{#if $visible}
  <div class={`slotui-grow ${className}`}
       style={`transition:transform ${duration}ms,opacity ${duration}ms;transform:scale(${$visible ? 1 : 0.8});opacity:${$visible ? 1 : 0};${style}`}>
    <slot />
  </div>
{/if}

<style global lang="scss">
@use '../../styles/main.css';
.slotui-grow {
  opacity: 1;
  transform: scale(1);
  transition: transform 0.2s, opacity 0.2s;
}
</style>
