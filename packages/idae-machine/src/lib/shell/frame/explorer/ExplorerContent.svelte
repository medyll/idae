<!--
ExplorerContent.svelte
Bare collection body — DataList (list/table/grid) or Columner (column) view.
Loadable into an Explorer zone via loadIn (sidebar collection click).
@role explorer.content
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import { untrack } from 'svelte';
	import Icon from '@iconify/svelte';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import DataToolbar from '$lib/data-ui/controls/DataToolbar.svelte';
	import Find from '$lib/data-ui/controls/Find.svelte';
	import Group from '$lib/data-ui/controls/Group.svelte';
	import ListMode from '$lib/data-ui/controls/ListMode.svelte';
	import Sort from '$lib/data-ui/controls/Sort.svelte';
	import Columner from '$lib/shell/layout/Columner.svelte';
	import type { SortBy, Where } from '$lib/types/index.js';

	type ViewMode = 'list' | 'table' | 'grid' | 'column' | 'accordion';

	let {
		collection,
		mode: modeProp = 'list',
		where,
		sortBy,
		groupBy,
		pageSize = 20
	}: {
		collection: string;
		mode?: ViewMode;
		where?: Where<COL>;
		sortBy?: SortBy;
		groupBy?: string;
		pageSize?: number;
	} = $props();

	let columnMode = $state(untrack(() => modeProp === 'column'));
	const listModeProp = $derived(modeProp === 'column' ? 'list' : modeProp);
</script>

<explorer-content>
	<DataToolbar>
		{#snippet find()}<Find {collection} advanced />{/snippet}
		{#snippet sort()}<Sort {collection} />{/snippet}
		{#snippet group()}<Group {collection} />{/snippet}
		{#snippet extras()}
			<ListMode {collection} onModeChange={() => (columnMode = false)} />
			<button
				type="button"
				class="btn-icon"
				class:active={columnMode}
				aria-label="Column view"
				aria-pressed={columnMode}
				onclick={() => (columnMode = !columnMode)}
			>
				<Icon icon="ph:columns" />
			</button>
		{/snippet}
	</DataToolbar>

	<explorer-body>
		{#if columnMode}
			<Columner
				{collection}
				componentProps={{
					link: 'loadIn:record',
					listClass: 'list list-grid',
					groupClass: 'explorer-group'
				}}
			/>
		{:else}
			<DataList
				{collection}
				{where}
				{sortBy}
				{groupBy}
				{pageSize}
				mode={listModeProp}
				link="loadInDialog:fiche"
				listClass="list list-grid"
				groupClass="explorer-group"
			>
				{#snippet dataListHeader({ key })}
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
	@layer components {
		explorer-content {
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: hidden;
		}

		explorer-body {
			display: flex;
			flex: 1;
			min-height: 0;
			overflow: hidden;
		}

		.btn-icon.active {
			background: var(--color-surface-active);
			color: var(--color-primary);
		}

		:global(.explorer-group) {
			margin-bottom: var(--gutter-md);
		}
	}
</style>
