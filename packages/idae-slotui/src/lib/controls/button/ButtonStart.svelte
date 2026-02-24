<!-- @component snippet component ButtonStart for root: Button -->
<script lang="ts">
  let { children, ...restProps }: { children?: any; [key: string]: any } = $props();
</script>

{#snippet buttonStart()}
  {@render children?.()}
{/snippet}
