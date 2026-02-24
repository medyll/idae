<!-- @component snippet component for root: Alert -->
<script>
    let { children } = $props();
</script>

{#snippet alertButtonClose()}
    {@render children?.()}
{/snippet}