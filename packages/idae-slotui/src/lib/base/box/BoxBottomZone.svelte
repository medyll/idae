<!-- @component snippet component BoxBottomZone — for Box -->
<script module lang="ts">
  export type BoxBottomZoneProps = any;
</script>

<script lang="ts">
  const { children } = $props();
</script>

{#snippet boxBottomZone()}
  {@render children?.()}
{/snippet}

