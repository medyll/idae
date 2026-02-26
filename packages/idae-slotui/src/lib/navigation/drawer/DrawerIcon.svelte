<!-- @component snippet component DrawerIcon — small renderable part for Drawer -->
<script module lang="ts">
export type DrawerIconProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DrawerIconProps>();
</script>

{#snippet DrawerIcon()}
	{@render children?.()}
{/snippet}
