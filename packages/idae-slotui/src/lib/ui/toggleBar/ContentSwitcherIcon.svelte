<!-- snippet component for root: toggleBar -->

<script>
    let { children } = $props();
</script>

{#snippet contentSwitcherIcon()}
    {@render children?.()}
{/snippet}