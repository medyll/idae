<!-- @component snippet component ContentSwitcherReveal — for ToggleBar -->
<script module lang="ts">
    export type ContentSwitcherRevealProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<ContentSwitcherRevealProps>();
</script>

{#snippet contentSwitcherReveal()}
    {@render children?.()}
{/snippet}