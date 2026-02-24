<!-- snippet component for root: looper -->
<script>
    let { children } = $props();
</script>

{#snippet loopTitle()}
    {@render children?.()}
{/snippet}