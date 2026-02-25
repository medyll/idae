<!-- @component snippet component for root: window -->
<script module lang="ts">
    export type WindowButtonZoneProps = any;
</script>

<script lang="ts">
    const { children } = $props();
</script>

{#snippet windowButtonZone()}
    {@render children?.()}
{/snippet}
