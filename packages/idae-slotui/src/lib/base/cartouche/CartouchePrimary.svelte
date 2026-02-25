<!-- @component snippet component CartouchePrimary — for Cartouche -->
<script module lang="ts">
	export type CartouchePrimaryProps = any;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet cartouchePrimary()}
	{@render children?.()}
{/snippet}

