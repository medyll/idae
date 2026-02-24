<!-- @component snippet component for root: marquee -->
<script>
    let { children } = $props();
</script>

{#snippet children()}
    {@render children?.()}
{/snippet}