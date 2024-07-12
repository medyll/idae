<script lang="ts" generics="T= Data">
	import { dataOp } from '$lib/utils/engine/utils.js';
	import type { Data } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { LoopProps } from './types.js';

	let {
		class: className,
		data = [],
		title,
		groupBy,
		tag,
		loopTitle,
		loopGroupTitle,
		children,
		...rest
	}: LoopProps<T> = $props();

	let groupedData: Record<string, T[]> | undefined = $derived.by(() => {
		if (!groupBy) return undefined;
		return dataOp.groupBy(data, groupBy);
	});
</script>

{#snippet loop(data)}
	{#each data ?? [] as item, idx}
		{@render children?.({ item, idx })}
	{/each}
{/snippet}
<div class={className} style={className ? ' ' : ';display:contents;'} {...rest}>
	{#if groupBy && groupedData}
		{#each Object.entries(groupedData) as [key, data], idx}
			<Slotted child={loopGroupTitle} slotArgs={{ key, data, idx }}>
				{dataOp.resolveDotPath(data?.[0], groupBy)}
			</Slotted>
			{@render loop(data)}
		{/each}
	{:else}
		<Slotted child={loopTitle}>{title}</Slotted>
		{@render loop(data)}
	{/if}
</div>
