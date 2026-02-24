<!-- @component snippet component for root: Alert -->
<script>
    let { children } = $props();
</script>

{#snippet alertTopButton()}
    {@render children?.()}
{/snippet}