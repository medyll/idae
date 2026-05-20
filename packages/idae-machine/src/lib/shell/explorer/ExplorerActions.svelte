<!--
ExplorerActions.svelte
Menu list of collection records — composes DataList for data, supports data prop override.
@role explorer-menu
@prop {string} collection - Collection name
@prop {COL[]} [data] - Data array override (if provided, skips fetch)
@prop {string} [target] - HTML target zone
@prop {Record<string,unknown>} [where] - Query filter
@prop {SortBy} [sortBy] - Sort specification
@prop {(event: CustomEvent, index: number) => void} [onclick] - Click handler
-->
<script lang="ts" generics="COL = Record<string, any>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import type { Where } from '@medyll/qoolie';
	import type { SortBy } from './explorerUtils.js';
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		target,
		data: dataOverride,
		where,
		sortBy,
		onclick
	}: {
		collection: string;
		target?: string;
		data?: COL[];
		where?: Where<COL>;
		sortBy?: SortBy;
		onclick?: (event: CustomEvent, index: number) => void;
	} = $props();

	function openCrud(id: string | number) {
		machine.loadIn('card.form', target ?? 'main', collection, String(id));
	}

	function load(_event: any, indexV: number, item: COL) {
		if (onclick) {
			onclick(_event, indexV);
		} else {
			openCrud((item as any).id ?? indexV);
		}
	}
</script>

{#if dataOverride}
	<ul class="action-list" role="list">
		{#each dataOverride as item, idx}
			<li
				class="action-item"
				role="button"
				tabindex="0"
				onclick={(e) => load(e, idx, item)}
				onkeydown={(e) => e.key === 'Enter' && load(e, idx, item)}
			>
				{(item as any)?.name ?? (item as any)?.label ?? String(idx)}
			</li>
		{/each}
	</ul>
{:else}
	<DataList {collection} {where} {sortBy} let:items>
		<ul class="action-list" role="list">
			{#each items as item, idx}
				<li
					class="action-item"
					role="button"
					tabindex="0"
					onclick={(e) => load(e, idx, item as COL)}
					onkeydown={(e) => e.key === 'Enter' && load(e, idx, item as COL)}
				>
					{(item as any)?.name ?? (item as any)?.label ?? String(idx)}
				</li>
			{/each}
		</ul>
	</DataList>
{/if}

<style>
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
