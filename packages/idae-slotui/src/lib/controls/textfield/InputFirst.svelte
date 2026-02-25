<!-- @component snippet component InputFirst — small renderable part for TextField -->
<script module lang="ts">
export type InputFirstProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<InputFirstProps>();
</script>

{#snippet InputFirst()}
	{@render children?.()}
{/snippet}
