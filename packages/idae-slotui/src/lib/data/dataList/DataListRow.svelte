<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { CommonProps, Data } from '$lib/types/index.js';
	/**
	 * Props for a row in the DataList.
	 * @template T - The data type for the row.
	 */
	export type DataListRowProps<T> = CommonProps & {
	  /** Data for the row */
	  data: T;
	  /** Children snippet for the default cell content */
	  children?: Snippet;
	};
</script>

<script lang="ts" generics="T=Data">
	import sanitizeHtml from 'sanitize-html';
	import type { Data } from '$lib/types/index.js';
	import { writable, type Writable } from 'svelte/store';
	import DataListCell from './DataListCell.svelte';
	import type { DataCellType, DataListStoreType } from './types.js';
	import type { RowType } from './types.js';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import { getContext, setContext } from 'svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import { onEvent } from '$lib/utils/uses/event.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		data,
		children,
		...rest
	}: DataListRowProps<T> = $props();

	// DataListRowProps now in module script
	const dataStore = writable<RowType>({ data });
	setContext('dataListRow', dataStore);

	const dataListContext = getContext<Writable<DataListStoreType>>('dataListContext');

	function handleClick(item: Data) {
		const event = new CustomEvent('datalist:click', { detail: item, bubbles: true });
		if (element) element.dispatchEvent(event);
	}

	function handleSelect(item: Data) {
		const event = new CustomEvent('datalist:select', { detail: item, bubbles: true });
		if (element) element.dispatchEvent(event);
	}

	function fieldOrFunction(item: Data, field: string, defaultValue?: any): string {
		const resolved = dataOp.resolveDotPath(item, field);
		return typeof resolved === 'function' ? resolved(item) : resolved;
	}

	function checkGetter(columns: Record<string, DataCellType>, field: string, data: Data) {
		const ret = columns[field]?.getter
			? columns[field]?.getter(data)
			: dataOp.resolveDotPath(data, field);
		return sanitizeHtml(ret);
	}

	let cssVars = $derived(() => {
		return Object.values($dataListContext.columns ?? []).reduce(
			(previous, current, currentIndex) => {
				const witdh = current?.width ?? 'auto';
				return `${previous} minmax(${witdh},${witdh})`;
			},
			'--template-columns:'
		);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<tr
	bind:this={element}
	use:onEvent={{ event: 'datalist:sort:clicked', action: () => {} }}
	onclick={() => {
		if (data) handleClick(data);
		if (data) handleSelect(data);
	}}
	class="dataListRow {className}"
	style="{style};{cssVars}"
	{...rest}
>
	{#if children}
		<Slotted child={children}></Slotted>
	{:else if $dataListContext.hasColumnsProps}
		{#each Object.keys($dataListContext.columns) as inItem}
			{@const field = $dataListContext.columns[inItem].field}
			{@const final = checkGetter($dataListContext.columns, field, data)}
			<!--  fieldOrFunction(data?.[field], field) -->
			<DataListCell title={final} {field}>
				{@html sanitizeHtml(checkGetter({ ...$dataListContext.columns }, field, data)) ?? ''}
			</DataListCell>
		{/each}
	{:else}
		{#each Object.keys(data) as inItem}
			<DataListCell field={inItem}>
				<Slotted child={children}></Slotted>
			</DataListCell>
		{/each}
	{/if}
</tr>

<style lang="postcss">
	.dataListRow {
		/* grid-template-columns: var(--template-columns);
		grid-auto-columns: min-content; */
		content-visibility: auto;
		contain-intrinsic-size: 30px 500px;
	}
</style>
