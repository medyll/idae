<script lang="ts">
	import type { MenuListProps } from '$lib/ui/menuList/types.js';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';

	/**
	 * @property {HTMLElement} element - The root element
	 * @property {any} selectedData - The selected data
	 * @property {number} selectedIndex - The selected index
	 * @property {Array} menuListItems - The menu list items
	 * @property {Array} data - The data for the menu
	 * @property {object} rest - All MenuListProps spread
	 */
	let { element, selectedData, selectedIndex, menuListItems, data, ...rest }: MenuListProps =
		$props();
</script>

<MenuList
	{...rest}
	bind:element
	bind:selectedData
	bind:selectedIndex
	bind:menuListItems
	bind:data
/>
