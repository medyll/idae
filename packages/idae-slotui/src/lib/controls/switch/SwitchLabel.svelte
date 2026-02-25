<!-- @component snippet component SwitchLabel — small renderable part for Switch -->
<script module lang="ts">
export type SwitchLabelProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<SwitchLabelProps>();
</script>

{#snippet SwitchLabel()}
	{@render children?.()}
{/snippet}
