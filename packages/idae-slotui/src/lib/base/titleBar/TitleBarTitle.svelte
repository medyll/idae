<!-- snippet component for root: titleBar -->
<script>
    let { children } = $props();
</script>

{#snippet titleBarTitle()}
    {@render children?.()}
{/snippet}