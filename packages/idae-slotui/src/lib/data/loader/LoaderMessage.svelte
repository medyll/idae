<!-- @component snippet component LoaderMessage — small renderable part for Loader -->
<script module lang="ts">
export type LoaderMessageProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoaderMessageProps>();
</script>

{#snippet LoaderMessage()}
	{@render children?.()}
{/snippet}
