<!-- @component snippet component ButtonEnd for root: Button -->
<script lang="ts">
  let { children, ...restProps }: { children?: any; [key: string]: any } = $props();
</script>

{#snippet buttonEnd()}
  {@render children?.()}
{/snippet}
