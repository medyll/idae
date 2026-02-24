<!-- @component snippet component MenuItem — small renderable part for ButtonMenu -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet MenuItem()}
	{@render children?.()}
{/snippet}
