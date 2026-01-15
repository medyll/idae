<!-- DataList.svelte - Composant listant les items d'une collection
   Migré depuis _work, adapté pour /lib/form et Svelte 5
   Props : collection, displayMode, where, items, onItemClick
-->
<script lang="ts">
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
	}
</style>
