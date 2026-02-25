<!-- @component snippet component Child  for Slotted -->
<script module lang="ts">
	export type ChildProps = any;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet Child()}
	{@render children?.()}
{/snippet}

