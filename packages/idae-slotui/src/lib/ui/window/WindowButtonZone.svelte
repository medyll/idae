<!-- @component snippet component WindowButtonZone — for Window -->
<script module lang="ts">
    export type WindowButtonZoneProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<WindowButtonZoneProps>();
</script>

{#snippet windowButtonZone()}
    {@render children?.()}
{/snippet}
