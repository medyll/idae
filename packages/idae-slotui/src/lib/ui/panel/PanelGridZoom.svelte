<!-- @component snippet component PanelGridZoom — for Panel -->
<script module lang="ts">
    export type PanelGridZoomProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<PanelGridZoomProps>();
</script>

{#snippet panelGridZoom()}
    {@render children?.()}
{/snippet}