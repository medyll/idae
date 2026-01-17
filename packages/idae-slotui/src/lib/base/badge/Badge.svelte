<script lang="ts">
  import Slotted from "$lib/utils/slotted/Slotted.svelte";
  import type { BadgeProps } from "./types.js";

  let {
    value,
    ceiling,
    element,
    position = { x: "right", y: "top" },
    children,
  }: BadgeProps = $props();

  const xM = {
    left: "left:0",
    right: "right:0",
    center: "left:50%;transformation:translate(-50%,0)",
  };
  const yM = {
    top: "top:0",
    bottom: "bottom:0",
    center: "top:50%;transformation:translate(0,-50%)",
  };
</script>

{#if value > ceiling}
  <div
    bind:this={element}
    class="badge absolute rounded-full border border-[var(--badge-color-border)] grid place-items-center w-4 h-4"
    style="{xM[position.x]};{yM[position.y]}"
  >
    <Slotted child={children}>{value}</Slotted>
  </div>
{/if}
