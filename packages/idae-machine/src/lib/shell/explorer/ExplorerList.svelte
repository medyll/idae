<!--
ExplorerList.svelte
Collection record list with machine store binding.
@role explorer-list
@prop {string} collection - Collection name
@prop {object} [where] - Query filter
@prop {string} [displayMode] - Display mode (line|grid)
@prop {string} [target] - HTML target zone for card open
@slot children (let:item) - Custom item rendering
@event onclick - Emitted on item click
-->
	<script lang="ts" generics="COL = Record<string,any>">
	import CardForm from '\$lib/shell/card/CardForm.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/qoolie';
	import { machine } from '$lib/main/machine.js';
	import { signals } from '$lib/main/machineSignals.svelte.js';
	import CardFields from '\$lib/shell/card/CardFields.svelte';
	import type { SortBy } from './explorerUtils.js';
	import { sortItems, groupItems } from './explorerUtils.js';

	interface ExplorerListProps  {
		collection:     string;
		target?:        string;
		data?:          COL;
		menuListProps?: Record<string, unknown>;
		style?:         string;
		displayMode?:   'line' | 'grid';
		where?:         Where<COL>;
		children?:      any;
		onclick?:       (data: COL, index: number | string) => void;
		sortBy?:        SortBy | SortBy[];
		groupBy?:       string;
	}
	let {
		collection,
		target,
		onclick,
		where,
		sortBy,
		groupBy,
		children: _children,
		pageSize = 20,
	}:ExplorerListProps & { pageSize?: number } = $props();

	let logic = machine.logic;
	let store = machine.store;
	let errorMessage = $state<string | null>(null);
	let currentPage = $state(1);

	function safeCollection(name: string) {
		try {
			return logic.collection(name);
		} catch (e) {
			return null;
		}
	}

	let fieldValues = $derived(safeCollection(collection)?.collectionValues ?? {});
	let index = $derived(
		safeCollection(collection)?.template?.index ||
		safeCollection(collection)?.index ||
		'id'
	);
	let rawItems = $derived((() => {
		void signals.dataVersion; // track global data version → re-run after writes
		return where ? store[collection]?.where(where) : store[collection]?.getAll() ?? [];
	})());
	let allItems = $derived(
		sortBy
			? sortItems(rawItems, sortBy)
			: (logic.collection(collection)?.defaultSort?.length
				? sortItems(rawItems, logic.collection(collection).defaultSort)
				: rawItems)
	);
	let totalCount = $derived(allItems.length);
	let totalPages = $derived(Math.max(1, Math.ceil(totalCount / pageSize)));
	let paginatedItems = $derived(
		allItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);
	let groupedItems = $derived(groupBy ? groupItems(paginatedItems, groupBy) : null);

	$effect(() => {
		if (!safeCollection(collection)) {
			const msg = `Collection '${collection}' non trouvée dans le schéma`;
			errorMessage = `${msg}. Vérifiez que le schéma est à jour ou videz IndexedDB (ex: effacer la base dans l'inspecteur du navigateur).`;
		} else {
			errorMessage = null;
		}
	});

	// Reset to page 1 when collection or where changes
	$effect(() => {
		void collection;
		void where;
		currentPage = 1;
	});

	$inspect('ExplorerList', { collection, totalCount, currentPage, totalPages });

	function load(item: COL, indexV: number | string) {
		openCrud((item as any)[index]);
	}

	function openCrud(id: string | number) {
		let mounted = hydrate(CardForm, {
			target: document.querySelector(`[data-target-zone="${target}"]`) as Element,
			props:  { collection: collection, dataId: id, mode: 'show' }
		});

		return mounted;
	}

	const _onclick = (data: COL, idx: number | string) => {
		if (onclick) {
			onclick(data, idx);
		} else {
			load(data, idx);
		}
	};

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) currentPage = page;
	}
</script>

{#if errorMessage}
	<div class="alert alert-error">{errorMessage}</div>
{/if}

{#if groupedItems}
	{#each Array.from(groupedItems) as [groupKey, groupItemList] (groupKey)}
		<section class="explorer-group">
			<header class="section-header section-header-bordered">
				<h3>{groupKey}</h3>
			</header>
			<ul class="list list-grid" role="list" style="--list-grid-min: 200px;">
				{#each groupItemList as item (item[index])}
					<li
						class="list-item panel panel-bordered"
						role="button"
						tabindex="0"
						onclick={() => _onclick(item, item[index])}
						onkeydown={(e) => e.key === 'Enter' && _onclick(item, item[index])}
					>
						<div class="list-item-content">
							<CardFields collection={collection} data={item} mode="show" />
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
{:else}
	<ul class="list list-grid" role="list" style="--list-grid-min: 200px;">
		{#each paginatedItems as item, idx (item[index])}
			<li
				class="list-item panel panel-bordered"
				role="button"
				tabindex="0"
				onclick={() => _onclick(item, idx)}
				onkeydown={(e) => e.key === 'Enter' && _onclick(item, idx)}
			>
				<div class="list-item-content">
					<CardFields collection={collection} data={item} mode="show" />
				</div>
			</li>
		{/each}
	</ul>

	{#if paginatedItems.length === 0 && !errorMessage}
		<div class="empty-state">
			<div class="empty-state-icon">📭</div>
			<p class="empty-state-title">No records</p>
			<p class="empty-state-text">This collection is empty.</p>
		</div>
	{/if}
{/if}

{#if totalPages > 1}
	<nav class="pagination" aria-label="Pagination">
		<button
			class="btn btn-sm"
			disabled={currentPage === 1}
			onclick={() => goToPage(currentPage - 1)}
			aria-label="Previous page"
		>
			‹ Prev
		</button>
		<span class="pagination-info">
			Page {currentPage} of {totalPages} ({totalCount} items)
		</span>
		<button
			class="btn btn-sm"
			disabled={currentPage === totalPages}
			onclick={() => goToPage(currentPage + 1)}
			aria-label="Next page"
		>
			Next ›
		</button>
	</nav>
{/if}

<style>
	.explorer-group { margin-bottom: var(--gutter-md); }
</style>
