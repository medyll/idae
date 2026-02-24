<!-- @component snippet component GroupTitleSlot — small renderable part for DataList -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet GroupTitleSlot()}
	{@render children?.()}
{/snippet}
