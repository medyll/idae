<script lang="ts">
	import MenuListItem from './MenuListItem.svelte';
	import type { MenuListItemProps } from './types.js';

	/**
	 * @property {string} className - className for the menu list title
	 * @property {object} rest - All MenuListItemProps spread
	 */
	let { class: className, ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} selectable={false} class="slotui-menulist-title {className}" />

<style global>
	@import '../../slotui-css/menu-list.css';
</style>
