<!-- snippet component for root: titleBar -->
<script>
    let { children } = $props();
</script>

{#snippet titleBarIcon()}
    {@render children?.()}
{/snippet}