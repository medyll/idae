<!-- @component snippet component for root: toggleBar -->
<script module lang="ts">
    export type ToggleBarTitleProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet toggleBarTitle()}
    {@render children?.()}
{/snippet}
