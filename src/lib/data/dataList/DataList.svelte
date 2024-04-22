<svelte:options runes={true} accessors={true} />

<script lang="ts">
	import { getContext, hasContext, setContext, type Snippet } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import DataListRow from './DataListRow.svelte';
	import type { DataCellType, DataListStoreType, groupByOptions } from './types.js';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import DataListHead from './DataListHead.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { Data } from '$lib/types/index.js';
	import ContextRooter from '$lib/utils/contextRooter/ContextRooter.svelte';
	import sanitizeHtml from 'sanitize-html';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	export const sortingIcons = {
		default: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending'],
		numeric: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending']
	};

	type DataListProps = {
		/** className off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;

		/** show or hide the dataList header */
		showHeader: boolean;

		/** is the datalist sortable */
		isSortable: boolean;

		/** order on which the sorted list is sorted */
		sortByOrder: 'asc' | 'desc' | 'none' | string;

		/** group field on which data will be grouped, can use dot notation as dot path */
		groupByField?: string | string[];

		/** options used when props.groupByField is defined */
		groupByOptions: groupByOptions;

		/** field used for selection */
		selectorField: string;

		fieldValue: any;

		/** field value used for selection */
		selectorFieldValue?: any;

		/** binding, used when multiple buttons */
		activeCommonSortField: string;

		/** set noWrap = true to have ellipsis on all cells content */
		noWrap: boolean;

		/** set noWrap = true to have ellipsis on all header cells content */
		noWrapHeader: boolean;

		/** represents your data types used to display values */
		dataTypes?: Record<string, any>;

		/** data to loop through */
		data: any[];

		/** used only if data is provided */
		idField?: string;

		/** columns declaration */
		columns: Record<string, DataCellType>;

		/** Virtualizer instance for the list */
		virtualizer: boolean;

		/** Loading state of the list */
		isLoading: boolean;

		dataListCell?: Snippet<[{ fieldType: string; fieldName: string; fieldValue: any }]>;
		groupTitleSlot?: Snippet<[{ item: Data }]>;
	};

	let {
		class: className = '',
		style = '',
		element = null,
		showHeader = true,
		isSortable = true,
		sortByOrder = 'none',
		groupByField = undefined,
		groupByOptions = {
			showMainHeader: true,
			showSubGroupsHeader: true,
			showEmptyGroup: false
		},
		selectorField = 'id',
		selectorFieldValue = undefined,
		activeCommonSortField = '',
		noWrap = true,
		noWrapHeader = true,
		dataTypes = undefined,
		data = [],
		idField = undefined,
		columns = {},
		virtualizer = false,
		isLoading = false,
		fieldValue,
		dataListCell,
		groupTitleSlot
	}: DataListProps = $props();

	let hidedGroups: Data = {};

	let sortedData: any[] = $derived(data?.filter((x) => x));

	let groups = $derived(
		groupByField
			? dataOp.groupBy(data, groupByField, {
					keepUngroupedData: Boolean(groupByOptions.showEmptyGroup)
				})
			: {}
	);

	let dataListContext: Writable<DataListStoreType>;

	if (hasContext('dataListContext')) {
		getContext<Writable<DataListStoreType>>('dataListContext');
	} else {
		/** context store for dataList config and state */
		let dataListStore = writable<DataListStoreType>({
			config: {
				isSortable,
				defaultSortByField: undefined,
				defaultSortByOrder: sortByOrder,
				sortingIcons,
				noWrap,
				dataTypes
			},
			sortBy: {
				activeSortByField: undefined,
				activeSortByOrder: 'none'
			},
			groupBy: {
				groupByField,
				groupByOptions
			},
			idField,
			columns,
			hasColumnsProps: Boolean(Object.keys(columns).length),
			data
		});

		setContext<Writable<DataListStoreType>>('dataListContext', dataListStore);
	}

	function doSort(e: CustomEvent<{ field: string; order: string }>) {
		if (e.detail.field) {
			activeCommonSortField = e.detail.field;
			sortByOrder = e.detail.order;

			if (e.detail.order === 'none') {
				//sortedData = data;
			} else {
				//sortedData = dataOp.sortBy(data, e.detail.field, e.detail.order);
			}
		}
	}

	function doSelect(e: CustomEvent<Data>) {
		const selectedItem = e.detail;
		selectorFieldValue = selectedItem?.[selectorField];
	}

	function getGroupProps(content: any) {
		return {
			...content,
			columns,
			style,
			groupByField: undefined,
			groupByOptions,
			showHeader: groupByOptions.showSubGroupsHeader,
			selectorField,
			selectorFieldValue,
			virtualizer,
			isLoading
		};
	}

	function checkGetter(columns: Record<string, DataCellType>, field: string, data: Data) {
		const ret = columns[field]?.getter
			? columns[field]?.getter(data)
			: dataOp.resolveDotPath(data, field);
		return sanitizeHtml(ret);
	}
