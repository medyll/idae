<script lang="ts">
	import MenuItem from './MenuItem.svelte';
	import type { MenuItemProps } from './types.js';

	/**
	 * @property {object} rest - All MenuItemProps spread
	 */
	let { ...rest }: MenuItemProps = $props();
</script>

<MenuItem {...rest} class="menuTitle" />

<style global>
	@import '../../slotui-css/menu.css';
</style>
