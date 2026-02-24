<!-- @component snippet component PopperContent — small renderable part for ButtonAction -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet PopperContent()}
	{@render children?.()}
{/snippet}
