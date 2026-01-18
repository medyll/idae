<script lang="ts">
// Svelte 5 - Accordion (runes)
import { $props, $state } from 'svelte';

export interface AccordionProps {
  expanded?: boolean;
  disabled?: boolean;
  class?: string;
  style?: string;
}

const {
  expanded = false,
  disabled = false,
  class: className = '',
  style = ''
} = $props<AccordionProps>();
const [$open, setOpen] = $state(expanded);

function toggle() {
  if (!disabled) setOpen(!$open);
}
</script>

<div class={`slotui-accordion ${$open ? 'expanded' : ''} ${disabled ? 'disabled' : ''} ${className}`}
     style={style}>
  <div class="accordion-summary" on:click={toggle}>
    <slot name="summary" />
  </div>
  {#if $open}
    <div class="accordion-details">
      <slot />
    </div>
  {/if}
</div>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-accordion {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5em;
  background: #fff;
  &.expanded { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  &.disabled { opacity: 0.5; pointer-events: none; }
}
.accordion-summary {
  padding: 0.75em 1em;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
}
.accordion-details {
  padding: 1em;
  border-top: 1px solid #eee;
}
</style>
