<script lang="ts">
// Svelte 5 - Fade (runes)
import { $props, $state } from 'svelte';

export interface FadeProps {
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
} = $props<FadeProps>();
const [$visible, setVisible] = $state(show);
</script>

{#if $visible}
  <div class={`slotui-fade ${className}`}
       style={`transition:opacity ${duration}ms;opacity:${$visible ? 1 : 0};${style}`}>
    <slot />
  </div>
{/if}

<style global lang="scss">
@use '../../styles/main.css';
.slotui-fade {
  opacity: 1;
  transition: opacity 0.2s;
}
</style>
