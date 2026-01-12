<!-- DataList.svelte - Version initiale adaptée selon README.md -->
<script lang="ts">
	/**
	 * Composant DataList (Svelte 5)
	 * Props : collection, displayMode, where
	 * TODO : intégrer la logique de filtrage, affichage grid/list, gestion des clics
	 */
	let {
		collection,
		displayMode = 'grid',
		where = {},
		items = [],
		onItemClick = null
	}: {
		collection: string,
		displayMode?: 'grid' | 'list',
		where?: any,
		items?: any[],
		onItemClick?: ((item: any, idx: number) => void) | null
	} = $props();
</script>

<div class="data-list" data-mode={displayMode}>
	<h2>{collection} ({displayMode})</h2>
	<div class={displayMode === 'grid' ? 'grid' : 'list'}>
		{#each items as item, idx}
			<div
				class="item"
				role="button"
				tabindex="0"
				onclick={() => onItemClick && onItemClick(item, idx)}
				onkeydown={e => (e.key === 'Enter' || e.key === ' ') && onItemClick && onItemClick(item, idx)}
			>
				{item.name || `Item ${idx+1}`}
			</div>
		{:else}
			<p>No items to display.</p>
		{/each}
	</div>
</div>

<style>
	.data-list {
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