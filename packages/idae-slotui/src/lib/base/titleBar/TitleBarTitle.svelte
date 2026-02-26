<!-- @component snippet component for root: titleBar -->
<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<script>
    let { children } = $props();
</script>

{#snippet titleBarTitle()}
    {@render children?.()}
{/snippet}