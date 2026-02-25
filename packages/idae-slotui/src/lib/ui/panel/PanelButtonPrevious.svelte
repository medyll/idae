<!-- @component snippet component PanelButtonPrevious — for Panel -->
<script module lang="ts">
	export type PanelButtonPreviousProps = Record<string, any>;
</script>

<script lang="ts">
	const { children } = $props<PanelButtonPreviousProps>();
</script>

{#snippet PanelButtonPrevious()}
	{@render children?.()}
{/snippet}

