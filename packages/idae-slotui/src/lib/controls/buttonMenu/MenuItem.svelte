<!-- @component snippet component MenuItem — small renderable part for ButtonMenu -->
<script module lang="ts">
export type MenuItemProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<MenuItemProps>();
</script>

{#snippet MenuItem()}
	{@render children?.()}
{/snippet}
