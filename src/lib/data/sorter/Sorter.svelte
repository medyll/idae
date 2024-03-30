<script lang="ts">
	import Button from '$lib/base/button/Button.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import type { Data } from '$lib/types/index.js';
	import type { SortItem } from './types.js';

	/** Sorter mode */
	export let sorterMode: 'button' | 'menu' | 'free' = 'button';
	/** binding : final sorted data as raw object  */
	export let sortedData: SortItem[] = [];
	/** list of available sorts shown to user */
	export let sortListItems: string[] | undefined = undefined;
	/** data to sort */
	export let data: Data[];
	/** field from data to sort by*/
	export let sortByField: string | undefined = undefined;
	/** presented field from data to sort by*/
	export let sortByTitleField: string | undefined = undefined;
	/** order on which the sorted list is sorted */
	export let sortByOrder: 'asc' | 'desc' | 'none' | string = 'none';
	/** binding, used when multiple buttons*/
	export let activeCommonSortField: string = '';

	const sortState: string[] = ['none', 'asc', 'desc'];
	const icons = {
		default: ['dots-horizontal', 'sort-bool-ascending', 'sort-bool-descending']
	};

	$: sortedData = data;
	$: if (Boolean(activeCommonSortField) && activeCommonSortField !== sortByField) {
		sortByOrder = 'none';
	}

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

<div>
	{#if sorterMode === 'button'}
		<Button
			on:click={() => {
				const next = sortState.indexOf(sortByOrder) + 1;
				let toggleOrder = sortState?.[next] ? sortState[next] : sortState[0];
				if (sortByField) doSort(sortByField, toggleOrder);
			}}
			primary={sortByTitleField ?? sortByField}
			icon={'mdi' + icons.default[sortState.indexOf(sortByOrder)]}
			naked
			selected={sortByOrder !== 'none' && activeCommonSortField === sortByField}
			size="auto"
			showChip={sortByOrder !== 'none' && activeCommonSortField === sortByField}
		/>
	{/if}
	{#if sorterMode === 'menu'}
		<Button
			on:click={() => {
				if (sortByField) doSort(sortByField, 'desc');
			}}
			icon="mdi:sort-bool-descending"
		/>
	{/if}
	<!-- // button name + asc/desc -->
	<!-- // button menu with all data minus objects  + asc/desc -->
	<slot
		primary={sortByTitleField ?? sortByField}
		icon={'mdi:' + icons.default[sortState.indexOf(sortByOrder)]}
		naked
		selected={sortByOrder !== 'none' && activeCommonSortField === sortByField}
		size="auto"
		showChip={sortByOrder !== 'none' && activeCommonSortField === sortByField}
	/>
</div>
