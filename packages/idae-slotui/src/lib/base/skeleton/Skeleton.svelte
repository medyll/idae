<script lang="ts">
// Svelte 5 - Skeleton (runes)
import { $props } from 'svelte';

export interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'rect' | 'circle';
  class?: string;
  style?: string;
}

const {
  width = '100%',
  height = '1em',
  variant = 'text',
  class: className = '',
  style = ''
} = $props<SkeletonProps>();
</script>

<div class={`slotui-skeleton skeleton-${variant} ${className}`}
     style={`width:${width};height:${height};${style}`} />

<style global lang="scss">
@use '../../styles/main.css';
.slotui-skeleton {
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s infinite linear;
  border-radius: 4px;
  &.skeleton-circle { border-radius: 50%; }
  &.skeleton-rect { border-radius: 4px; }
  &.skeleton-text { border-radius: 2px; height: 1em; }
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
