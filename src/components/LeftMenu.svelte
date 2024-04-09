<script lang="ts">
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import { sitePaths } from '$lib/utils/engine/site.utils.js';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import MenuListTitle from '$lib/ui/menuList/MenuListTitle.svelte';

	export let selected: string | undefined;

	const groupedData = dataOp.groupBy(
		Object.values(slotuiCatalog).sort((a, b) => (a.name > b.name ? 1 : -1)),
		'group'
	);
</script>

<MenuList showLastOnSelected={true} style="height:100%;overflow:auto;padding:0.5rem;">
	{#each Object.keys(groupedData) as group}
		<MenuListTitle class="text-bold bold border-b">
			Slot-ui {group ?? ''}
		</MenuListTitle>
		{#each groupedData[group] as catalog}
			{#if Boolean(catalog?.code === catalog?.code)}
				<MenuListItem
					iconLast={{ icon: 'chevron-right' }}
					selected={catalog?.code === selected}
					data={catalog}
				>
					<a href=".{sitePaths.component(catalog)}">
						{catalog?.name ?? ''}
					</a>
				</MenuListItem>
			{/if}
		{/each}
	{/each}
</MenuList>

<style lang="scss">
	a {
		text-decoration: none;
	}
</style>
