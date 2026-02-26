<!-- @component snippet component SlotRetrievePassword — small renderable part for Login -->
<script module lang="ts">
export type SlotRetrievePasswordProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<SlotRetrievePasswordProps>();
</script>

{#snippet SlotRetrievePassword()}
	{@render children?.()}
{/snippet}
