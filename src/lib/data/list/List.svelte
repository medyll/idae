<script lang="ts">
	import type { LisItemProps } from './types.js';
	import ListItem from './ListItem.svelte';
	import { setContext } from 'svelte';
	import { createListStore } from './store.svelte.js';
	import type { ElementProps } from '$lib/types/index.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import ListTitle from './ListTitle.svelte';
	import { dataOp, propsProxy } from '$lib/utils/engine/utils.js';
	import type { SorterFieldType } from '$lib/data/sorter/types.js';

	type Data = Record<string, any>;
	// set stores
	const listStore = createListStore();
	setContext('listStateContext', listStore);

	let className: string | undefined = undefined;
	/**
	 * className off the root component
	 * @type {string | undefined}
	 */
	export { className as class };
	/**
	 * css style off the root component
	 * @type {string | undefined}
	 */

	export let style: string | undefined = undefined;
	/**
	 * element root HTMLDivElement props
	 * @type {HTMLDivElement | null}
	 */
	export let element: HTMLDivElement | null = null;

	/**
	 * pre-formatted listItems list
	 * @type {LisItemProps[] | undefined}
	 */
	export let listItems: LisItemProps[] | undefined = undefined;
	/**
	 * provided raw data, used if no listItems list is provided
	 * @type {Data[] | undefined}
	 */
	export let data: Data[] | undefined = undefined;
	/**
	 * Row from data for primary, used if props.data is provided
	 * @type {string | ((data: Data) => void) | undefined}
	 */
	export let dataFieldPrimary: string | ((data: Data) => void) | undefined = undefined;
	/**
	 * Row from data for secondary, used if props.data is provided
	 * @type {string | ((data: Data) => void) | undefined}
	 */
	export let dataFieldSecondary: string | ((data: Data) => void) | undefined = undefined;
	/**
	 * Row from data for secondary, used if props.data is provided
	 * @type {string | ((data: Data) => void) | undefined}
	 */
	export let dataFieldIcon: string | ((data: Data) => void) | undefined = undefined;

	export let height: string = 'auto';
	export let showIcon: boolean = true;
	export let virtualize: boolean = false;
	export let selectorField: any;
	/** show divider between listItems */
	export let showDivider: boolean = false;
	/** props for Divider, if present*/
	export let dividerProps: Record<string, any> = {};
	/** Sorterer component inclusion. Inferred */
	export let sorterer: SorterFieldType[] | undefined = undefined;
	/** set selected data by dataKey value*/
	export let selectedDataKey: string | undefined = undefined;
	/** set selected data by data object */
	export let setSelectedData: Record<string, any> = {};
	/** set selected data by selectedItem object */
	export let setSelectedItem: Record<string, any> = {};

	export let onItemClick: (args: Record<string, any>) => void = ({}) => {};
	/** @deprecated use primary title  */
	export let title: string = '';
	/** displayed as H5*/
	export let primary: string | undefined = undefined;
	/** secondary title */
	export let secondary: string | undefined = undefined;
	/** icon for the  title  zone*/
	export let icon: string | undefined = undefined;
	/** fieldName by wich we will group */
	export let groupBy: string | undefined = undefined;
	let groupedData: any;
	/** List will not be clickable and will gain opacity */
	export let disabled: boolean = false;
	/** density of the list
	 * @type {'none' | 'tight' | 'default' | 'medium' | 'kind'}
	 */
	export let density: ElementProps['density'] = 'default';

	/** binding for selectedData */
	export let activeData = $listStore.activeData;
	/** sortedData if props.sorterer*/
	let sortedData: any[];

	$listStore.density = density;
	listStore.setSelectorField(selectorField);

	$: if (setSelectedData) {
		listStore.setActiveData(setSelectedData);
	}

	if (groupBy) {
		// if groupBy, we'll use  props.data or props.lisTitem.data
		if (data) {
			groupedData = dataOp.groupBy(data, groupBy);
		} else {
		}
	}

	// if data, build some list items
	$: if (data) {
		if (dataFieldPrimary || dataFieldSecondary) {
			listItems = propsProxy(
				[
					['primary', dataFieldPrimary ?? '"'],
					['secondary', dataFieldSecondary ?? '"'],
					['icon', dataFieldIcon ?? '"']
				],
				data
			);
		} else {
			try {
				listItems = data.map((dta: Data) => {
					return {
						primary: dta?.name ?? dta.code,
						secondary: dta?.id,
						data: dta
					};
				});
			} catch (e) {
				console.log(e, 'red');
			}
		}
	}

	/** on listItem clicked, we set activeData to e.LisItemProps*/
	function onListItemClick(e: CustomEvent<LisItemProps>) {
		if (disabled) {
			e.stopPropagation();
			return;
		}

		listStore.setActiveData(e.detail?.data); // should be  e.detail.data
		listStore.setActiveItem(e.detail);

		onItemClick && onItemClick(e.detail);
	}

	function onListItemClick_Deprecated(e: CustomEvent<LisItemProps>) {
		if (disabled) {
			e.stopPropagation();
			return;
		}

		listStore.setActiveData(e.detail); // should be  e.detail.data

		onItemClick && onItemClick(e.detail);
	}

	function navigateList(e: KeyboardEvent) {
		if (![38, 40].includes(e.keyCode)) return;

		let tt = 0;
		if (listItems) {
			if ($listStore.activeItem?.['primary']) {
				tt = dataOp.findObjectIndex(listItems, $listStore.activeItem['primary'], 'primary');
			}
			// seek listItem with same data.selectorField as activeData
			if (selectorField && $listStore.activeItem?.data?.[selectorField]) {
				tt = dataOp.findObjectIndex(
					listItems,
					$listStore.activeItem.data[selectorField],
					'data.' + selectorField
				);
			}
		} else if (data) {
			if (selectorField) {
				tt = dataOp.findObjectIndex(data, $listStore.activeData[selectorField], selectorField);
			}
		}

		if (tt === -1) return;

		const dir = e.keyCode === 38 ? tt - 1 : tt + 1;

		if (listItems && listItems[dir]) {
			$listStore.activeItem = listItems[dir];
			$listStore.activeData = listItems[dir]?.data;
		} else if (data) {
		}
	}

	// vars for display rules
	let showTitleZone = $$slots.title || $$slots.listTitle || title || primary || secondary;
