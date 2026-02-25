<!-- @component snippet component GroupTitleSlot — small renderable part for DataList -->
<script module lang="ts">
export type GroupTitleSlotProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<GroupTitleSlotProps>();
</script>

{#snippet GroupTitleSlot()}
	{@render children?.()}
{/snippet}
