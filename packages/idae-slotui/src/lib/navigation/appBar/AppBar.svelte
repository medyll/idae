<script lang="ts">
// Svelte 5 - AppBar (runes)
import { $props } from 'svelte';

export interface AppBarProps {
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  color?: 'primary' | 'secondary' | 'default' | 'transparent';
  class?: string;
  style?: string;
}

const {
  position = 'fixed',
  color = 'primary',
  class: className = '',
  style = ''
} = $props<AppBarProps>();
</script>

<header class={`slotui-appbar theme-bg-${color} ${className}`}
        style={style} data-position={position}>
  <slot />
</header>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-appbar {
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  z-index: 1000;
}
</style>
