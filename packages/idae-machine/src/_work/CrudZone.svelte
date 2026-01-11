<!-- CrudZone.svelte - Version initiale adaptée selon README.md -->
<script lang="ts">
	/**
	 * Composant principal CRUD Zone
	 * Props : collection (nom de la collection à gérer)
	 * TODO : intégrer la logique CRUD, gestion du schéma, affichage liste/détail
	 */
	export let collection: string;
	// Placeholder pour les données, à remplacer par la logique réelle
	let items: any[] = [];
	let selected: any = null;
</script>

<div class="crud-zone">
	<aside class="crud-sidebar">
		<h2>{collection}</h2>
		<!-- Liste des items -->
		<ul>
			{#each items as item, idx}
				<li on:click={() => selected = item}>
					{item.name || `Item ${idx+1}`}
				</li>
			{/each}
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