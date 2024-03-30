<script lang="ts">
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	import List from '$lib/data/list/List.svelte';
	import ListItem from '$lib/data/list/ListItem.svelte';
	import ListTitle from '$lib/data/list/ListTitle.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import { sitePaths } from '$lib/utils/engine/site.utils.js';

	export let selected: string | undefined;

	const groupedData = dataOp.groupBy(
		Object.values(slotuiCatalog).sort((a, b) => (a.name > b.name ? 1 : -1)),
		'group'
	);
</script>

<List density="tight" selectorField="code" height="100%">
	{#each Object.keys(groupedData) as group}
		<ListTitle density="default" class="text-bold">
			Slot-ui {group ?? ''}
		</ListTitle>
		{#each groupedData[group] as catalog}
			{#if Boolean(catalog?.code === catalog?.code)}
				<ListItem
					selected={catalog?.code === selected}
					data={catalog}
					density="tight"
					class="pad-l-4"
				>
					<a slot="primary" href=".{sitePaths.component(catalog)}">
						{catalog?.name ?? ''}
					</a>
				</ListItem>
			{/if}
		{/each}
	{/each}
</List>

<style lang="scss">
	a {
		text-decoration: none;
	}
</style>
