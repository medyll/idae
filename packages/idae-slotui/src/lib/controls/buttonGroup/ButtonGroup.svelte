<script lang="ts">
// Svelte 5 - ButtonGroup (runes)
import { $props } from 'svelte';

export interface ButtonGroupProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  class?: string;
  style?: string;
}

const {
  orientation = 'horizontal',
  variant = 'text',
  size = 'medium',
  class: className = '',
  style = ''
} = $props<ButtonGroupProps>();
</script>

<div class={`slotui-buttongroup flex${orientation === 'vertical' ? '-col' : '-row'} ${className}`}
     data-variant={variant} data-size={size} style={style}>
  <slot />
</div>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-buttongroup {
  display: flex;
  gap: 0.25rem;
  &.flex-col { flex-direction: column; }
  &.flex-row { flex-direction: row; }
}
</style>
