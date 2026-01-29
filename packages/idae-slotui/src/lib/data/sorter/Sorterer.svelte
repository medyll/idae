<script module lang="ts">
import type { CommonProps, Data } from '$lib/types/index.js';
/**
 * Props for the Sorterer component.
 * Handles sorting of tabular or list data with configurable fields.
 */
export type SortererProps = CommonProps & {
	/** Data to be sorted */
	data: Data[];
	/** binding : final sorted data as raw object  */
	sortedData?: Data[];
	fields: {
		sortByField: string;
		sortByTitleField?: string;
		sortByOrder?: 'asc' | 'desc' | 'none';
		order?: number;
	}[];
	activeCommonSortField?: string;
	/** Function to call when the data is sorted */
	onSort?: (sortedData: any[]) => void;
};
</script>

<script lang="ts">
import Slotted from '$lib/utils/slotted/Slotted.svelte';
import Sorter from './Sorter.svelte';

let {
	class: className = '',
	element = $bindable(),
	style = '',
	data = [],
	sortedData = $bindable(data),
	onSort = () => {},
	fields = [],
	activeCommonSortField = '',
	children
} = $props<SortererProps>();
</script>

<div bind:this={element} class="sorterer {className}" {...rest}>
	<Slotted child={children}></Slotted>
	{#each fields as field}
		<Sorter {...field} bind:sortedData bind:activeCommonSortField {data} />
	{/each}
</div>

<style lang="scss">
	@use './sorterer.scss';
</style>
