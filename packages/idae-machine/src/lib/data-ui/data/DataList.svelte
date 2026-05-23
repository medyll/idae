<!--
DataList.svelte
Data provider + renderer — fetches, sorts, groups, paginates, iterates.
Consumers provide named snippets; DataList handles all loops.

@prop {string} collection
@prop {Record<string,unknown>} [where]
@prop {SortBy | SortBy[]} [sortBy]
@prop {string} [groupBy]
@prop {number} [pageSize] - 0 = no pagination
@prop {number} [page] - 1-based
@prop {string} [listClass] - CSS class for <ul>
@prop {string} [groupClass] - CSS class for group wrapper <div>
@snippet item({ record, idx, fieldValues }) - renders one record (required)
@snippet groupHeader({ key, count }) - renders group section header (optional)
@snippet empty() - renders empty state (optional)
@snippet footer({ pagination }) - renders pagination/footer (optional)
-->
<script lang="ts" generics="COL extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { SortBy } from '$lib/types/machine-model.js';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems } from '$lib/data-ui/utils/explorerUtils.js';

	interface PaginationInfo {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	}

	let {
		collection,
		where,
		sortBy,
		groupBy,
		pageSize = 0,
		page = 1,
		listClass,
		groupClass,
		item: itemSnippet,
		groupHeader: groupHeaderSnippet,
		empty: emptySnippet,
		footer: footerSnippet,
	}: {
		collection: string;
		where?: Record<string, unknown>;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		pageSize?: number;
		page?: number;
		listClass?: string;
		groupClass?: string;
		item: Snippet<[{ record: COL; idx: number; fieldValues: Record<string, unknown> }]>;
		groupHeader?: Snippet<[{ key: string; count: number }]>;
		empty?: Snippet;
		footer?: Snippet<[{ pagination: PaginationInfo }]>;
	} = $props();

	const store      = $derived(collection ? machine.store[collection] : undefined);
	const collLogic  = $derived(collection ? safeCollection(collection) : null);
	const indexField = $derived(collLogic?.template?.index ?? 'id');
	const fieldValues = $derived(collLogic?.collectionValues ?? {});
	const defaultSort = $derived(collLogic?.defaultSort ?? [{ field: indexField, direction: 'asc' as const }]);
	const effectiveSort = $derived(sortBy ?? defaultSort);

	const rawItems = $derived.by(() => {
		if (!store) return [] as COL[];
		if (where) return (store.where(where) ?? []) as COL[];
		return (store.getAll() ?? []) as COL[];
	});

	const sortedItems = $derived.by(() => {
		if (!rawItems.length) return rawItems;
		return sortItems(rawItems, effectiveSort);
	});

	const paginatedItems = $derived.by(() => {
		if (!pageSize || pageSize <= 0) return sortedItems;
		const start = (page - 1) * pageSize;
		return sortedItems.slice(start, start + pageSize);
	});

	const total      = $derived(rawItems.length);
	const totalPages = $derived(pageSize > 0 ? Math.ceil(total / pageSize) : 1);
	const pagination = $derived<PaginationInfo>({ page, pageSize, total, totalPages });

	const groups = $derived.by(() => {
		if (!groupBy || !paginatedItems.length) return undefined;
		return groupItems(paginatedItems, groupBy);
	});

	function safeCollection(name: string) {
		try { return machine.logic.collection(name); } catch { return null; }
	}

	let errorMessage = $state<string | null>(null);

	$effect(() => {
		if (!safeCollection(collection)) {
			errorMessage = `Collection '${collection}' not found in schema.`;
		} else {
			errorMessage = null;
		}
	});
</script>

{#if errorMessage}
	<div class="error-message">{errorMessage}</div>
{:else if groups}
	{#each Array.from(groups) as [key, groupItems] (key)}
		<div class={groupClass ?? 'data-list-group'}>
			{#if groupHeaderSnippet}{@render groupHeaderSnippet({ key, count: groupItems.length })}{/if}
			<ul class={listClass} role="list">
				{#each groupItems as record, idx ((record as Record<string, unknown>)[indexField])}
					{@render itemSnippet({ record: record as COL, idx, fieldValues })}
				{/each}
			</ul>
		</div>
	{/each}
{:else}
	<ul class={listClass} role="list">
		{#each paginatedItems as record, idx ((record as Record<string, unknown>)[indexField])}
			{@render itemSnippet({ record: record as COL, idx, fieldValues })}
		{/each}
	</ul>
	{#if !paginatedItems.length && emptySnippet}
		{@render emptySnippet()}
	{/if}
{/if}
{#if footerSnippet}
	{@render footerSnippet({ pagination })}
{/if}

<style>
	.error-message { color: red; padding: 1rem; }
	.data-list-group { margin-bottom: var(--gutter-md); }
</style>