</script>

{#snippet listCell(item, inItem)}
	<Slotted
		child={dataListCell}
		slotArgs={{
			fieldName: $dataListContext.columns[inItem]?.field,
			fieldType: $dataListContext.columns[inItem]?.fieldType,
			fieldValue: sanitizeHtml(checkGetter({ ...$dataListContext.columns }, inItem, item)),
			fieldRawValue: sanitizeHtml(checkGetter({ ...$dataListContext.columns }, inItem, item))
		}}
	>
		<slot
			name="dataListCell"
			{...{
				fieldName: $dataListContext.columns[inItem]?.field,
				fieldType: $dataListContext.columns[inItem]?.fieldType,
				fieldValue: sanitizeHtml(checkGetter({ ...$dataListContext.columns }, inItem, item)),
				fieldRawValue: sanitizeHtml(checkGetter({ ...$dataListContext.columns }, inItem, item))
			}}
		/>
	</Slotted>
{/snippet}

<ContextRooter bind:contextRoot={dataListContext} contextKey="dataListContext" />
{#if groupByField}
	{#if groupByOptions?.showMainHeader}
		<DataListHead />
	{/if}
	<div bind:this={element} class="datalist-group-wrapper">
		{#each Object.keys(groups) as red}
			{@const groupProps = getGroupProps({ data: groups[red] })}
			{@const item = groups[red]}
			<div class="datalist-group">
				<header>
					<Slotted child={groupTitleSlot} slotArgs={{ item }}>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class="datalist-group-head"
							on:click={() => {
								hidedGroups[red] = !hidedGroups[red];
							}}
						>
							<div class="datalist-group-head-icon">
								<Icon class="datalist-group-head-icon" icon="cil:object-group" />
							</div>
							<div>{groupByField} : <span class="text-bold">{red}</span></div>
							<div class="datalist-group-head-divider" />
							<div>{groups[red]?.length}</div>
							<div class="datalist-group-head-icon">
								<Button
									on:click={() => {
										hidedGroups[red] = !hidedGroups[red];
									}}
									icon={hidedGroups[red] ? 'chevron-up' : 'chevron-down'}
									variant="naked"
								/>
							</div>
						</div>
					</Slotted>
				</header>
				<div class="datalist-group-body">
					{#if !hidedGroups[red]}
						<svelte:self {...groupProps}>
							<Slotted child={dataListCell} slotArgs={{ fieldType, fieldName, fieldValue }} />
							<Slotted child={groupTitleSlot} slotArgs={{ item: {} }} />
						</svelte:self>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		on:datalist:sorted={doSort}
		on:datalist:select={doSelect}
		bind:this={element}
		class="datalist {className}"
		{style}
		tabindex="0"
	>
		{#if element}
			{#if showHeader}
				<slot name="head">
					<DataListHead />
				</slot>
			{/if}
			{#each sortedData as item}
				<slot rawData={item} {item}>
					<DataListRow
						class={item[selectorField] === selectorFieldValue ? 'theme-bg-paper' : ''}
						data={item}
					>
						{#if $dataListContext.hasColumnsProps}
							{#each Object.keys($dataListContext.columns) as inItem}
								{@render listCell(item, inItem)}
							{/each}
						{:else}
							{#each Object.keys(item) as inItem}
								{@render listCell(item, inItem)}
							{/each}
						{/if}
					</DataListRow>
				</slot>
			{/each}
		{/if}
		<slot name="dataListFooter" />
	</div>
{/if}

<style global lang="scss">
	@import './datalist.scss';
</style>
