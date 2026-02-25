<!-- @component snippet component LoopGroupTitle — for Looper -->
<script module lang="ts">
    export type LoopGroupTitleProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<LoopGroupTitleProps>();
</script>

{#snippet loopGroupTitle()}
    {@render children?.()}
{/snippet}
