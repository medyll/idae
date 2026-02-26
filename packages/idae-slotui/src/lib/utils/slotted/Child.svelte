<!-- @component snippet component Child — for Slotted -->
<script module lang="ts">
	export type ChildProps = Record<string, any>;
</script>

<script lang="ts">
	const { children } = $props<ChildProps>();
</script>

{#snippet Child()}
	{@render children?.()}
{/snippet}

