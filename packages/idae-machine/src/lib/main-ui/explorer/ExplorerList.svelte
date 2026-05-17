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
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/qoolie';
	import { machine } from '$lib/main/machine.js';
	import CardFields from '$lib/main-ui/card/CardFields.svelte';

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
	}
	let {
		collection,
		target,
		onclick,
		where,
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
	let index = $derived(safeCollection(collection)?.template?.index ?? '');
	let allItems = $derived(where ? store[collection]?.where(where) : store[collection]?.getAll() ?? []);
	let totalCount = $derived(allItems.length);
	let totalPages = $derived(Math.max(1, Math.ceil(totalCount / pageSize)));
	let paginatedItems = $derived(
		allItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

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
	<p class="explorer-error">{errorMessage}</p>
{/if}

<ul class="explorer-list" role="list">
	{#each paginatedItems as item, idx (item[index])}
		<li
			class="explorer-item"
			role="button"
			tabindex="0"
			onclick={() => _onclick(item, idx)}
			onkeydown={(e) => e.key === 'Enter' && _onclick(item, idx)}
		>
			<CardFields collection={collection} data={item} mode="show" />
		</li>
	{/each}
</ul>

{#if totalPages > 1}
	<nav class="pagination" aria-label="Pagination">
		<button
			class="pagination-btn"
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
			class="pagination-btn"
			disabled={currentPage === totalPages}
			onclick={() => goToPage(currentPage + 1)}
			aria-label="Next page"
		>
			Next ›
		</button>
	</nav>
{/if}

<style>
	.explorer-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.75rem;
	}
	.explorer-item {
		padding: 0.5rem;
		border: 1px solid var(--color-border, #e0e0e0);
		border-radius: 0.5rem;
		cursor: pointer;
	}
	.explorer-item:hover { background: var(--color-surface-hover, #f5f5f5); }
	.explorer-error { color: var(--color-error, red); font-size: 0.85em; }

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 1rem 0;
		margin-top: 0.5rem;
		border-top: 1px solid var(--color-border, #e0e0e0);
	}

	.pagination-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border, #e0e0e0);
		border-radius: 0.375rem;
		background: var(--color-surface, #fff);
		cursor: pointer;
		font-size: 0.875rem;
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--color-surface-hover, #f5f5f5);
	}

	.pagination-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.pagination-info {
		font-size: 0.8125rem;
		color: var(--color-text-muted, #6b7280);
	}
</style>
