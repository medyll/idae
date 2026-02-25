<!-- @component snippet component CartoucheButtons — for Cartouche -->
<script module lang="ts">
	export type CartoucheButtonsProps = any;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet cartoucheButtons()}
	{@render children?.()}
{/snippet}

