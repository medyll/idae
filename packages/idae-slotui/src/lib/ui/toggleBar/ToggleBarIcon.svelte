<!-- @component snippet component for root: toggleBar -->
<script module lang="ts">
    export type ToggleBarIconProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet toggleBarIcon()}
    {@render children?.()}
{/snippet}
