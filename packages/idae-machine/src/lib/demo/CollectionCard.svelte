<script lang="ts">
let { collection, items = [] } = $props();
</script>

<div class="collection-cards">
	<h3>{collection} — Card view (demo)</h3>
	<div class="cards">
		{#each items as item (item.id)}
			<article class="card">
				<h4>{item.id}</h4>
				<p>{Object.keys(item).slice(0,4).map(k => `${k}: ${item[k]}`).join(' — ')}</p>
			</article>
		{/each}
	</div>
</div>

<style>
	.collection-cards { font-family: system-ui, Arial; }
	.cards { display:flex; gap:12px; flex-wrap:wrap; }
	.card { border:1px solid #ddd; padding:12px; border-radius:6px; width:220px; background:#fff }
</style>