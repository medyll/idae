<script lang="ts">
// Svelte 5 - Radio (runes)
import { $props, $state } from 'svelte';

export interface RadioProps {
  checked?: boolean;
  value?: string | number;
  name?: string;
  disabled?: boolean;
  class?: string;
  style?: string;
}

const {
  checked = false,
  value = '',
  name = '',
  disabled = false,
  class: className = '',
  style = ''
} = $props<RadioProps>();
const [$checked, setChecked] = $state(checked);

function handleChange(e: Event) {
  setChecked((e.target as HTMLInputElement).checked);
}
</script>

<label class={`slotui-radio ${className}`} style={style}>
  <input type="radio" bind:checked={$checked} value={value} name={name} disabled={disabled} on:change={handleChange} />
  <span class="radio-mark"></span>
  <slot />
</label>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  input[type="radio"] { display: none; }
  .radio-mark {
    width: 1.1em;
    height: 1.1em;
    border-radius: 50%;
    border: 2px solid #888;
    margin-right: 0.5em;
    background: #fff;
    position: relative;
  }
  input[type="radio"]:checked + .radio-mark {
    border-color: var(--theme-primary, #1976d2);
    background: var(--theme-primary, #1976d2);
  }
  input[type="radio"]:checked + .radio-mark::after {
    content: '';
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    top: 0.25em;
    left: 0.25em;
  }
}
</style>
