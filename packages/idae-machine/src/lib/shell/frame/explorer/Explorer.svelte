<!--
Explorer.svelte
Unified collection browser — thin wrapper around DataList with TemplateShell layout.
@role explorer
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import TemplateShell from '$lib/shell/layout/TemplateShell.svelte';
	import { machine } from '$lib/main/machine.js';
	import type { SortBy, Where } from '$lib/types/index.js';

	let {
		collection,
		mode: modeProp = 'list',
		where,
		sortBy,
		groupBy,
		pageSize = 20
	}: {
		collection: string;
		mode?: 'list' | 'table' | 'grid';
		where?: Where<COL>;
		sortBy?: SortBy;
		groupBy?: string;
		pageSize?: number;
	} = $props();

	function openCard(record: COL): void {
		const id = (record as Record<string, unknown>).id ?? (record as Record<string, unknown>)._id;
		void machine.framer.loadInDialog('card.form', collection, String(id));
	}
</script>

<TemplateShell>
	{#snippet leftbar()}
		<DataList collection="appscheme" {sortBy} link="loadFrame:explorer" linkCollectionField="code" />
	{/snippet}
	{#snippet children()}
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
		</DataList>
	{/snippet}
</TemplateShell>

<style>
	:global(.explorer-group) {
		margin-bottom: var(--gutter-md);
	}
</style>
