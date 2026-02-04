<script module lang="ts">
import type { Snippet } from 'svelte';
/**
 * Props for the DataListHead component.
 */
export type DataListHeadProps = {
	/** Inline style for the head element */
	style?: string;
	/** Reference to the head element */
	element?: HTMLDivElement;
	/** If true, header is sticky */
	stickyHeader?: boolean;
	/** Sort handler function */
	onSort?: Function;
	/** Slot for header children */
	children?: Snippet;
};
</script>
<script lang="ts">
		import type { DataListStoreType } from './types.js';
		// DataListHeadProps now in module script
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { DataCellType } from './types.js';
	import DataListCell from './DataListCell.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import { onEvent } from '$lib/utils/uses/event.js';
	import type { ExpandProps } from '$lib/types/index.js';

	let {
		style,
		element,
		stickyHeader = true,
		onSort = () => {},
		children
	}: ExpandProps<DataListHeadProps> = $props();

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

<thead
	bind:this={element}
	use:onEvent={{ event: 'datalist:sort:clicked', action: doSort }}
	class:pos-sticky={stickyHeader}
	class="datalist-head"
	style="{style};{cssVars}"
>
	<tr>
		<Slotted child={children}>
			{#if $dataListContext.hasColumnsProps}
				{#each Object.values($dataListContext.columns) as column}
					<DataListCell noWrap={true} field={column.field}>
						{column.fieldTitle ?? column.field}
					</DataListCell>
				{/each}
			{/if}
		</Slotted>
	</tr>
</thead>

<style lang="scss">
	.datalist-head {
		/* grid-template-columns: var(--template-columns) auto; grid-auto-columns: min-content;
		grid-auto-columns: min-content; */
	}
</style>
