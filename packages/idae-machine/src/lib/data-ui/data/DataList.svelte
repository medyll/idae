<!--
DataList.svelte
Data provider + renderer — fetches, sorts, groups, paginates, iterates.
Autonomous by default: renders DataFields (template.presentation fields) when no snippet provided.
Consumers can override via the item snippet.

@prop {string} collection
@prop {Where<COL>} [where]
@prop {SortBy | SortBy[]} [sortBy]
@prop {string} [groupBy]
@prop {number} [pageSize] - 0 = no pagination
@prop {number} [page] - 1-based
@prop {string} [listClass] - CSS class for <ul>
@prop {string} [groupClass] - CSS class for group wrapper <div>
@snippet item({ record, idx, fieldValues }) - override record rendering (optional — DataFields used by default)
@snippet groupHeader({ key, count }) - renders group section header (optional)
@snippet empty() - renders empty state (optional — "—" shown by default)
@snippet footer({ pagination }) - renders pagination/footer (optional)
-->
<script lang="ts" generics="COL extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { SortBy, Where } from '$lib/types/machine-model.js';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems } from '$lib/data-ui/utils/explorerUtils.js';
	import DataFields from '$lib/data-ui/data/DataFields.svelte';

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
		footer: footerSnippet
	}: {
		collection: string;
		where?: Where<COL>;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		pageSize?: number;
		page?: number;
		listClass?: string;
		groupClass?: string;
		item?: Snippet<[{ record: COL; idx: number; fieldValues: Record<string, unknown> }]>;
		groupHeader?: Snippet<[{ key: string; count: number }]>;
		empty?: Snippet;
		footer?: Snippet<[{ pagination: PaginationInfo }]>;
	} = $props();


	const store = $derived(collection ? machine.store(collection) : { items: [] as COL[] });
	const collLogic = $derived(collection ? safeCollection(collection) : null);
	const indexField = $derived((collLogic?.template?.index ?? 'id') as string);
	const fieldValues = $derived(collLogic?.collectionValues ?? {});
	const defaultSort = $derived(
		collLogic?.defaultSort ?? [{ field: indexField as string, direction: 'asc' as const }]
	);
	const effectiveSort = $derived(sortBy ?? defaultSort);
	const presentationFields = $derived(
		collLogic?.template?.presentation
			? (collLogic.template.presentation as string).split(/\s+/).filter(Boolean)
			: undefined
	);

	function getByPath(obj: unknown, path: string): unknown {
		if (obj == null) return undefined;
		let cur: any = obj;
		for (const seg of path.split('.')) {
			if (cur == null) return undefined;
			cur = cur[seg];
		}
		return cur;
	}

	function renderPresentation(record: Record<string, unknown>): string {
		if (!presentationFields?.length) return '';
		return presentationFields
			.map(tok => {
				const v = getByPath(record, tok);
				return v == null ? '' : String(v);
			})
			.filter(Boolean)
			.join(' ');
	}

	const rawItems = $derived.by(() => {
		if (!store?.items) return [] as COL[];
		if (where) {
			return store.items.filter((item) => {
				for (const [key, val] of Object.entries(where)) {
					if ((item as Record<string, unknown>)[key] !== val) return false;
				}
				return true;
			}) as COL[];
		}
		return store.items as COL[];
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

	const total = $derived(rawItems.length);
	const totalPages = $derived(pageSize > 0 ? Math.ceil(total / pageSize) : 1);
	const pagination = $derived<PaginationInfo>({ page, pageSize, total, totalPages });

	const groups = $derived.by(() => {
		if (!groupBy || !paginatedItems.length) return undefined;
		return groupItems(paginatedItems, groupBy);
	});

	function safeCollection(name: string) {
		try {
			return machine.logic.collection(name);
		} catch {
			return null;
		}
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

<!-- <div class="data-toolbar">
	<div class="mode-switcher">
		<button type="button" class="mode-btn" class:active={currentMode === 'list'}    onclick={() => setMode('list')}>List</button>
		<button type="button" class="mode-btn" class:active={currentMode === 'table'}   onclick={() => setMode('table')}>Table</button>
		<button type="button" class="mode-btn" class:active={currentMode === 'actions'} onclick={() => setMode('actions')}>Actions</button>
	</div>
</div> -->
{#if errorMessage}
	<div class="error-message">{errorMessage}</div>
{:else if groups}
	{#each Array.from(groups) as [key, groupItems] (key)}
		<div class={groupClass ?? 'data-list-group'}>
			{#if groupHeaderSnippet}{@render groupHeaderSnippet({ key, count: groupItems.length })}{/if}
			<ul class={listClass} role="list">
				{#each groupItems as record, idx ((record as Record<string, unknown>)[indexField])}
					{#if itemSnippet}
						{@render itemSnippet({ record: record as COL, idx, fieldValues })}
					{:else if presentationFields?.length}
						<li class="data-list-presentation">{renderPresentation(record as Record<string, unknown>)}</li>
					{:else}
						<li><DataFields collection={collection} data={record as Record<string, unknown>} mode="show" /></li>
					{/if}
				{/each}
			</ul>
		</div>
	{/each}
{:else}
	<ul class={listClass} role="list">
		{#each paginatedItems as record, idx ((record as Record<string, unknown>)[indexField])}
			{#if itemSnippet}
				{@render itemSnippet({ record: record as COL, idx, fieldValues })}
			{:else if presentationFields?.length}
				<li class="data-list-presentation">{renderPresentation(record as Record<string, unknown>)}</li>
			{:else}
				<li><DataFields collection={collection} data={record as Record<string, unknown>} mode="show" /></li>
			{/if}
		{/each}
		{#if !paginatedItems.length}
			{#if emptySnippet}
				{@render emptySnippet()}
			{:else}
				<li class="data-list-empty">—</li>
			{/if}
		{/if}
	</ul>
{/if}
{#if footerSnippet}
	{@render footerSnippet({ pagination })}
{/if}

<style>

.explorer-toolbar {
		display: flex;
		align-items: center;
		padding: 4px 0 8px;
		border-bottom: var(--border-width) solid var(--color-border);
		margin-bottom: var(--gutter-sm);
	}

	.mode-switcher {
		display: flex;
		gap: 2px;
	}
	.error-message {
		color: red;
		padding: 1rem;
	}
	.data-list-group {
		margin-bottom: var(--gutter-md);
	}
	.data-list-empty {
		color: var(--color-text-muted, #888);
		list-style: none;
		padding: var(--gutter-sm, 0.5rem) 0;
	}

	.data-toolbar {
		display: flex;
		align-items: center;
		padding: 4px 0 8px;
		border-bottom: var(--border-width) solid var(--color-border);
		margin-bottom: var(--gutter-sm);
	}

	.mode-switcher { display: flex; gap: 2px; }

	.mode-btn {
		padding: 3px 10px;
		border: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
	}
	.mode-btn.active {
		background: var(--color-primary, #4f46e5);
		color: #fff;
		border-color: transparent;
	}
	.mode-btn:hover:not(.active) { background: var(--color-hover); }
</style>
