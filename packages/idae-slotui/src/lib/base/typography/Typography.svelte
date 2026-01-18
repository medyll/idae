<script lang="ts">
// Svelte 5 - Typography (runes)
import { $props, $derived } from 'svelte';

export interface TypographyProps {
  variant?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'subtitle1'|'subtitle2'|'body1'|'body2'|'caption'|'overline';
  color?: string;
  align?: 'left'|'center'|'right'|'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;
  class?: string;
  style?: string;
}

const {
  variant = 'body1',
  color = 'inherit',
  align = 'left',
  gutterBottom = false,
  noWrap = false,
  class: className = '',
  style = ''
} = $props<TypographyProps>();

const tag = $derived(() =>
  variant.startsWith('h') ? variant :
  variant === 'subtitle1' ? 'h6' :
  variant === 'subtitle2' ? 'h6' :
  'span'
);
</script>

<svelte:element this={tag}
  class={`slotui-typography typography-${variant} theme-text-${color} ${align} ${gutterBottom ? 'gutter-bottom' : ''} ${noWrap ? 'no-wrap' : ''} ${className}`}
  style={style}>
  <slot />
</svelte:element>

<style global lang="scss">
@use '../../styles/main.css';
.slotui-typography {
  margin: 0;
  &.gutter-bottom { margin-bottom: 0.35em; }
  &.no-wrap { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &.center { text-align: center; }
  &.right { text-align: right; }
  &.left { text-align: left; }
  &.justify { text-align: justify; }
}
</style>
