<!-- snippet component for root: window -->

<script>
    let { children } = $props();
</script>

{#snippet windowIcon()}
    {@render children?.()}
{/snippet}