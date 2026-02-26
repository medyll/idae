<!-- @component snippet component for root: titleBar -->
<script module lang="ts">
// Module-level Props marker for migration tooling
export type TitleBarTitleProps = Record<string, unknown>;
</script>

<script>
    let { children } = $props();
</script>

{#snippet titleBarTitle()}
    {@render children?.()}
{/snippet}