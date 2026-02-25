<!-- @component snippet component ToggleBarIcon — for ToggleBar -->
<script module lang="ts">
    export type ToggleBarIconProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<ToggleBarIconProps>();
</script>

{#snippet toggleBarIcon()}
    {@render children?.()}
{/snippet}
