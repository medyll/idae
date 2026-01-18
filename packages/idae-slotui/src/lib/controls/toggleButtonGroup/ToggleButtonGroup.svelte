<script lang="ts">
// Svelte 5 - ToggleButtonGroup (runes)
import { $props, $state } from 'svelte';

export interface ToggleButtonGroupProps {
  value?: any;
  exclusive?: boolean;
  orientation?: 'horizontal' | 'vertical';
  class?: string;
  style?: string;
}

const {
  value = null,
  exclusive = false,
  orientation = 'horizontal',
  class: className = '',
  style = ''
} = $props<ToggleButtonGroupProps>();
const [$selected, setSelected] = $state(value);

function handleToggle(val: any) {
  if (exclusive) {
    setSelected(val === $selected ? null : val);
  } else {
    setSelected(Array.isArray($selected) ?
      ($selected.includes(val) ? $selected.filter((v: any) => v !== val) : [...$selected, val]) : [val]);
  }
}
</script>

<div class={`slotui-togglebuttongroup flex${orientation === 'vertical' ? '-col' : '-row'} ${className}`}
     style={style}>
  <slot {handleToggle} selected={$selected} />
</div>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-togglebuttongroup {
  display: flex;
  gap: 0.25rem;
  &.flex-col { flex-direction: column; }
  &.flex-row { flex-direction: row; }
}
</style>
