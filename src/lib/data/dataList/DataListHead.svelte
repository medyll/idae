<script lang="ts">
	import type { DataListHeadProps, DataListStoreType } from './types.js';
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { DataCellType } from './types.js';
	import DataListCell from './DataListCell.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		style,
		element,
		stickyHeader = true,
		onSort = () => {},
		children
	}: DataListHeadProps = $props();

	const dataListContext = getContext<Writable<DataListStoreType>>('dataListContext');
	// this head is a head
	// cells give width for the whole dataList
	const headerer = writable<DataCellType[]>([]);

	setContext('dataListHead', headerer);

	function doSort(e: CustomEvent<{ field: string }>) {
		let activeSortByOrder = $dataListContext.sortBy.activeSortByOrder;
		const sortByOrder =
			activeSortByOrder === 'none' ? 'desc' : activeSortByOrder === 'asc' ? 'desc' : 'asc';

		$dataListContext.sortBy.activeSortByField = e.detail.field;
		$dataListContext.sortBy.activeSortByOrder = sortByOrder;

		// fire event
		const event = new CustomEvent('datalist:sorted', {
			detail: { field: e.detail.field, order: sortByOrder },
			bubbles: true
		});

		if (element) element.dispatchEvent(event);
	}

	function setCssGrid(columns: DataCellType[]) {
		if (Object.values(columns ?? []).every((e) => e.width)) {
			return Object.values(columns ?? []).reduce((previous, current, currentIndex) => {
				const witdh = current?.width ?? 'auto';
				return `${previous} minmax(${witdh},${witdh})`;
			}, '--template-columns:');
		}
	}

	let cssVars = setCssGrid($dataListContext.columns ?? []);
</script>

<!-- on:datalist:sort:clicked={doSort} -->
<div
	bind:this={element}
	class:pos-sticky={stickyHeader}
	class="datalist-head"
	style="{style};{cssVars}"
>
	<Slotted child={children}>
		{#if $dataListContext.hasColumnsProps}
			{#each Object.values($dataListContext.columns) as column}
				<DataListCell noWrap={true} field={column.field}>
					{column.fieldTitle ?? column.field}
				</DataListCell>
			{/each}
		{/if}
	</Slotted>
</div>

<style lang="scss">
	.datalist-head {
		display: flex;
		/* grid-template-columns: var(--template-columns) auto; grid-auto-columns: min-content;
		grid-auto-columns: min-content; */
	}
</style>
