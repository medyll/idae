<style global lang="scss">
	@use './menu.scss';
</style>
<script lang="ts" generics="T= Data">
	import type { Data } from '$lib/types/index.js';
	import MenuList from '../menuList/MenuList.svelte';
	import type { MenuListProps } from '../menuList/types.js';

	let { ...rest }: MenuListProps = $props();
</script>

<MenuList {...rest} class="menu" />
