<!-- @component snippet component for root: alert -->
<script module lang="ts">
export type AlertButtonZoneProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<AlertButtonZoneProps>();
</script>

{#snippet alertButtonZone()}
    {@render children?.()}
{/snippet}