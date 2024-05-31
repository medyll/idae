<svelte:options />

<script lang="ts">
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import type { MenuListItemProps } from '$lib/ui/menuList/types.js';

	let { ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} />
