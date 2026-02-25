<!-- @component snippet component PanelButtonPrevious — small renderable part for Panel -->
<script module lang="ts">
	export type PanelButtonPreviousProps = any;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet PanelButtonPrevious()}
	{@render children?.()}
{/snippet}

