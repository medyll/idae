<!-- @component snippet component for root: alert -->
<script module lang="ts">
export type AlertMessageProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<AlertMessageProps>();
</script>

{#snippet alertMessage()}
    {@render children?.()}
{/snippet}