<script lang="ts">
  import type { ExpandProps } from "$lib/types/index.js";
  import Slotted from "$lib/utils/slotted/Slotted.svelte";
  import type { BreadCrumbProps } from "./types.js";

  let {
    class: className,
    element,
    children,
    style,
    breadList = [],
  }: ExpandProps<BreadCrumbProps> = $props();
</script>

<nav bind:this={element} class={className ?? ""} {style}>
  <ul class="flex">
    <li>
      <Slotted child={children} />
    </li>
  </ul>
</nav>
