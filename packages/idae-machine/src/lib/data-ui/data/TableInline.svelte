<!--
TableInline.svelte
Sortable table renderer for data collections.
@role data-table
@prop {string} collection - Collection name
@prop {Where<COL>} [where] - Filter
@prop {(record: COL) => void} [onItemClick] - Row click handler
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import { machine } from '$lib/main/machine.js';
	import type { Where } from '$lib/types/index.js';

	let {
		collection,
		where,
		onItemClick,
	}: {
		collection: string;
		where?: Where<COL>;
		onItemClick?: (record: COL) => void;
	} = $props();

	let sortColumn = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	const store = $derived(collection ? (where ? machine.store(collection, where) : machine.store(collection)) : { items: [] as COL[] });

	const rawItems = $derived(store.items as COL[]);

	const columns = $derived.by(() => {
		if (!rawItems.length) return [] as string[];
		const keys = new Set<string>();
		for (const item of rawItems) {
			for (const key of Object.keys(item as Record<string, unknown>)) {
				if (key !== 'id' && key !== '_id') keys.add(key);
			}
		}
		return [...keys].slice(0, 8);
	});

	const sortedItems = $derived.by(() => {
		if (!sortColumn) return rawItems;
		const col = sortColumn;
		return [...rawItems].toSorted((a, b) => {
			const aVal = (a as Record<string, unknown>)[col];
			const bVal = (b as Record<string, unknown>)[col];
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return sortDirection === 'asc' ? -1 : 1;
			if (bVal == null) return sortDirection === 'asc' ? 1 : -1;
			const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
			return sortDirection === 'asc' ? cmp : -cmp;
		});
	});

	function toggleSort(col: string): void {
		if (sortColumn === col) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = col;
			sortDirection = 'asc';
		}
	}

	function sortIndicator(col: string): string {
		if (sortColumn !== col) return '↕';
		return sortDirection === 'asc' ? '↑' : '↓';
	}
</script>

<table class="sortable">
	<thead>
		<tr class="entete">
			{#each columns as col}
				<th
					class:sortheaderSorted={sortColumn === col}
					onclick={() => toggleSort(col)}
				>
					{col.replace(/_/g, ' ')}
					<span class="sortarrow">{sortIndicator(col)}</span>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each sortedItems as item, i ((item as Record<string, unknown>).id ?? i)}
			<tr onclick={() => onItemClick?.(item)} class:clickable={!!onItemClick}>
				{#each columns as col}
					<td>{(item as Record<string, unknown>)[col] ?? ''}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table.sortable {
		width: 100%;
		border-collapse: collapse;
		position: relative;
		font-size: var(--text-sm, 0.875rem);
	}

	/* ── Header ── */
	table.sortable tr.entete th {
		color: var(--color-text, #333);
		height: 2.4em;
		line-height: 2.4em;
		cursor: pointer;
		user-select: none;
		overflow: hidden;
		background-color: var(--color-surface, #fafafa);
		white-space: nowrap;
		border-right: 1px solid var(--color-border, #e0e0e0);
		border-top: 1px solid var(--color-border, #e9e9e9);
		border-bottom: 1px solid var(--color-border, #ededed);
		vertical-align: middle;
		text-overflow: ellipsis;
		padding: 0 0.6em;
		text-align: left;
		text-transform: capitalize;
		font-weight: var(--font-medium, 500);
		position: relative;
	}
	table.sortable tr.entete th:hover {
		background-color: #D1E8FF;
	}
	table.sortable .sortheaderSorted {
		background-color: #D1E8FF !important;
	}
	.sortarrow {
		font-size: 0.7em;
		opacity: 0.6;
		margin-left: 0.3em;
	}

	/* ── Body rows ── */
	table.sortable tbody tr.clickable {
		cursor: pointer;
	}
	table.sortable tbody td {
		white-space: nowrap;
		line-height: 22px;
		min-height: 22px;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 200px;
		border-bottom: 1px solid var(--color-border, #ededed);
		padding: 0 0.5em;
		color: var(--color-text);
	}
	table.sortable tbody tr:hover td {
		background-color: #E4F0FB !important;
		box-shadow: 0 1px 0 0 #ccc inset, 0 -1px 0 0 #ccc inset;
	}

	/* Zebra — groupes de 5 */
	table.sortable tbody tr:nth-child(5n+3) td {
		background-color: var(--color-surface, #f5f5f5);
	}
	table.sortable tbody tr:nth-child(5n+5) td {
		border-bottom: 1px solid #ccc;
	}
</style>
