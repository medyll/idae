<svelte:options accessors={true} />

<script lang="ts">
	import sanitizeHtml from 'sanitize-html';
	import type { Data } from '$lib/types/index.js';
	import { writable, type Writable } from 'svelte/store';
	import DataListCell from './DataListCell.svelte';
	import type { DataCellType, DataListStoreType } from './types.js';
	import type { RowType } from './types.js';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import { getContext, setContext } from 'svelte';
	let className = '';
	export { className as class };
	export let element: HTMLDivElement | undefined = undefined;

	export let data: any;
	export let style: string = '';

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

	$: cssVars = Object.values($dataListContext.columns ?? []).reduce(
		(previous, current, currentIndex) => {
			const witdh = current?.width ?? 'auto';
			return `${previous} minmax(${witdh},${witdh})`;
		},
		'--template-columns:'
	);
</script>

<div
	bind:this={element}
	on:datalist:sort:clicked
	on:click={() => {
		if (data) handleClick(data);
		if (data) handleSelect(data);
	}}
	class="dataListRow {className}"
	style="{style};{cssVars}"
>
	{#if $$slots.default}
		<slot />
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
				<slot />
			</DataListCell>
		{/each}
	{/if}
</div>

<style lang="scss">
	.dataListRow {
		display: flex;
		/* grid-template-columns: var(--template-columns);
		grid-auto-columns: min-content; */
		content-visibility: auto;
		contain-intrinsic-size: 30px 500px;
	}
</style>
