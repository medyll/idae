<!-- @component snippet component ChipperChip — for Chipper -->
<script module lang="ts">
	export type ChipperChipProps = any;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet chipperChip()}
	{@render children?.()}
{/snippet}

