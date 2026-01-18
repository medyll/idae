<script module lang="ts">
  import type { CommonProps } from '$lib/types/index.js';
  import type { Snippet } from 'svelte';

  interface BreadListType {
    action?: () => void;
    breads?: BreadListItemType[];
  }

  interface BreadListItemType<D = Record<string, any>> {
    text: string;
    icon: string;
    link?: string;
    data?: D;
    children: Snippet;
  }

  export interface BreadCrumbProps extends CommonProps {
    class?: string;
    style?: string;
    breadList: BreadListType[];
    element: HTMLElement;
  }
</script>

<script lang="ts">
  import type { ExpandProps } from "$lib/types/index.js";
  import Slotted from "$lib/utils/slotted/Slotted.svelte";

  let {
    class: className,
    element,
    children,
    style,
    breadList = [],
  }: ExpandProps<import('./BreadCrumb.svelte').BreadCrumbProps> = $props();
</script>

<nav bind:this={element} class={className ?? ""} {style}>
  <ul class="flex">
    <li>
      <Slotted child={children} />
    </li>
  </ul>
</nav>
