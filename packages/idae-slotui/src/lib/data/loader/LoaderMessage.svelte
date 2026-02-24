<!-- @component snippet component LoaderMessage — small renderable part for Loader -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet LoaderMessage()}
	{@render children?.()}
{/snippet}
