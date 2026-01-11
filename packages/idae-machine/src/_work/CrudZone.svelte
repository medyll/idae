<!-- CrudZone.svelte - Version initiale adaptée selon README.md -->
<script lang="ts">
	import { CrudService } from './CrudService.js';

	// Svelte 5: define props with $props rune
	let {
		collection,
		crud = new CrudService()
	}: {
		collection: string,
		crud?: CrudService
	} = $props();

	// Svelte 5: reactive state with $state
	let selected = $state<any>(null);

	// Svelte 5: derived value for items
	let items = $derived(crud.list(collection));

	function handleSelect(item: any) {
		selected = item;
	}
</script>

<div class="crud-zone">
	<aside class="crud-sidebar">
		<h2>{collection}</h2>
		<ul>
			{#each items as item, idx}
				<li>
					<button
						type="button"
						onclick={() => handleSelect(item)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(item); }}
					>
						{item.name || `Item ${idx + 1}`}
					</button>
				</li>
			{:else}
				<li>No items found.</li>
			{/each}
		</ul>
	</aside>
	<main class="crud-detail">
		{#if selected}
			<h3>Détail</h3>
			<pre>{JSON.stringify(selected, null, 2)}</pre>
		{:else}
			<p>Sélectionnez un élément pour voir le détail.</p>
		{/if}
	</main>
</div>

<style>
	.crud-zone {
		display: flex;
		min-width: 750px;
		height: 600px;
		border: 1px solid #ccc;
		border-radius: 8px;
		overflow: hidden;
	}
	.crud-sidebar {
		width: 250px;
		background: #f7f7f7;
		padding: 1rem;
		border-right: 1px solid #ddd;
	}
	.crud-detail {
		flex: 1;
		padding: 2rem;
	}
</style>