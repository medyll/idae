<!-- @component snippet component DrawerContent — small renderable part for Drawer -->
<script module lang="ts">
export type DrawerContentProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DrawerContentProps>();
</script>

{#snippet DrawerContent()}
	{@render children?.()}
{/snippet}
