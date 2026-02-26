<!-- @component snippet component for root: alert -->
<script module lang="ts">
export type AlertButtonCloseProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<AlertButtonCloseProps>();
</script>

{#snippet alertButtonClose()}
    {@render children?.()}
{/snippet}