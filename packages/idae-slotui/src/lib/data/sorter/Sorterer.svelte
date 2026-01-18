<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import Sorter from './Sorter.svelte';
	import type { SortererProps } from './types.js';

	/**
	 * @property {string} className - className off the root component
	 * @property {HTMLDivElement | null} element - element root HTMLDivElement props
	 * @property {string} style - css style off the root component
	 * @property {Array} data - Data to be sorted
	 * @property {Array} sortedData - binding : final sorted data as raw object
	 * @property {Function} onSort - Function to call when the data is sorted
	 * @property {Array} fields - Sort fields
	 * @property {string} activeCommonSortField - Active sort field
	 * @property {Snippet} children - Slot for children
	 * @property {object} rest - All additional props spread
	 */
	let {
		/** className off the root component */
		class: className = '',
		/** element root HTMLDivElement props */
		element = $bindable(),
		/** css style off the root component */
		style = '',
		/** Data to be sorted */
		data = [],
		/** binding : final sorted data as raw object */
		sortedData = $bindable(data),
		/** Function to call when the data is sorted */
		onSort = () => {},
		/** Sort fields */
		fields = [],
		/** Active sort field */
		activeCommonSortField = '',
		/** Slot for children */
		children,
		...rest
	}: SortererProps = $props();
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
