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

	/**
	 * @property {Array} data - The data to sort
	 * @property {Array} sortedData - binding : final sorted data as raw object
	 * @property {string} sortByField - The field to sort by
	 * @property {string} sortByTitleField - The title of the field to sort by
	 * @property {'asc' | 'desc' | 'none' | string} sortByOrder - The order to sort by
	 * @property {string} activeCommonSortField - Active sort field
	 * @property {string} sorterMode - Mode du tri (button, ...)
	 * @property {Snippet} children - Slot for children
	 * @property {Array} sortListItems - List of available sorts
	 * @property {object} rest - All additional props spread
	 */
	let {
		/** The data to sort */
		data = [],
		/** binding : final sorted data as raw object */
		sortedData = $bindable(data),
		/** The field to sort by */
		sortByField,
		/** The title of the field to sort by */
		sortByTitleField,
		/** The order to sort by */
		sortByOrder = 'none',
		/** Active sort field */
		activeCommonSortField = $bindable(''),
		/** Mode du tri (button, ...) */
		sorterMode = 'button',
		/** Slot for children */
		children,
		/** List of available sorts */
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

<div class="flex items-center gap-2" {...rest}>
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
