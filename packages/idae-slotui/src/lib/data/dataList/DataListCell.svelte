<svelte:options />

<!-- trigger action on datalist -->
<script lang="ts" generics="T=Data">
	import type { DataCellType, DataListCellProps, DataListStoreType, RowType } from './types.js';
	import { getContext, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { resizer } from '$lib/utils/uses/resizer/resizer.js';
	import type { Data, ExpandProps } from '$lib/types/index.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Chipper from '$lib/base/chipper/Chipper.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import { onEvent } from '$lib/utils/uses/event.js';

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
	}: ExpandProps<DataListCellProps<T>> = $props();

	let colIndex: number;

	let minWidth = '80px';

	$effect(() => {
		// if inHeader take the width from
		// - the columns and dataField :  set it to the element
		// - the columns and element index :  set it to the element
		// - the element with : don't do nothing, but should ! throw error ?

		if (inHeader) {
			colIndex = element ? [...(element.parentElement?.children ?? [])].indexOf(element) : -1;
			if ($dataListContext.hasColumnsProps && field) {
				// console.log('hasColumnsProps && field');
				if (!$dataListContext.columns[field]) {
					tick();
					// console.log(0);
					createColumnsDef(element, field, colIndex);
				}
				if (!$dataListContext.columns[field]?.width) {
					tick();
					// console.log(field, element.offsetWidth);
					$dataListContext.columns[field].width = element.offsetWidth + 'px';
				}
			} else if ($dataListContext.hasColumnsProps) {
				tick();
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

	const createColumnsDef = async (element: HTMLElement, field: string, index: number) => {
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

	$effect(() => {
		sorticon =
			$dataListContext.sortBy.activeSortByField === field
				? $dataListContext?.config?.sortingIcons?.default[
						sortState.indexOf($dataListContext?.sortBy?.activeSortByOrder)
					]
				: 'mdi:dots-horizontal';

		showChip = $dataListContext.sortBy.activeSortByField === field;
	});

	/* $: if ($dataListContext.columns[field].width) {
    const w = $dataListContext.columns[field].width;
    finalWidthStyle = `min-width:${w};width:max-width:${w};`;
  } */
</script>

{#if inHeader}
	<td
		bind:this={element}
		use:onEvent={{ event: 'resizer:start', action: resizeStart }}
		use:onEvent={{ event: 'resizer:resize', action: resizeOn }}
		use:onEvent={{ event: 'resizer:end', action: resizeEnd }}
		data-sortable={true}
		data-column-id={columnId}
		data-noWrap={noWrap}
		class="dataListCell cellDimensions {className}"
		use:useResizer
		style="{style ??
			$dataListContext.columns[field]?.headerStyle ??
			$dataListContext.columns[field]?.style};}"
		style:width={$dataListContext.columns[field]?.width ?? minWidth}
		style:minWidth={$dataListContext.columns[field]?.width ?? minWidth}
		style:maxWidth={$dataListContext.columns[field]?.width ?? minWidth}
		{...rest}
	>
		<div onclick={() => onSort(field)} class="cellHeader">
			<div class="cellHeaderContent">
				<Slotted child={children} />
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
	</td>
{:else}
	<td
		bind:this={element}
		data-column-id={columnId}
		data-noWrap={noWrap}
		class="dataListCell cellDimensions {className}"
		{style}
		{...rest}
		style:width={$dataListContext.columns[field]?.width ?? minWidth}
		style:minWidth={$dataListContext.columns[field]?.width ?? minWidth}
		style:maxWidth={$dataListContext.columns[field]?.width ?? minWidth}
		{title}
	>
		<Slotted
			child={children}
			slotArgs={{
				fieldData: $rowContext?.data?.[field] ?? {}
			}}
		/>
	</td>
{/if}

<style lang="scss">
	.dataListCell {
		// transition: all  0.1s;
	}
</style>
