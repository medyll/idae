<!-- @component snippet component LoaderError — small renderable part for Loader -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet LoaderError()}
	{@render children?.()}
{/snippet}
