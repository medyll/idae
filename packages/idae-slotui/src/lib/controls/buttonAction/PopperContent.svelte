<!-- @component snippet component PopperContent — small renderable part for ButtonAction -->
<script module lang="ts">
export type PopperContentProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<PopperContentProps>();
</script>

{#snippet PopperContent()}
	{@render children?.()}
{/snippet}
