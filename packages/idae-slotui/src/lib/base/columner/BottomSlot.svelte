<!-- @component snippet component BottomSlot — for Columner -->
<script module lang="ts">
  export type BottomSlotProps = any;
</script>

<script lang="ts">
  const { children } = $props();
</script>

{#snippet bottomSlot()}
  {@render children?.()}
{/snippet}

