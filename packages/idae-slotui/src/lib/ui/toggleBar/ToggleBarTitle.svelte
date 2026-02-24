<!-- @component snippet component for root: toggleBar -->
<script>
    let { children } = $props();
</script>

{#snippet toggleBarTitle()}
    {@render children?.()}
{/snippet}