<!-- @component snippet component for root: toolbar -->
<script>
    let { children } = $props();
</script>

{#snippet toolbarSeparator()}
    {@render children?.()}
{/snippet}