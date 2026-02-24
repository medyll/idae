<!-- @component snippet component DrawerFooter — small renderable part for Drawer -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet DrawerFooter()}
	{@render children?.()}
{/snippet}
