<script lang="ts">
// Svelte 5 - Fab (Floating Action Button)
import { $props } from 'svelte';
import Icon from '$lib/base/icon/Icon.svelte';

export interface FabProps {
  icon?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  class?: string;
  style?: string;
  ariaLabel?: string;
}

const {
  icon = '',
  color = 'primary',
  size = 'medium',
  class: className = '',
  style = '',
  ariaLabel = 'Action'
} = $props<FabProps>();
</script>

<button class={`slotui-fab fab-${size} theme-bg-${color} ${className}`}
        style={style}
        aria-label={ariaLabel}>
  <slot>
    {#if icon}
      <Icon icon={icon} fontSize={size} />
    {/if}
  </slot>
</button>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-fab {
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  cursor: pointer;
  border: none;
  &.fab-small { width: 40px; height: 40px; }
  &.fab-medium { width: 56px; height: 56px; }
  &.fab-large { width: 72px; height: 72px; }
}
</style>
