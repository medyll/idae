<!-- snippet component for root: alert -->
<script>
    let { children } = $props();
</script>

{#snippet alertMessage()}
    {@render children?.()}
{/snippet}