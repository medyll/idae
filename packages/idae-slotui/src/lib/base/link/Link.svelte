<script lang="ts">
// Svelte 5 - Link (runes)
import { $props } from 'svelte';

export interface LinkProps {
  href?: string;
  target?: string;
  rel?: string;
  underline?: 'none' | 'hover' | 'always';
  color?: string;
  class?: string;
  style?: string;
}

const {
  href = '#',
  target = '_self',
  rel = '',
  underline = 'hover',
  color = 'primary',
  class: className = '',
  style = ''
} = $props<LinkProps>();
</script>

<a href={href} target={target} rel={rel}
   class={`slotui-link link-${underline} theme-text-${color} ${className}`}
   style={style}>
  <slot />
</a>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-link {
  cursor: pointer;
  text-decoration: none;
  &.link-hover:hover { text-decoration: underline; }
  &.link-always { text-decoration: underline; }
  &.link-none { text-decoration: none; }
}
</style>
