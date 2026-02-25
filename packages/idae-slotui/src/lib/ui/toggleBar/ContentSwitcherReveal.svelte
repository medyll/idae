<!-- @component snippet component for root: toggleBar -->
<script module lang="ts">
    export type ContentSwitcherRevealProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet contentSwitcherReveal()}
    {@render children?.()}
{/snippet}