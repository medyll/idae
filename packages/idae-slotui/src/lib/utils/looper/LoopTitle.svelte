<!-- @component snippet component LoopTitle — for Looper -->
<script module lang="ts">
    export type LoopTitleProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet loopTitle()}
    {@render children?.()}
{/snippet}
