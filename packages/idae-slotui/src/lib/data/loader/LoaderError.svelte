<!-- @component snippet component LoaderError — small renderable part for Loader -->
<script module lang="ts">
export type LoaderErrorProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoaderErrorProps>();
</script>

{#snippet LoaderError()}
	{@render children?.()}
{/snippet}
