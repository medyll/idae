<!-- @component snippet component DataListFooter — small renderable part for DataList -->
<script module lang="ts">
export type DataListFooterProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DataListFooterProps>();
</script>

{#snippet DataListFooter()}
	{@render children?.()}
{/snippet}
