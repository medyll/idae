<!--
ExplorerTable.svelte
Visual table renderer for a list of items. No machine logic.
@role explorer-display
@prop {any[]} items - Items to render
@prop {string[]} columns - Column keys to display
@prop {boolean} [sortable] - Enable sort on all columns
@prop {string[]} [sortableColumns] - Specific columns to make sortable
-->
<script lang="ts">
let { items = [], columns = [], sortable = false, sortableColumns = [] } = $props();

let sortColumn = $state<string | null>(null);
let sortDirection = $state<'asc' | 'desc'>('asc');

const effectiveSortable = $derived(
	sortableColumns.length > 0 ? sortableColumns : (sortable ? columns : [])
);

const sortedItems = $derived.by(() => {
	if (!sortColumn || !effectiveSortable.includes(sortColumn)) return items;
	const col = sortColumn;
	return [...items].toSorted((a, b) => {
		const aVal = a[col];
		const bVal = b[col];
		if (aVal == null && bVal == null) return 0;
		if (aVal == null) return sortDirection === 'asc' ? -1 : 1;
		if (bVal == null) return sortDirection === 'asc' ? 1 : -1;
		const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
		return sortDirection === 'asc' ? cmp : -cmp;
	});
});

function toggleSort(col: string) {
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
	<th class:sortable={effectiveSortable.includes(col)} onclick={() => effectiveSortable.includes(col) && toggleSort(col)}>
		{col}
		{#if effectiveSortable.includes(col)}
			<span class="sort-arrow">{sortIndicator(col)}</span>
		{/if}
	</th>
{/each}
</tr>
</thead>
<tbody>
{#each sortedItems as item (item.id)}
<tr>
{#each columns as col}
<td>{item[col]}</td>
{/each}
</tr>
{/each}
</tbody>
</table>

<style>
.collection-table { width: 100%; border-collapse: collapse; }
.collection-table th, .collection-table td { border: 1px solid #ddd; padding: 8px; }
.collection-table th { background: #f7f7f7; text-align: left; }
.collection-table th.sortable { cursor: pointer; user-select: none; }
.collection-table th.sortable:hover { background: #eee; }
.sort-arrow { margin-left: 0.25rem; font-size: 0.75em; opacity: 0.6; }
</style>
