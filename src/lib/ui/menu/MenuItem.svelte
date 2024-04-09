<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import type { MenuListItemProps } from '../menuList/types.js';
	import type { Data } from '$lib/types/index.js';
	import MenuListItem from '../menuList/MenuListItem.svelte';

	let { ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} class="menuItem" />
