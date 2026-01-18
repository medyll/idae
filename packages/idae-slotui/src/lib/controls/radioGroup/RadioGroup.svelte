<script lang="ts">
// Svelte 5 - RadioGroup (runes)
import { $props, $state } from 'svelte';

export interface RadioGroupProps {
  value?: string | number;
  name?: string;
  disabled?: boolean;
  class?: string;
  style?: string;
}

const {
  value = '',
  name = '',
  disabled = false,
  class: className = '',
  style = ''
} = $props<RadioGroupProps>();
const [$selected, setSelected] = $state(value);

function handleChange(val: string | number) {
  setSelected(val);
}
</script>

<div class={`slotui-radiogroup ${className}`} style={style}>
  <slot {handleChange} selected={$selected} name={name} disabled={disabled} />
</div>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-radiogroup {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
