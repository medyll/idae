<!-- @component snippet component LoaderEmpty — small renderable part for Loader -->
<script module lang="ts">
export type LoaderEmptyProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoaderEmptyProps>();
</script>

{#snippet LoaderEmpty()}
	{@render children?.()}
{/snippet}
