<!-- CollectionList.svelte - Version initiale adaptée selon README.md -->
<script lang="ts">
	/**
	 * Composant CollectionList (Svelte 5)
	 * Props : collection, displayMode, where
	 * TODO : intégrer la logique de filtrage, affichage grid/list, gestion des clics
	 */
	let {
		collection,
		displayMode = 'grid',
		where = {},
		items = []
	}: {
		collection: string,
		displayMode?: 'grid' | 'list',
		where?: any,
		items?: any[]
	} = $props();
</script>

<div class="collection-list" data-mode={displayMode}>
	<h2>{collection} ({displayMode})</h2>
	<div class={displayMode === 'grid' ? 'grid' : 'list'}>
		{#each items as item, idx}
			<div class="item" onclick={() => dispatch('click', { data: item, idx })}>
				{item.name || `Item ${idx+1}`}
			</div>
		{:else}
			<p>No items to display.</p>
		{/each}
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