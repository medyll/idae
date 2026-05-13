<!--
ExplorerFilter.svelte
Advanced filter bar for collection explorers.
@role explorer-filter
@prop {ViewFieldDef[]} fields - Field definitions
@prop {Function} onFilter - Filter callback
-->
<script lang="ts">
	import type { ViewFieldDef } from '$lib/main/api/types.js';

	let {
		fields = [],
		onFilter
	}: {
		fields?: ViewFieldDef[];
		onFilter: (filters: Record<string, unknown>) => void;
	} = $props();

	let filters = $state<Record<string, unknown>>({});
	let searchQuery = $state('');
	let showFilters = $state(false);

	const activeFilterCount = $derived(Object.keys(filters).length + (searchQuery ? 1 : 0));

	function handleSearch(): void {
		if (searchQuery) {
			filters.search = searchQuery;
		} else {
			delete filters.search;
		}
		applyFilters();
	}

	function handleFieldFilter(field: string, value: unknown): void {
		if (value) {
			filters[field] = value;
		} else {
			delete filters[field];
		}
		applyFilters();
	}

	function clearFilters(): void {
		filters = {};
		searchQuery = '';
		applyFilters();
	}

	function applyFilters(): void {
		onFilter(filters);
	}
</script>

<div class="filter-bar">
	<div class="search-box">
		<input
			type="text"
			bind:value={searchQuery}
			oninput={handleSearch}
			placeholder="Search..."
			class="search-input"
		/>
		<button class="search-btn" onclick={handleSearch}>🔍</button>
	</div>

	<button
		class="filter-toggle"
		onclick={() => showFilters = !showFilters}
		class:active={showFilters || activeFilterCount > 0}
	>
		🔧 Filters
		{#if activeFilterCount > 0}
			<span class="filter-count">{activeFilterCount}</span>
		{/if}
	</button>

	{#if activeFilterCount > 0}
		<button class="clear-filters" onclick={clearFilters}>
			Clear all
		</button>
	{/if}

	{#if showFilters}
		<div class="filter-panel">
			{#each fields as field}
				<div class="filter-field">
					<label for="filter-{field.field_name}">
						{field.title}
					</label>
					{#if field.type === 'text'}
						<input
							type="text"
							id="filter-{field.field_name}"
							placeholder="Filter by {field.title}"
							onchange={(e) => handleFieldFilter(field.field_name_raw || field.field_name, (e.target as HTMLInputElement).value)}
							class="filter-input"
						/>
					{:else if field.type === 'number'}
						<input
							type="number"
							id="filter-{field.field_name}"
							placeholder="Min"
							onchange={(e) => handleFieldFilter(`${field.field_name_raw || field.field_name}__gte`, (e.target as HTMLInputElement).value)}
							class="filter-input"
						/>
					{:else if field.type === 'date'}
						<input
							type="date"
							id="filter-{field.field_name}"
							onchange={(e) => handleFieldFilter(field.field_name_raw || field.field_name, (e.target as HTMLInputElement).value)}
							class="filter-input"
						/>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.filter-bar { display: flex; gap: 1rem; align-items: center; padding: 1rem; background: #fff; border-bottom: 1px solid #dee2e6; flex-wrap: wrap; }
	.search-box { display: flex; gap: 0.5rem; flex: 1; min-width: 200px; }
	.search-input { flex: 1; padding: 0.5rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
	.search-btn { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
	.filter-toggle { padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; position: relative; }
	.filter-toggle.active { background: #007bff; }
	.filter-count { position: absolute; top: -8px; right: -8px; background: #dc3545; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; }
	.clear-filters { padding: 0.5rem 1rem; background: transparent; color: #dc3545; border: 1px solid #dc3545; border-radius: 4px; cursor: pointer; }
	.filter-panel { width: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6; margin-top: 1rem; }
	.filter-field { display: flex; flex-direction: column; gap: 0.25rem; }
	.filter-field label { font-size: 0.875rem; color: #6c757d; font-weight: 500; }
	.filter-input { padding: 0.5rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
</style>
