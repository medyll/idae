<script lang="ts" generics="T= Data">
	import type { Data } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { LoopProps } from './types.js';
	import { dataOp } from '@medyll/idae-engine';

	let {
		class: className,
		data = $bindable(),
		title,
		groupBy,
		sortBy,
		tag,
		loopTitle,
		loopGroupTitle,
		children,
		...rest
	}: LoopProps<T> = $props();

	let sortedData = $derived.by(() => {
		if (!sortBy) return data;
		return dataOp.sortBy<T>({ arr: data, by: sortBy });
	});
	let groupedData = $derived.by(() => {
		if (!groupBy) return undefined;
		return dataOp.groupBy<T>({ data: sortedData ?? [], groupBy });
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
				{data.title ?? data.code ?? key}
			</Slotted>
			{@render loop(data.data)}
		{/each}
	{:else}
		<Slotted child={loopTitle}>{title}</Slotted>
		{@render loop(data)}
	{/if}
</div>
