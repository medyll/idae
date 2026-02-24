<!-- snippet component for root: alert -->
<script>
    let { children } = $props();
</script>

{#snippet alertButtonZone()}
    {@render children?.()}
{/snippet}