<!-- @component snippet component PreviewZoom — for Preview -->
<script module lang="ts">
	export type PreviewZoomProps = Record<string, any>;
</script>

<script lang="ts">
	const { children } = $props<PreviewZoomProps>();
</script>

{#snippet PreviewZoom()}
	{@render children?.()}
{/snippet}
