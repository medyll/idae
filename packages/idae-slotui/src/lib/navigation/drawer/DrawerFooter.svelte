<!-- @component snippet component DrawerFooter — small renderable part for Drawer -->
<script module lang="ts">
export type DrawerFooterProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DrawerFooterProps>();
</script>

{#snippet DrawerFooter()}
	{@render children?.()}
{/snippet}
