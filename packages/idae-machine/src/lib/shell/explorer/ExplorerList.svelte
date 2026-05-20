<!--
ExplorerList.svelte
Collection record list — composes DataList for data, renders grid/list UI.
@role explorer-list
@prop {string} collection - Collection name
@prop {Record<string,unknown>} [where] - Query filter
@prop {string} [displayMode] - Display mode (line|grid)
@prop {string} [target] - HTML target zone for card open
@prop {SortBy | SortBy[]} [sortBy] - Sort specification
@prop {string} [groupBy] - Group by field name
@prop {number} [pageSize] - Items per page
@prop {(data: COL, index: number | string) => void} [onclick] - Item click handler
-->
<script lang="ts" generics="COL = Record<string, any>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import DataFields from '$lib/data-ui/data/DataFields.svelte';
	import type { SortBy } from './explorerUtils.js';
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		target,
		where,
		sortBy,
		groupBy,
		pageSize = 20,
		onclick,
		displayMode = 'grid'
	}: {
		collection: string;
		target?: string;
		where?: Record<string, unknown>;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		pageSize?: number;
		onclick?: (data: COL, index: number | string) => void;
		displayMode?: 'line' | 'grid';
	} = $props();

	let currentPage = $state(1);

	function openCrud(id: string | number) {
		machine.loadIn('card.form', target ?? 'main', collection, String(id));
	}

	const _onclick = (data: COL, idx: number | string) => {
		if (onclick) {
			onclick(data, idx);
		} else {
			openCrud((data as any).id ?? idx);
		}
	};

	function goToPage(page: number) {
		currentPage = page;
	}
</script>

<DataList {collection} {where} {sortBy} {groupBy} {pageSize} page={currentPage}>
	{#snippet children({ items, index, pagination, groups })}
		{#if groups}
			{#each Array.from(groups) as [groupKey, groupItemList] (groupKey)}
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
								onclick={() => _onclick(item as COL, item[index])}
								onkeydown={(e) => e.key === 'Enter' && _onclick(item as COL, item[index])}
							>
								<div class="list-item-content">
									<DataFields {collection} data={item} mode="show" />
								</div>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		{:else}
			<ul class="list list-grid" role="list" style="--list-grid-min: 200px;">
				{#each items as item (item[index])}
					<li
						class="list-item panel panel-bordered"
						role="button"
						tabindex="0"
						onclick={() => _onclick(item, item[index])}
						onkeydown={(e) => e.key === 'Enter' && _onclick(item, item[index])}
					>
						<div class="list-item-content">
							<DataFields {collection} data={item} mode="show" />
						</div>
					</li>
				{/each}
			</ul>

			{#if items.length === 0}
				<div class="empty-state">
					<div class="empty-state-icon">📭</div>
					<p class="empty-state-title">No records</p>
					<p class="empty-state-text">This collection is empty.</p>
				</div>
			{/if}
		{/if}

		{#if pagination.totalPages > 1}
			<nav class="pagination" aria-label="Pagination">
				<button
					class="btn btn-sm"
					disabled={pagination.page === 1}
					onclick={() => goToPage(pagination.page - 1)}
					aria-label="Previous page"
				>‹ Prev</button>
				<span class="pagination-info">
					Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
				</span>
				<button
					class="btn btn-sm"
					disabled={pagination.page === pagination.totalPages}
					onclick={() => goToPage(pagination.page + 1)}
					aria-label="Next page"
				>Next ›</button>
			</nav>
		{/if}
	{/snippet}
</DataList>

<style>
	.explorer-group { margin-bottom: var(--gutter-md); }
</style>
