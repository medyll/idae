<!-- @component snippet component DrawerTitle — small renderable part for Drawer -->
<script module lang="ts">
export type DrawerTitleProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DrawerTitleProps>();
</script>

{#snippet DrawerTitle()}
	{@render children?.()}
{/snippet}
