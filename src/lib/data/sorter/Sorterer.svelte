<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import Sorter from './Sorter.svelte';
	import type { SortererProps } from './types.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		data = [],
		sortedData = $bindable(data),
		onSort = () => {},
		fields = [],
		activeCommonSortField = '',
		children,
		...rest
	}: SortererProps = $props();
</script>

<div bind:this={element} class="sorterer {className}" {...rest}>
	<Slotted child={children}><slot /></Slotted>
	{#each fields as field}
		<Sorter {...field} bind:sortedData bind:activeCommonSortField {data} />
	{/each}
</div>

<style lang="scss">
	@import './sorterer.scss';
</style>
