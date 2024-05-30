<script lang="ts" generics="T= Data">
	import type { Snippet } from 'svelte';
	import { dataOp, type ResolverPathType } from '../engine/utils.js';
	import type { CommonProps, Data } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	type LoopProps = CommonProps & {
		class?: string;
		data?: T[];
		naked?: boolean;
		title?: string;
		groupBy?: ResolverPathType<T>;
		tag?: string;
		children?: Snippet<[{ item: T; idx: number }]>;
		loopTitle?: Snippet;
		loopGroupTitle?: Snippet;
	};

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
	}: LoopProps = $props();

	let groupedData: Record<string, T[]> | undefined = $derived.by(() => {
		if (!groupBy) return undefined;
		return dataOp.groupBy(data, groupBy);
	});
</script>

{#snippet loop(data)}
	{#each data ?? [] as item, idx}
		<Slotted child={children} slotArgs={{ item, idx }}></Slotted>
		<!-- <slot {item} {idx}>
			</slot > -->
	{/each}
{/snippet}
<Slotted child={loopTitle}>{title}</Slotted>
<!-- <slot name="loopTitle">{title}</slot> -->

<div class={className} style={className ? ' ' : ';display:contents;'} {...rest}>
	{#if groupBy && groupedData}
		{#each Object.entries(groupedData) as [key, value], idx}
			<!-- <slot name="loopGroupTitle" item={value?.[0]}>
					{dataOp.resolveDotPath(value?.[0], groupBy)}
				</slot> -->
			<Slotted child={loopGroupTitle} slotArgs={{ key, value, idx }}>
				{dataOp.resolveDotPath(value?.[0], groupBy)}
			</Slotted>
			{@render loop(value)}
		{/each}
	{:else}
		{@render loop(data)}
	{/if}
</div>
