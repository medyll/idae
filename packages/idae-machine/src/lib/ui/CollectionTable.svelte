<script lang="ts">
export let items = [];
export let columns: string[] = [];
</script>

<table class="collection-table">
<thead>
<tr>
{#each columns as col}
<th>{col}</th>
{/each}
</tr>
</thead>
<tbody>
{#each items as item (item.id)}
<tr>
{#each columns as col}
<td>{item[col]}</td>
{/each}
</tr>
{/each}
</tbody>
</table>

<style>
.collection-table { width: 100%; border-collapse: collapse; }
.collection-table th, .collection-table td { border: 1px solid #ddd; padding: 8px; }
.collection-table th { background: #f7f7f7; text-align: left; }
</style>
