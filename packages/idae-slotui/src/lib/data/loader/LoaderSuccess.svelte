<!-- @component snippet component LoaderSuccess — small renderable part for Loader -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet LoaderSuccess()}
	{@render children?.()}
{/snippet}
