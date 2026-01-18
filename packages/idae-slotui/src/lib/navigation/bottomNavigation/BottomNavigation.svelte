<script lang="ts">
// Svelte 5 - BottomNavigation (runes)
import { $props, $state } from 'svelte';

export interface BottomNavigationProps {
  value?: any;
  class?: string;
  style?: string;
}

const {
  value = null,
  class: className = '',
  style = ''
} = $props<BottomNavigationProps>();
const [$selected, setSelected] = $state(value);

function handleChange(val: any) {
  setSelected(val);
}
</script>

<nav class={`slotui-bottomnav ${className}`} style={style}>
  <slot {handleChange} selected={$selected} />
</nav>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-bottomnav {
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.12);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: var(--theme-bg, #fff);
}
</style>
