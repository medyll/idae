<!--
Explorer.svelte
Unified collection browser — single component replacing ExplorerList/Table/Card/Actions.
@role explorer
@prop {string} collection - Collection name
@prop {'list' | 'table' | 'card' | 'actions'} [mode] - Display mode (default: 'list')
@prop {string} [collectionId] - Record ID for card mode
@prop {string} [dataId] - Alias for collectionId (Frame compatibility)
@prop {Record<string, string>} [vars] - Additional vars (e.g. { mode: 'list' })
@prop {Record<string, unknown>} [where] - Query filter
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import DataFields from '$lib/data-ui/data/DataFields.svelte';
	import CardForm from '$lib/shell/card/CardForm.svelte';
	import ExplorerTableInline from './ExplorerTableInline.svelte';
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		mode = 'list',
		collectionId,
		dataId,
		vars,
		where,
	}: {
		collection: string;
		mode?: 'list' | 'table' | 'card' | 'actions';
		collectionId?: string;
		dataId?: string;
		vars?: Record<string, string>;
		where?: Record<string, unknown>;
	} = $props();

	const effectiveId = $derived(collectionId ?? dataId);
	let currentPage = $state(1);

	// _views accessor with fallback to template.presentation
	const scheme = $derived(collection ? machine.logic.collection(collection) : null);
	const views = $derived(scheme?.views ?? {});
	const tplPresentation = $derived(
		scheme?.template?.presentation?.split(' ').filter(Boolean) ?? []
	);

	const listFields = $derived(
		(views.listView ?? []).map(f => f.name).length
			? (views.listView ?? []).map(f => f.name)
			: tplPresentation
	);

	const miniFields = $derived(
		(views.miniView ?? []).map(f => f.name).length
			? (views.miniView ?? []).map(f => f.name)
			: tplPresentation.slice(0, 2)
	);

	const actionLabel = $derived(
		(views.miniView ?? [])[0]?.name ?? tplPresentation[0] ?? 'id'
	);

	function goToPage(page: number): void {
		currentPage = page;
	}

	function openCard(record: COL): void {
		const id = (record as Record<string, unknown>).id ?? (record as Record<string, unknown>)._id;
		machine.loadFrame('explorer', collection, String(id), { mode: 'card' });
	}

	function getFieldValue(item: Record<string, unknown>, fieldName: string): unknown {
		return item[fieldName];
	}
</script>

{#if mode === 'card'}
	<CardForm {collection} dataId={effectiveId} mode="update" />
{:else if mode === 'actions'}
	<DataList {collection} {where}>
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
						{getFieldValue(item, actionLabel) ?? String(idx)}
					</li>
				{/each}
			</ul>
		{/snippet}
	</DataList>
{:else if mode === 'table'}
	<ExplorerTableInline {collection} {where} {openCard} />
{:else}
	<!-- mode === 'list' (default) -->
	<DataList {collection} {where} pageSize={20} page={currentPage}>
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
										{#if listFields.length > 0}
											{#each listFields as fieldName}
												<div class="field-row">
													<span class="field-label">{fieldName.replace(/_/g, ' ')}:</span>
													<span class="field-value">{getFieldValue(item, fieldName)}</span>
												</div>
											{/each}
										{:else}
											<DataFields {collection} data={item} mode="show" />
										{/if}
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
								{#if listFields.length > 0}
									{#each listFields as fieldName}
										<div class="field-row">
											<span class="field-label">{fieldName.replace(/_/g, ' ')}:</span>
											<span class="field-value">{getFieldValue(item, fieldName)}</span>
										</div>
									{/each}
								{:else}
									<DataFields {collection} data={item} mode="show" />
								{/if}
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
	.explorer-group { margin-bottom: var(--gutter-md); }

	.field-row {
		display: flex;
		gap: var(--gutter-sm);
		padding: 2px 0;
	}
	.field-label {
		font-weight: var(--font-medium, 500);
		color: var(--color-text-muted, #666);
		min-width: 80px;
		text-transform: capitalize;
	}
	.field-value {
		flex: 1;
	}

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
	.action-item:hover {
		background: var(--color-surface-hover, #f0f0f0);
	}
</style>
