<!--
ExplorerContent.svelte
Bare collection body — DataList (list/table/grid) or Columner (column) view.
Loadable into an Explorer zone via loadIn (sidebar collection click).
@role explorer.content
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import { untrack } from 'svelte';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import Columner from '$lib/shell/columner/Columner.svelte';
	import type { SortBy, Where } from '$lib/types/index.js';

	type ViewMode = 'list' | 'table' | 'grid' | 'column';

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

	let viewMode = $state<ViewMode>(untrack(() => modeProp));
</script>

<explorer-content>
	<explorer-toolbar>
		<button class:active={viewMode === 'list'}   onclick={() => (viewMode = 'list')}   title="List">☰</button>
		<button class:active={viewMode === 'table'}  onclick={() => (viewMode = 'table')}  title="Table">⊞</button>
		<button class:active={viewMode === 'grid'}   onclick={() => (viewMode = 'grid')}   title="Grid">⊟</button>
		<button class:active={viewMode === 'column'} onclick={() => (viewMode = 'column')} title="Column">⫴</button>
	</explorer-toolbar>

	<explorer-body>
		{#if viewMode === 'column'}
			<Columner
				{collection}
				componentProps={{ link: 'loadIn:record', listClass: 'list list-grid', groupClass: 'explorer-group' }}
			/>
		{:else}
			<DataList
				{collection}
				{where}
				{sortBy}
				{groupBy}
				{pageSize}
				mode={viewMode}
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
		{/if}
	</explorer-body>
</explorer-content>

<style>
	explorer-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	explorer-toolbar {
		display: flex;
		gap: 2px;
		padding: 4px 8px;
		border-bottom: 1px solid var(--sl-color-neutral-200, #e0e0e0);
		background: var(--sl-color-neutral-50, #f5f5f5);
		flex-shrink: 0;
	}

	explorer-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
		font-size: 16px;
		color: var(--sl-color-neutral-600, #666);
		transition: background-color 0.15s;
	}

	button:hover {
		background: var(--sl-color-neutral-200, #e0e0e0);
	}

	button.active {
		background: var(--sl-color-primary-100, #e3f2fd);
		color: var(--sl-color-primary-600, #1976d2);
	}

	:global(.explorer-group) {
		margin-bottom: var(--gutter-md);
	}
</style>
