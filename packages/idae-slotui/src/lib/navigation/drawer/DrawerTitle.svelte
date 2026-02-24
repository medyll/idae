<!-- @component snippet component DrawerTitle — small renderable part for Drawer -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet DrawerTitle()}
	{@render children?.()}
{/snippet}
