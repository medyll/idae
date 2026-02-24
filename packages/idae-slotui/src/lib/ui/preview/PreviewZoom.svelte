<!-- @component snippet component PreviewZoom — small renderable part for Preview -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet PreviewZoom()}
	{@render children?.()}
{/snippet}
