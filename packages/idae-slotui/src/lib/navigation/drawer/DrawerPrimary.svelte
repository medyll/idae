<!-- @component snippet component DrawerPrimary — small renderable part for Drawer -->
<script module lang="ts">
export type DrawerPrimaryProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DrawerPrimaryProps>();
</script>

{#snippet DrawerPrimary()}
	{@render children?.()}
{/snippet}
