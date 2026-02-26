<!-- @component snippet component for root: alert -->
<script module lang="ts">
export type AlertTopButtonProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<AlertTopButtonProps>();
</script>

{#snippet alertTopButton()}
    {@render children?.()}
{/snippet}