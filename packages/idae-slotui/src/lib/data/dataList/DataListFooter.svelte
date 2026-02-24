<!-- @component snippet component DataListFooter — small renderable part for DataList -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet DataListFooter()}
	{@render children?.()}
{/snippet}
