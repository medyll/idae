<!-- @component snippet component for root: alert -->
<script>
    let { children } = $props();
</script>

{#snippet alertTopButton()}
    {@render children?.()}
{/snippet}