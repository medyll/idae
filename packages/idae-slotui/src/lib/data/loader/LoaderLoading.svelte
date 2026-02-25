<!-- @component snippet component LoaderLoading — small renderable part for Loader -->
<script module lang="ts">
export type LoaderLoadingProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoaderLoadingProps>();
</script>

{#snippet LoaderLoading()}
	{@render children?.()}
{/snippet}
