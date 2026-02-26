<!-- @component snippet component for root: titleBar -->
<script module lang="ts">
// Module-level Props marker for migration tooling
export type TitleBarIconProps = Record<string, unknown>;
</script>

<script>
    let { children } = $props();
</script>

{#snippet titleBarIcon()}
    {@render children?.()}
{/snippet}