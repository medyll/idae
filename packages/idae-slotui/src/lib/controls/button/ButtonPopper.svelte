<!-- @component snippet component ButtonPopper for root: Button -->
<script lang="ts">
  let { children, ...restProps }: { children?: any; [key: string]: any } = $props();
</script>

{#snippet buttonPopper()}
  {@render children?.()}
{/snippet}
