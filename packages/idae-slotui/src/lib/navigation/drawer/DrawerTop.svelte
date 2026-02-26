<!-- @component snippet component DrawerTop — small renderable part for Drawer -->
<script module lang="ts">
export type DrawerTopProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<DrawerTopProps>();
</script>

{#snippet DrawerTop()}
	{@render children?.()}
{/snippet}
