<!-- @component snippet component LoaderEmpty — small renderable part for Loader -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet LoaderEmpty()}
	{@render children?.()}
{/snippet}
