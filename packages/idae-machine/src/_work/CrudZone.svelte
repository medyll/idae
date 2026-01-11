<!-- CrudZone.svelte - Version initiale adaptée selon README.md -->
<script lang="ts">
	import { CrudService } from './CrudService.ts';
	/**
	 * Composant principal CRUD Zone (Svelte 5)
	 * Props : collection (nom de la collection à gérer), crud (service)
	 */
	export let collection: string;
	export let crud: CrudService = new CrudService();
	let items: any[] = [];
	let selected: any = null;

	// Svelte 5 idiom: reactive to prop changes
	$: items = crud.list(collection);

	function handleSelect(item: any) {
		selected = item;
	}
</script>

<div class="crud-zone">
	<aside class="crud-sidebar">
		<h2>{collection}</h2>
		<!-- Liste des items -->
		<ul>
			{#each items as item, idx}
				   <li>
					   <button type="button" on:click={() => handleSelect(item)} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(item); }}>
						   {item.name || `Item ${idx+1}`}
					   </button>
				   </li>
			{/each}
			{#if items.length === 0}
				<li>No items found.</li>
			{/if}
		</ul>
	</aside>
	<main class="crud-detail">
		{#if selected}
			<h3>Détail</h3>
			<pre>{JSON.stringify(selected, null, 2)}</pre>
			<!-- TODO : intégrer formulaire d'édition -->
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