<svelte:options accessors={true} />

<script lang="ts">
	import type { DataCellType, DataListCellProps, DataListStoreType, RowType } from './types.js';
	import { getContext, onMount, tick, type Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { resizer } from '$lib/utils/uses/resizer/resizer.js';
	import type { Data } from '$lib/types/index.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Chipper from '$lib/base/chipper/Chipper.svelte';

	const dataListContext = getContext<Writable<DataListStoreType>>('dataListContext');
	const inHeader = getContext<Writable<DataCellType[]>>('dataListHead');
	const rowContext = getContext<Writable<RowType>>('dataListRow');

	let className = '';
	export { className as class };



	let {
		element = $bindable(),
		field,
		style,
		fieldType,
		columnId = field ?? (crypto.randomUUID() as string),
		noWrap = true,
		title,
		children,
		...rest
	}: DataListCellProps = $props();

	let colIndex: number;

	let minWidth = '80px';

	$effect( () => {
		// if inHeader take the width from
		// - the columns and dataField :  set it to the element
		// - the columns and element index :  set it to the element
		// - the element with : don't do nothing, but should ! throw error ?

		if (inHeader) {
			colIndex = element ? [...(element.parentElement?.children ?? [])].indexOf(element) : -1;
			if ($dataListContext.hasColumnsProps && field) {
				// console.log('hasColumnsProps && field');
				if (!$dataListContext.columns[field]) {
					await tick();
					// console.log(0);
					createColumnsDef(element, field, colIndex);
				}
				if (!$dataListContext.columns[field]?.width) {
					await tick();
					// console.log(field, element.offsetWidth);
					$dataListContext.columns[field].width = element.offsetWidth + 'px';
				}
			} else if ($dataListContext.hasColumnsProps) {
				await tick();
				// console.log(2);
				// grab and declare field from data
				field = getAutoFields($dataListContext.data)[colIndex];
			} else if (field) {
				// console.log(3);

				// throw new Error('props.field found without column declaration : '+field);
				createColumnsDef(element, field, colIndex);
			} else {
				// console.log(4);
				// create a dummy field for reference
				createColumnsDef(element, crypto.randomUUID(), colIndex);
			}
		}

		return () => {
			columnId = undefined;
		};
	});

	const createColumnsDef = async (
		element: HTMLElement | undefined,
		field: string,
		index: number
	) => {
		if (!element) return;
		await tick();
		$dataListContext.columns[field] = {
			field,
			style: element.getAttribute('style') ?? '',
			width: element.offsetWidth + 'px',
			order: Boolean(element.style?.order) ? eval(element.style.order) : index,
			index: index,
			columnId: field
		};
		$dataListContext.hasColumnsProps = true;
	};

	const updateColumnsDef = async (field: string, payload: Record<string, any>) => {
		await tick();
		$dataListContext.columns[field] = {
			...$dataListContext.columns[field],
			...payload
		};
	};

	/**
	 * used if no columns and no props.field
	 * @param data
	 */
	const getAutoFields = (data: Record<string, any>[]): string[] => {
		return Object.keys(data[0]);
	};

	const onSort = (field: string) => {
		const event = new CustomEvent('datalist:sort:clicked', { detail: { field }, bubbles: true });
		if (element) element.dispatchEvent(event);
	};

	// not pure
	const useResizer = (node: HTMLElement, opt?: any) => {
		if (inHeader) resizer(node, opt);
	};

	function resizeStart() {}

	async function resizeOn(data: CustomEvent<{ width: any }>) {
		await tick();
		$dataListContext.columns[field].width = data.detail.width + 'px';
	}
	function resizeEnd() {}

	const sortState: string[] = ['none', 'asc', 'desc'];
	let sorticon: string;
	let showChip: boolean;

	let timerWidth: any;
	let finalWidthStyle: string = '';

	$: if (inHeader) {
		sorticon =
			$dataListContext.sortBy.activeSortByField === field
				? $dataListContext?.config?.sortingIcons?.default[
						sortState.indexOf($dataListContext?.sortBy?.activeSortByOrder)
					]
				: 'mdi:dots-horizontal';

		showChip = $dataListContext.sortBy.activeSortByField === field;
	}

	/* $: if ($dataListContext.columns[field].width) {
    const w = $dataListContext.columns[field].width;
    finalWidthStyle = `min-width:${w};width:max-width:${w};`;
  } */
</script>

{#if inHeader}
	<div
		bind:this={element}
		data-sortable={true}
		data-column-id={columnId}
		data-noWrap={noWrap}
		class="dataListCell cellDimensions {className}"
		use:useResizer
		on:resizer:start={resizeStart}
		on:resizer:resize={resizeOn}
		on:resizer:end={resizeEnd}
		style="{style ??
			$dataListContext.columns[field]?.headerStyle ??
			$dataListContext.columns[field]?.style};}"
		style:width={$dataListContext.columns[field]?.width ?? minWidth}
		style:minWidth={$dataListContext.columns[field]?.width ?? minWidth}
		style:maxWidth={$dataListContext.columns[field]?.width ?? minWidth}
		{...rest}
	>
		<div on:click={() => onSort(field)} class="cellHeader">
			<div class="cellHeaderContent">
				<slot />
			</div>
			{#if field && $dataListContext?.config?.isSortable}
				<div class="cellHeaderSorter" title={sorticon}>
					<Chipper
						class="pad"
						{showChip}
						position={showChip && $dataListContext.sortBy?.activeSortByOrder === 'desc'
							? 'top'
							: 'bottom'}
					>
						<Icon icon={sorticon} />
					</Chipper>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div
		bind:this={element}
		data-column-id={columnId}
		data-noWrap={noWrap}
		class="dataListCell cellDimensions {className}"
		{style}
		{...$$restProps}
		style:width={$dataListContext.columns[field]?.width ?? minWidth}
		style:minWidth={$dataListContext.columns[field]?.width ?? minWidth}
		style:maxWidth={$dataListContext.columns[field]?.width ?? minWidth}
		{title}
	>
		<slot fieldData={$rowContext?.data?.[field] ?? {}} />
	</div>
{/if}

<style lang="scss">
	.dataListCell {
		// transition: all  0.1s;
	}
</style>
