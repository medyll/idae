<!-- @component snippet component DrawerTop — for Columner -->
<script module lang="ts">
  export type DrawerTopProps = any;
</script>

<script lang="ts">
  const { children } = $props();
</script>

{#snippet drawerTop()}
  {@render children?.()}
{/snippet}

