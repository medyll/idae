<script lang="ts">
	import MenuListTitle from '$lib/ui/menuList/MenuListTitle.svelte';
	import type { MenuListItemProps } from '$lib/ui/menuList/types.js';

	/**
	 * @property {object} rest - All MenuListItemProps spread
	 */
	let { ...rest }: MenuListItemProps = $props();
</script>

<MenuListTitle {...rest} />
