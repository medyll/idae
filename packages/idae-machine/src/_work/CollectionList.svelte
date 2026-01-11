<!-- CollectionList.svelte - Version initiale adaptée selon README.md -->
<script lang="ts">
	/**
	 * Composant CollectionList
	 * Props : collection (nom de la collection à afficher), displayMode, where
	 * TODO : intégrer la logique de filtrage, affichage grid/list, gestion des clics
	 */
	export let collection: string;
	export let displayMode: 'grid' | 'list' = 'grid';
	export let where: any = {};
	// Placeholder pour les données, à remplacer par la logique réelle
	let items: any[] = [];
</script>

<div class="collection-list" data-mode={displayMode}>
	<h2>{collection} ({displayMode})</h2>
	<div class={displayMode === 'grid' ? 'grid' : 'list'}>
		{#each items as item, idx}
			<div class="item" on:click={() => dispatch('click', { data: item, idx })}>
				{item.name || `Item ${idx+1}`}
			</div>
		{/each}
		{#if items.length === 0}
			<p>No items to display.</p>
		{/if}
	</div>
</div>

<style>
	.collection-list {
		padding: 1rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
	}
	.list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.item {
		background: #f0f0f0;
		border-radius: 6px;
		padding: 0.75rem;
		cursor: pointer;
		text-align: center;
		transition: background 0.2s;
	}
	.item:hover {
		background: #e0e0e0;
	}
</style>