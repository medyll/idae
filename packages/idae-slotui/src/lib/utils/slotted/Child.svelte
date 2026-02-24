<!-- @component snippet component Child — small renderable part for Slotted -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet Child()}
	{@render children?.()}
{/snippet}
