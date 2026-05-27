<!--
Explorer.svelte
Unified collection browser — thin wrapper around DataList with TemplateShell layout.
@role explorer
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import DataForm from '$lib/data-ui/data/DataForm.svelte';
	import TemplateShell from '$lib/shell/layout/TemplateShell.svelte';
	import { machine } from '$lib/main/machine.js';
	import type { SortBy, Where } from '$lib/types/index.js';

	let {
		collection,
		mode: modeProp = 'list',
		collectionId,
		dataId,
		where,
		sortBy,
		groupBy,
		pageSize = 20
	}: {
		collection: string;
		mode?: 'list' | 'table' | 'grid';
		collectionId?: string;
		dataId?: string;
		where?: Where<COL>;
		sortBy?: SortBy;
		groupBy?: string;
		pageSize?: number;
	} = $props();

	function openCard(record: COL): void {
		const id = (record as Record<string, unknown>).id ?? (record as Record<string, unknown>)._id;
		machine.framer.loadFrame('explorer', collection, String(id), { mode: 'grid' });
	}
</script>

<TemplateShell>
	{#snippet leftbar()}
		<DataList collection="appscheme" {sortBy} link="loadFrame:explorer" linkCollectionField="code" />
	{/snippet}
	{#snippet children()}
		{#if collectionId || dataId}
			<DataForm {collection} dataId={collectionId ?? dataId} mode="update" />
		{:else}
			<DataList
				{collection}
				{where}
				{sortBy}
				{groupBy}
				{pageSize}
				mode={modeProp}
				onItemClick={(record) => openCard(record as COL)}
				listClass="list list-grid"
				groupClass="explorer-group"
			>
				{#snippet groupHeader({ key })}
					<header class="section-header section-header-bordered">
						<h3>{key}</h3>
					</header>
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
							<button
								class="btn btn-sm"
								disabled={pagination.page === 1}
								onclick={() => { /* DataList handles internal page state for now */ }}
								aria-label="Previous page">‹ Prev</button
							>
							<span class="pagination-info"
								>Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)</span
							>
							<button
								class="btn btn-sm"
								disabled={pagination.page === pagination.totalPages}
								onclick={() => { /* DataList handles internal page state for now */ }}
								aria-label="Next page">Next ›</button
							>
						</nav>
					{/if}
				{/snippet}
			</DataList>
		{/if}
	{/snippet}
</TemplateShell>

<style>
	:global(.explorer-group) {
		margin-bottom: var(--gutter-md);
	}
</style>
