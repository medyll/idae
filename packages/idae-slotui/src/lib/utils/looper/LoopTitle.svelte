<!-- @component snippet component LoopTitle — for Looper -->
<script module lang="ts">
    export type LoopTitleProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<LoopTitleProps>();
</script>

{#snippet loopTitle()}
    {@render children?.()}
{/snippet}
