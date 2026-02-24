<!-- snippet component for root: alert -->
<script>
    let { children } = $props();
</script>

{#snippet alertButtonClose()}
    {@render children?.()}
{/snippet}