</script>

<ul
	bind:this={element}
	class="listRoot dense-{density} {className}"
	on:listclicked={onListItemClick_Deprecated}
	on:list:dblclicked={onListItemClick_Deprecated}
	on:listitem:click={onListItemClick}
	on:listitem:dblclick={onListItemClick}
	style="position:relative;height:{height};{style};opacity:{disabled ? 0.6 : 1};overflow:{virtualize
		? 'hidden'
		: 'auto'};"
	tabindex="0"
	on:keydown={navigateList}
	role="navigation"
	aria-label="Menu"
>
	{#if showTitleZone}
		<slot name="listTitle">
			<ListTitle primary={primary ?? title} {secondary} {icon} />
		</slot>
	{/if}
	{#if listItems}
		{#each listItems as item}
			<slot {item}>
				<ListItem
					style="content-visibility:hidden;"
					{showIcon}
					{density}
					{showDivider}
					{dividerProps}
					data={item.data}
					icon={item?.icon}
				>
					<span slot="listItemIcon">
						{#if item?.icon}<Icon fontSize="small" icon={item?.icon} />{/if}
					</span>
					<span slot="listItemPrimary">{item?.primary ?? ''}</span>
					<span slot="listItemSecondary">{item?.secondary ?? ''}</span>
					<span slot="listItemAction">{item?.action ?? ''}</span>
				</ListItem>
			</slot>
		{/each}
	{:else}
		<slot />
	{/if}
	{#if showTitleZone}
		<slot name="listFooter" />
	{/if}
</ul>

<style lang="scss">
	@import 'list.scss';
</style>
