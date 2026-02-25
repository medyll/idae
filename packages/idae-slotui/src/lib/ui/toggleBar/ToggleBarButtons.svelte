<!-- @component snippet component for root: toggleBar -->
<script   lang="ts"> 
    let { children } = $props();
</script>

{#snippet toggleBarButtons()}
    {@render children?.()}
{/snippet}
<script module lang="ts">
    export type ToggleBarButtonsProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>
