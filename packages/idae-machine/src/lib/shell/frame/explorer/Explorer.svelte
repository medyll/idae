<!--
Explorer.svelte
Unified collection browser — single component replacing ExplorerList/Table/Card/Actions.
@role explorer
@prop {string} collection - Collection name
@prop {'list' | 'table' | 'card' | 'actions'} [mode] - Display mode (default: 'list')
@prop {string} [collectionId] - Record ID for card mode
@prop {string} [dataId] - Alias for collectionId (Frame compatibility)
@prop {Record<string, string>} [vars] - Config vars: mode, sortBy, groupBy, pageSize, where
@prop {Record<string, unknown>} [where] - Query filter (prop takes precedence over vars.where)
@prop {{ field: string; direction?: string }} [sortBy] - Sort config
@prop {string} [groupBy] - Group by field name
@prop {number} [pageSize] - Records per page (default 20)
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import DataFields from '$lib/data-ui/data/DataFields.svelte';
	import DataForm from '$lib/data-ui/data/DataForm.svelte';
	import ExplorerTableInline from './ExplorerTableInline.svelte';
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		mode: modeProp = 'list',
		collectionId,
		dataId,
		vars,
		where: whereProp,
		sortBy: sortByProp,
		groupBy: groupByProp,
		pageSize: pageSizeProp,
	}: {
		collection: string;
		mode?: 'list' | 'table' | 'card' | 'actions';
		collectionId?: string;
		dataId?: string;
		vars?: Record<string, string>;
		where?: Record<string, unknown>;
		sortBy?: { field: string; direction?: 'asc' | 'desc' };
		groupBy?: string;
		pageSize?: number;
	} = $props();

	const effectiveId  = $derived(collectionId ?? dataId);
	let currentMode    = $state<'list' | 'table' | 'card' | 'actions'>(modeProp);
	let currentPage    = $state(1);

	const effectiveWhere    = $derived(whereProp ?? undefined);
	const effectiveSortBy   = $derived(sortByProp ? { field: sortByProp.field, direction: sortByProp.direction ?? 'asc' as const } : undefined);
	const effectiveGroupBy  = $derived(groupByProp ?? undefined);
	const effectivePageSize = $derived(pageSizeProp ?? 20);

	// _views accessor with fallback to template.presentation
	const scheme          = $derived(collection ? machine.logic.collection(collection) : null);
	const views           = $derived(scheme?.views ?? {});
	const tplPresentation = $derived(scheme?.template?.presentation?.split(' ').filter(Boolean) ?? []);

	const listFields = $derived(
		(views.listView ?? []).map(f => f.name).length
			? (views.listView ?? []).map(f => f.name)
			: tplPresentation
	);
	const miniFields  = $derived(
		(views.miniView ?? []).map(f => f.name).length
			? (views.miniView ?? []).map(f => f.name)
			: tplPresentation.slice(0, 2)
	);
	const actionLabel = $derived((views.miniView ?? [])[0]?.name ?? tplPresentation[0] ?? 'id');

	function goToPage(page: number): void { currentPage = page; }

	function openCard(record: COL): void {
		const id = (record as Record<string, unknown>).id ?? (record as Record<string, unknown>)._id;
		machine.loadFrame('explorer', collection, String(id), { mode: 'card' });
	}
</script>

<!-- Mode switcher toolbar (hidden in card mode) -->
{#if currentMode !== 'card'}
	<div class="explorer-toolbar">
		<div class="mode-switcher">
			<button
				type="button"
				class="mode-btn"
				class:active={currentMode === 'list'}
				onclick={() => { currentMode = 'list'; currentPage = 1; }}
			>List</button>
			<button
				type="button"
				class="mode-btn"
				class:active={currentMode === 'table'}
				onclick={() => { currentMode = 'table'; currentPage = 1; }}
			>Table</button>
			<button
				type="button"
				class="mode-btn"
				class:active={currentMode === 'actions'}
				onclick={() => { currentMode = 'actions'; currentPage = 1; }}
			>Actions</button>
		</div>
	</div>
{/if}

{#if currentMode === 'card'}
	<DataForm {collection} dataId={effectiveId} mode="update" />
{:else if currentMode === 'actions'}
	<DataList {collection} where={effectiveWhere}>
		{#snippet children({ items })}
			<ul class="action-list" role="list">
				{#each items as item, idx}
					<li
						class="action-item"
						role="button"
						tabindex="0"
						onclick={() => openCard(item as COL)}
						onkeydown={(e) => e.key === 'Enter' && openCard(item as COL)}
					>
						{(item as Record<string, unknown>)[actionLabel] ?? String(idx)}
					</li>
				{/each}
			</ul>
		{/snippet}
	</DataList>
{:else if currentMode === 'table'}
	<ExplorerTableInline {collection} where={effectiveWhere} {openCard} />
{:else}
	<!-- mode === 'list' -->
	<DataList
		{collection}
		where={effectiveWhere}
		sortBy={effectiveSortBy}
		groupBy={effectiveGroupBy}
		pageSize={effectivePageSize}
		page={currentPage}
	>
		{#snippet children({ items, index, pagination, groups })}
			{#if groups}
				{#each Array.from(groups) as [groupKey, groupItemList] (groupKey)}
					<section class="explorer-group">
						<header class="section-header section-header-bordered">
							<h3>{groupKey}</h3>
						</header>
						<ul class="list list-grid" role="list" style="--list-grid-min: 200px;">
							{#each groupItemList as item ((item as Record<string, unknown>)[index])}
								<li
									class="list-item panel panel-bordered"
									role="button"
									tabindex="0"
									onclick={() => openCard(item as COL)}
									onkeydown={(e) => e.key === 'Enter' && openCard(item as COL)}
								>
									<div class="list-item-content">
										<DataFields {collection} data={item as Record<string, any>} mode="show" showFields={listFields.length ? listFields : undefined} />
									</div>
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			{:else}
				<ul class="list list-grid" role="list" style="--list-grid-min: 200px;">
					{#each items as item ((item as Record<string, unknown>)[index])}
						<li
							class="list-item panel panel-bordered"
							role="button"
							tabindex="0"
							onclick={() => openCard(item as COL)}
							onkeydown={(e) => e.key === 'Enter' && openCard(item as COL)}
						>
							<div class="list-item-content">
								<DataFields {collection} data={item as Record<string, any>} mode="show" showFields={listFields.length ? listFields : undefined} />
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

	.mode-btn:hover:not(.active) {
		background: var(--color-hover);
	}

	.explorer-group { margin-bottom: var(--gutter-md); }

	.action-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	.action-item {
		padding: 0.4rem 0.75rem;
		cursor: pointer;
		border-radius: 0.25rem;
	}
	.action-item:hover { background: var(--color-surface-hover, #f0f0f0); }
</style>
