<!-- @component snippet component LoaderLoading — small renderable part for Loader -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet LoaderLoading()}
	{@render children?.()}
{/snippet}
