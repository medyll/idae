<!-- @component snippet component DrawerTop — small renderable part for Drawer -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet DrawerTop()}
	{@render children?.()}
{/snippet}
