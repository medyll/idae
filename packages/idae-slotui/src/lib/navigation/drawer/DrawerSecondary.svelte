<!-- @component snippet component DrawerSecondary — small renderable part for Drawer -->
<script module lang="ts">
export type DrawerSecondaryProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DrawerSecondaryProps>();
</script>

{#snippet DrawerSecondary()}
	{@render children?.()}
{/snippet}
