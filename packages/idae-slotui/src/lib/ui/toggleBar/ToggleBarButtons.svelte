<!-- @component snippet component for root: toggleBar -->
<script   lang="ts"> 
    let { children } = $props();
</script>

{#snippet toggleBarButtons()}
    {@render children?.()}
{/snippet}