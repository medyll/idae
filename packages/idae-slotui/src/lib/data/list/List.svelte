<script module lang="ts">
export type ListProps = Record<string, unknown>;
</script>

<script lang="ts">
	import type { MenuListProps } from '$lib/ui/menuList/types.js';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';

	let { element, selectedData, selectedIndex, menuListItems, data, ...rest }: MenuListProps =
		$props();
</script>

<style global lang="postcss">
	@reference "tailwindcss";
	@import './list.css';
</style>

<MenuList
	{...rest}
	bind:element
	bind:selectedData
	bind:selectedIndex
	bind:menuListItems
	bind:data
/>
