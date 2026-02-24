<!-- @component snippet component for root: toggleBar -->

<script>
    let { children } = $props();
</script>

{#snippet contentSwitcherReveal()}
    {@render children?.()}
{/snippet}