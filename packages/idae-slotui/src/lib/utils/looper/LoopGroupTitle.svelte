<!-- @component snippet component for root: looper -->
<script module lang="ts">
    export type LoopGroupTitleProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet loopGroupTitle()}
    {@render children?.()}
{/snippet}
