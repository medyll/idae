<!-- @component snippet component LoaderSuccess — small renderable part for Loader -->
<script module lang="ts">
export type LoaderSuccessProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoaderSuccessProps>();
</script>

{#snippet LoaderSuccess()}
	{@render children?.()}
{/snippet}
