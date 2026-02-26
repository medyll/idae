<!-- @component snippet component ToolbarSeparator — for ToolBar -->
<script module lang="ts">
    export type ToolbarSeparatorProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<ToolbarSeparatorProps>();
</script>

{#snippet toolbarSeparator()}
    {@render children?.()}
{/snippet}
