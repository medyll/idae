<script module lang="ts">
import type { ButtonProps } from '$lib/controls/button/types.js';
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Type for a sortable field in Sorter.
 */
export type SorterFieldType = {
	/** Field to sort by */
	sortByField: string;
	/** Optional title for the field */
	sortByTitleField?: string;
	/** Sort order */
	sortByOrder?: 'asc' | 'desc' | 'none';
	/** Order index */
	order?: number;
};

/**
 * Placeholder for a sort item (extend as needed).
 */
export type SortItem = {};

/**
 * Props for the Sorterer component (legacy, not used in main Sorter).
 */
export type SortererProps = CommonProps & {
	/** Data to be sorted */
	data: Data[];
	/** Final sorted data as raw object */
	sortedData?: Data[];
	/** Sortable fields */
	fields: SorterFieldType[];
	/** Active field for common sort */
	activeCommonSortField?: string;
	/** Callback when data is sorted */
	onSort?: (sortedData: any[]) => void;
};

/**
 * Props for the Sorter component.
 * Represents a sorting widget with customizable fields, order, and slot support.
 */
export type SorterProps = {
	/** The data to sort */
	data: Data[];
	/** Final sorted data as raw object */
	sortedData?: Data[];
	/** The field to sort by */
	sortByField: string;
	/** The title of the field to sort by */
	sortByTitleField?: string;
	/** List of available sorts shown to user */
	sortListItems?: string[];
	/** The order to sort by */
	sortByOrder?: 'asc' | 'desc' | 'none' | string;
	/** The active field to sort by */
	activeCommonSortField?: string;
	/** Sorter mode */
	sorterMode?: 'button' | 'menu' | 'free';
	/** Slot for children content (ButtonProps) */
	children?: Snippet<[ButtonProps]>;
};
</script>
<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import type { ExpandProps } from '$lib/types/index.js';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

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

<style global>
  @import './sorter.css';
</style>
