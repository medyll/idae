<!--
ExplorerTableInline.svelte
Table mode for Explorer — sortable columns, click row to open card.
Internal component, not exported.
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		where,
		openCard,
	}: {
		collection: string;
		where?: Record<string, unknown>;
		openCard: (record: COL) => void;
	} = $props();

	let sortColumn = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	const store = $derived(collection ? machine.store[collection] : undefined);

	const rawItems = $derived.by(() => {
		if (!store) return [] as COL[];
		if (where) return (store.where(where) ?? []) as COL[];
		return (store.getAll() ?? []) as COL[];
	});

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

<table class="collection-table">
	<thead>
		<tr>
			{#each columns as col}
				<th class="sortable" onclick={() => toggleSort(col)}>
					{col}
					<span class="sort-arrow">{sortIndicator(col)}</span>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each sortedItems as item ((item as Record<string, unknown>).id)}
			<tr onclick={() => openCard(item)} style="cursor: pointer;">
				{#each columns as col}
					<td>{(item as Record<string, unknown>)[col]}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.collection-table { width: 100%; border-collapse: collapse; }
	.collection-table th, .collection-table td { border: 1px solid var(--color-border); padding: 8px; }
	.collection-table th { background: var(--color-surface); text-align: left; }
	.collection-table th.sortable { cursor: pointer; user-select: none; }
	.collection-table th.sortable:hover { background: var(--color-surface-hover, #eee); }
	.sort-arrow { margin-left: 0.25rem; font-size: 0.75em; opacity: 0.6; }
</style>
