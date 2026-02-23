<script module lang="ts">
import type { Snippet } from 'svelte';
/**
 * Props for the DataList component.
 * Represents a data-driven list with sorting, grouping, and selection features.
 */
export type DataListProps<T = any> = {
	/** Class name for the root component */
	class?: string;
	/** CSS style for the root component */
	style?: string;
	/** Reference to the root HTMLDivElement */
	element?: HTMLDivElement | null;
	/** Show or hide the dataList header */
	showHeader?: boolean;
	/** Is the datalist sortable */
	isSortable?: boolean;
	/** Order on which the sorted list is sorted */
	sortByOrder?: 'asc' | 'desc' | 'none' | string;
	/** Group field on which data will be grouped, can use dot notation as dot path */
	groupByField?: string | string[];
	/** Options used when props.groupByField is defined */
	groupByOptions?: any;
	/** Field used for selection */
	selectorField?: string;
	/** Value for selection field */
	fieldValue?: any;
	/** Field value used for selection */
	selectorFieldValue?: any;
	/** Binding, used when multiple buttons */
	activeCommonSortField?: string;
	/** Disable wrapping for cell content */
	noWrap?: boolean;
	/** Disable wrapping for header content */
	noWrapHeader?: boolean;
	/** Data types for columns */
	dataTypes?: any;
	/** Data array */
	data?: T[];
	/** Field used as unique id */
	idField?: string;
	/** Slot for children content */
	children?: Snippet;
	 /** columns declaration */
  columns?: Record<string, DataCellType>;

  /** Virtualizer instance for the list */
  virtualizer?: boolean;

  /** Loading state of the list */
  isLoadingDrawerProps?: boolean;

  dataListHead?: Snippet;
  dataListFooter?: Snippet;
  dataListRow?: Snippet<[{ rawData: Data; item: Data }]>;
  dataListCell?: Snippet<
    [{ fieldType: string; fieldName: string; fieldValue: any }]
  >;
  groupTitleSlot?: Snippet<[{ item: Data }]>;
};
</script>

<script lang="ts" generics="T=Data">
import { getContext, hasContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import DataListRow from './DataListRow.svelte';
import { dataOp } from '$lib/utils/engine/utils.js';
import DataListHead from './DataListHead.svelte';
import Icon from '$lib/base/icon/Icon.svelte';
import Button from '$lib/controls/button/Button.svelte';
import type { Data, ExpandProps } from '$lib/types/index.js';
import ContextRooter from '$lib/utils/contextRooter/ContextRooter.svelte';
import sanitizeHtml from 'sanitize-html';
import Slotted from '$lib/utils/slotted/Slotted.svelte';

export const sortingIcons = {
	default: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending'],
	numeric: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending']
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
		dataListRow,
		dataListHead,
		dataListCell,
		dataListFooter,
		groupTitleSlot
	}: ExpandProps<DataListProps<T>> = $props();

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

	$effect(() => {
		element?.addEventListener('datalist:sorted', doSort);
		element?.addEventListener('datalist:select', doSelect);
	});
</script>

{#snippet listCell(item, inItem)}
	{@render dataListCell?.({
		fieldName: $dataListContext.columns[inItem]?.field,
		fieldType: $dataListContext.columns[inItem]?.fieldType,
		fieldValue: sanitizeHtml(checkGetter({ ...$dataListContext.columns }, inItem, item)),
		fieldRawValue: sanitizeHtml(checkGetter({ ...$dataListContext.columns }, inItem, item))
	})}
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
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="datalist-group-head"
							onclick={() => {
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
									onclick={() => {
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
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<table bind:this={element} class="datalist {className}" {style} tabindex="0">
		{#if element}
			{#if showHeader}
				<Slotted child={dataListHead}><DataListHead /></Slotted>
			{/if}
			{#each sortedData as item}
				<Slotted child={dataListRow} slotArgs={{ rawData: item, item }}>
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
				</Slotted>
			{/each}
		{/if}

		<Slotted child={dataListFooter} />
	</table>
{/if}

<style global>
  @import './dataList.css';
</style>
