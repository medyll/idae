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

	:root {
		--list-radius: var(--sld-radius-medium);
		--list-bg: var(--sld-color-background);
		--list-border: var(--sld-color-border);
		--list-padding: 0.5rem 1rem;
	}

	.list {
		border-radius: var(--list-radius);
		background: var(--list-bg);
		border: 1px solid var(--list-border);
		padding: var(--list-padding);
		font-size: 1em;
	}
</style>

<MenuList
	{...rest}
	bind:element
	bind:selectedData
	bind:selectedIndex
	bind:menuListItems
	bind:data
/>
