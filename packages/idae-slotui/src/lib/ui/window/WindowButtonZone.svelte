<!-- snippet component for root: window -->
<script>
    let { children } = $props();
</script>

{#snippet windowButtonZone()}
    {@render children?.()}
{/snippet}