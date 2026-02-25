<!-- @component snippet component CartoucheSecondary — for Cartouche -->
<script module lang="ts">
	export type CartoucheSecondaryProps = any;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet cartoucheSecondary()}
	{@render children?.()}
{/snippet}

