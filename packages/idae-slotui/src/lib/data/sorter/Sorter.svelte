<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import type { ExpandProps } from '$lib/types/index.js';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { SorterProps } from './types.js';

	const sortState: string[] = ['none', 'asc', 'desc'];
	const icons = {
		default: ['dots-horizontal', 'sort-bool-ascending', 'sort-bool-descending']
	};

	let {
		data = [],
		sortedData = $bindable(data),
		sortByField,
		sortByTitleField,
		sortByOrder = 'none',
		activeCommonSortField = $bindable(''),
		sorterMode = 'button',
		children,
		sortListItems,
		...rest
	}: ExpandProps<SorterProps> = $props();

	$effect(() => {
		if (Boolean(activeCommonSortField) && activeCommonSortField !== sortByField) {
			sortByOrder = 'none';
		}
	});

	function doSort(field: string, order: 'asc' | 'desc' | 'none' | string) {
		activeCommonSortField = field;
		sortByOrder = order;
		if (order === 'none') {
			sortedData = data;
		} else {
			sortedData = dataOp.sortBy(data, field, order);
		}
	}
</script>

<div {...rest}>
	{#if sorterMode === 'button'}
		<Button
			onclick={() => {
				const next = sortState.indexOf(sortByOrder) + 1;
				let toggleOrder = sortState?.[next] ? sortState[next] : sortState[0];
				if (sortByField) doSort(sortByField, toggleOrder);
			}}
			value={sortByTitleField ?? sortByField}
			icon={'mdi' + icons.default[sortState.indexOf(sortByOrder)]}
			variant="naked"
			selected={sortByOrder !== 'none' && activeCommonSortField === sortByField}
			width="auto"
			showChip={sortByOrder !== 'none' && activeCommonSortField === sortByField}
		/>
	{/if}
	{#if sorterMode === 'menu'}
		<Button
			onclick={() => {
				if (sortByField) doSort(sortByField, 'desc');
			}}
			icon="mdi:sort-bool-descending"
		/>
	{/if}
	<!-- // button name + asc/desc -->
	<!-- // button menu with all data minus objects  + asc/desc -->
	<Slotted
		child={children}
		slotArgs={{
			primary: sortByTitleField ?? sortByField,
			icon: 'mdi:' + icons.default[sortState.indexOf(sortByOrder)],
			naked: true,
			selected: sortByOrder !== 'none' && activeCommonSortField === sortByField,
			size: 'auto',
			showChip: sortByOrder !== 'none' && activeCommonSortField === sortByField
		}}
	></Slotted>
</div>
