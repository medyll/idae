<!-- @component snippet component for root: window -->
<script module lang="ts">
    export type WindowIconProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet windowIcon()}
    {@render children?.()}
{/snippet}
