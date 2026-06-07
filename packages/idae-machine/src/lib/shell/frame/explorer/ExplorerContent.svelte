<!--
ExplorerContent.svelte
Bare collection body — DataList only, no shell/sidebar.
Loadable into an Explorer zone via loadIn (sidebar collection click).
@role explorer.content
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
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


</script>

<DataList
	{collection}
	{where}
	{sortBy}
	{groupBy}
	{pageSize}
	mode={modeProp}
	link="loadInDialog:fiche"
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

<style>
	:global(.explorer-group) {
		margin-bottom: var(--gutter-md);
	}
</style>
