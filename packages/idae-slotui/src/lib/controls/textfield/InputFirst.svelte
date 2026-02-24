<!-- @component snippet component InputFirst — small renderable part for TextField -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet InputFirst()}
	{@render children?.()}
{/snippet}
