<script lang="ts">
let { items = [] } = $props();
</script>

<div class="collection-cards">
{#each items as item (item.id)}
<div class="card">
<h3>{item.name || item.model || item.title}</h3>
<ul>
{#each Object.entries(item) as [k, v]}
<li><strong>{k}:</strong> {v}</li>
{/each}
</ul>
</div>
{/each}
</div>

<style>
.collection-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.card { border: 1px solid #e3e3e3; padding: 12px; border-radius: 6px; background: #fff; }
.card h3 { margin: 0 0 8px 0; }
</style>
