<!-- @component snippet component DrawerContent — small renderable part for Drawer -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet DrawerContent()}
	{@render children?.()}
{/snippet}
