<!-- @component snippet component ContentSwitcherIcon — for ToggleBar -->
<script module lang="ts">
    export type ContentSwitcherIconProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<ContentSwitcherIconProps>();
</script>

{#snippet contentSwitcherIcon()}
    {@render children?.()}
{/snippet}