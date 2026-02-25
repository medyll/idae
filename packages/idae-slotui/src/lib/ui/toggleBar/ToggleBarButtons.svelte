<!-- @component snippet component ToggleBarButtons — for ToggleBar -->
<script module lang="ts">
    export type ToggleBarButtonsProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<ToggleBarButtonsProps>();
</script>

{#snippet toggleBarButtons()}
    {@render children?.()}
{/snippet}
