<script lang="ts">
	// Placeholder CollectionTable component for demo
	export let collection: string;
	export let items: any[] = [];
</script>

<div class="collection-table">
	<h3>{collection} — Table view (demo)</h3>
	<table>
		<thead>
			<tr>
				{#if items.length}
					{#each Object.keys(items[0]) as key}
						<th>{key}</th>
					{/each}
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each items as item (item.id)}
				<tr>
					{#each Object.keys(item) as key}
						<td>{String(item[key])}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.collection-table { font-family: system-ui, Arial; }
	table { width: 100%; border-collapse: collapse; }
	th, td { border: 1px solid #ddd; padding: 6px 8px; }
	th { background: #f5f5f5; text-align: left; }
</style>