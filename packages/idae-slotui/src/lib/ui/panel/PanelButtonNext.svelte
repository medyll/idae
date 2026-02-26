<!-- @component snippet component PanelButtonNext — for Panel -->
<script module lang="ts">
	export type PanelButtonNextProps = Record<string, any>;
</script>

<script lang="ts">
	const { children } = $props<PanelButtonNextProps>();
</script>

{#snippet PanelButtonNext()}
	{@render children?.()}
{/snippet}


