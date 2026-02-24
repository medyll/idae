<!-- @component snippet component for root: looper -->

<script>
    let { children } = $props();
</script>

{#snippet loopGroupTitle()}
    {@render children?.()}
{/snippet}