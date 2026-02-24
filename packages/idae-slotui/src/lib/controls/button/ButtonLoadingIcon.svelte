<!-- @component snippet component ButtonLoadingIcon for root: Button --> 
<script lang="ts">
  let { children, ...restProps }: { children?: any; [key: string]: any } = $props();
</script>

{#snippet buttonLoadingIcon()}
  {@render children?.()}
{/snippet}
