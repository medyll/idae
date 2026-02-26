<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { DataOpGroupByOptions, DataOpSortBy } from '@medyll/idae-engine';
/**
 * Props for the Looper component.
 * Loops over data, with optional grouping, sorting, and slot support.
 * @template T - The type of the data property
 */
export type LoopProps<T> = CommonProps & {
	/** Title for the looped section */
	title?: string;
	/** Data array to loop over */
	data?: T[];
	/** If true, renders without extra wrapper */
	naked?: boolean;
	/** Grouping options for the data */
	groupBy?: DataOpGroupByOptions<T>;
	/** Sorting options for the data */
	sortBy?: DataOpSortBy<T>;
	/** Tag to use for the wrapper element */
	tag?: string;
	/** Slot for each item in the loop */
	children?: Snippet<[{ item: T; idx: number }]>;
	/** Slot for the loop title */
	loopTitle?: Snippet;
	/** Slot for the group title */
	loopGroupTitle?: Snippet<[{ key: any; data: T[]; idx: number }]>;
};
// Module-level Props marker for migration tooling
export type Props = any;
</script>
<script lang="ts" generics="T= Data">
		import type { Data } from '$lib/types/index.js';
		import Slotted from '$lib/utils/slotted/Slotted.svelte';
		// LoopProps now in module script
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


{#snippet loop(data: T[])}
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
		{@render loop(data ?? [])}
	{/if}
</div>
