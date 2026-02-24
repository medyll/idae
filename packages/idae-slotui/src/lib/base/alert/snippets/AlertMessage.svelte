<!-- snippet component for root: Alert -->
<script>
    let { children } = $props();
</script>

{#snippet alertMessage()}
    {@render children?.()}
{/snippet}