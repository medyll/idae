<!-- @component snippet component ToggleBarTitle — for ToggleBar -->
<script module lang="ts">
    export type ToggleBarTitleProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<ToggleBarTitleProps>();
</script>

{#snippet toggleBarTitle()}
    {@render children?.()}
{/snippet}
