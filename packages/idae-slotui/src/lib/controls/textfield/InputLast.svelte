<!-- @component snippet component InputLast — small renderable part for TextField -->
<script module lang="ts">
export type InputLastProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<InputLastProps>();
</script>

{#snippet InputLast()}
	{@render children?.()}
{/snippet}
