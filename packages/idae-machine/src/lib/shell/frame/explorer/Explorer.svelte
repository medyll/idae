<!--
Explorer.svelte
Unified collection browser — list/table/card/actions modes.
@role explorer
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import DataFields from '$lib/data-ui/data/DataFields.svelte';
	import DataForm from '$lib/data-ui/data/DataForm.svelte';
	import ExplorerTableInline from './ExplorerTableInline.svelte';
	import TemplateShell from '$lib/shell/layout/TemplateShell.svelte';
	import { machine } from '$lib/main/machine.js';
	import type { SortBy } from '$lib/types/machine-model.js';

	type Mode = 'list' | 'table' | 'card' | 'actions';

	let {
		collection,
		mode: modeProp = 'list',
		collectionId,
		dataId,
		where,
		sortBy,
		groupBy,
		pageSize = 20,
	}: {
		collection:    string;
		mode?:         Mode;
		collectionId?: string;
		dataId?:       string;
		where?:        Record<string, unknown>;
		sortBy?:       SortBy;
		groupBy?:      string;
		pageSize?:     number;
	} = $props();

	let userMode      = $state<Mode | null>(null);
	let currentPage   = $state(1);
	const currentMode = $derived(userMode ?? modeProp);

	const scheme          = $derived(collection ? machine.logic.collection(collection) : null);
	const views           = $derived(scheme?.views ?? {});
	const tplPresentation = $derived(scheme?.template?.presentation?.split(' ').filter(Boolean) ?? []);

	const listFields = $derived(
		(views.listView ?? []).map((f: { name: string }) => f.name).length
			? (views.listView ?? []).map((f: { name: string }) => f.name)
			: tplPresentation
	);
	const actionLabel = $derived((views.miniView ?? [])[0]?.name ?? tplPresentation[0] ?? 'id');

	function setMode(m: Mode): void { userMode = m; currentPage = 1; }
	function goToPage(p: number): void { currentPage = p; }

	function openCard(record: COL): void {
		const id = (record as Record<string, unknown>).id ?? (record as Record<string, unknown>)._id;
		machine.loadFrame('explorer', collection, String(id), { mode: 'card' });
	}
</script>

<TemplateShell>
	{#snippet children()}
{#if currentMode !== 'card'}
	<div class="explorer-toolbar">
		<div class="mode-switcher">
			<button type="button" class="mode-btn" class:active={currentMode === 'list'}    onclick={() => setMode('list')}>List</button>
			<button type="button" class="mode-btn" class:active={currentMode === 'table'}   onclick={() => setMode('table')}>Table</button>
			<button type="button" class="mode-btn" class:active={currentMode === 'actions'} onclick={() => setMode('actions')}>Actions</button>
		</div>
	</div>
{/if}

{#if currentMode === 'card'}
	<DataForm {collection} dataId={collectionId ?? dataId} mode="update" />

{:else if currentMode === 'actions'}
	<DataList {collection} {where} listClass="action-list">
		{#snippet item({ record, idx })}
			<li>
				<button
					type="button"
					class="action-item"
					onclick={() => openCard(record as COL)}
				>
					{(record as Record<string, unknown>)[actionLabel] ?? String(idx)}
				</button>
			</li>
		{/snippet}
	</DataList>

{:else if currentMode === 'table'}
	<ExplorerTableInline {collection} {where} {openCard} />

{:else}
	<!-- mode === 'list' -->
	<DataList
		{collection}
		{where}
		{sortBy}
		{groupBy}
		{pageSize}
		page={currentPage}
		listClass="list list-grid"
		groupClass="explorer-group"
	>
		{#snippet groupHeader({ key })}
			<header class="section-header section-header-bordered">
				<h3>{key}</h3>
			</header>
		{/snippet}

		{#snippet item({ record })}
			<li class="list-item panel panel-bordered">
				<button
					type="button"
					class="list-item-button"
					onclick={() => openCard(record as COL)}
				>
					<div class="list-item-content">
						<DataFields {collection} data={record as Record<string, any>} mode="show" showFields={listFields.length ? listFields : undefined} />
					</div>
				</button>
			</li>
		{/snippet}

		{#snippet empty()}
			<div class="empty-state">
				<div class="empty-state-icon">📭</div>
				<p class="empty-state-title">No records</p>
				<p class="empty-state-text">This collection is empty.</p>
			</div>
		{/snippet}

		{#snippet footer({ pagination })}
			{#if pagination.totalPages > 1}
				<nav class="pagination" aria-label="Pagination">
					<button class="btn btn-sm" disabled={pagination.page === 1} onclick={() => goToPage(pagination.page - 1)} aria-label="Previous page">‹ Prev</button>
					<span class="pagination-info">Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)</span>
					<button class="btn btn-sm" disabled={pagination.page === pagination.totalPages} onclick={() => goToPage(pagination.page + 1)} aria-label="Next page">Next ›</button>
				</nav>
			{/if}
		{/snippet}
	</DataList>
{/if}
	{/snippet}
</TemplateShell>

<style>
	.explorer-toolbar {
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

	:global(.explorer-group) { margin-bottom: var(--gutter-md); }

	:global(.action-list) {
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
		background: transparent;
		border: none;
		text-align: left;
		width: 100%;
		font: inherit;
		color: inherit;
	}
	.action-item:hover { background: var(--color-surface-hover, #f0f0f0); }

	.list-item-button {
		all: unset;
		display: block;
		width: 100%;
		cursor: pointer;
	}
</style>
