<script lang="ts">
// Svelte 5 - Tooltip (runes)
import { $props, $state } from 'svelte';

export interface TooltipProps {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  openDelay?: number;
  closeDelay?: number;
  class?: string;
  style?: string;
}

const {
  text = '',
  position = 'top',
  openDelay = 200,
  closeDelay = 100,
  class: className = '',
  style = ''
} = $props<TooltipProps>();
const [$open, setOpen] = $state(false);
let timeout: any;

function show() {
  clearTimeout(timeout);
  timeout = setTimeout(() => setOpen(true), openDelay);
}
function hide() {
  clearTimeout(timeout);
  timeout = setTimeout(() => setOpen(false), closeDelay);
}
</script>

<span class={`slotui-tooltip-wrapper ${className}`}
      style={style}
      on:mouseenter={show}
      on:mouseleave={hide}
      on:focus={show}
      on:blur={hide}>
  <slot />
  {#if $open}
    <span class={`slotui-tooltip tooltip-${position}`}>{text}</span>
  {/if}
</span>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-tooltip-wrapper { position: relative; display: inline-block; }
.slotui-tooltip {
  position: absolute;
  background: #222;
  color: #fff;
  border-radius: 4px;
  padding: 0.25em 0.5em;
  font-size: 0.85em;
  white-space: nowrap;
  z-index: 2000;
  opacity: 0.95;
  pointer-events: none;
  &.tooltip-top { bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-0.5em); }
  &.tooltip-bottom { top: 100%; left: 50%; transform: translateX(-50%) translateY(0.5em); }
  &.tooltip-left { right: 100%; top: 50%; transform: translateY(-50%) translateX(-0.5em); }
  &.tooltip-right { left: 100%; top: 50%; transform: translateY(-50%) translateX(0.5em); }
}
</style>
