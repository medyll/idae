<!-- @component snippet component for root: toolbar -->
<script module lang="ts">
    export type ToolbarSeparatorProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet toolbarSeparator()}
    {@render children?.()}
{/snippet}
