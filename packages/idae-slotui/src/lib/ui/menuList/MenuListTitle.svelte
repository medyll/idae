<script lang="ts">
	import MenuListItem from './MenuListItem.svelte';
	import type { MenuListItemProps } from './types.js';

	let { class: className, ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} selectable={false} class="slotui-menulist-title {className}" />

<style lang="scss">
	@use './menu-list.scss';
</style>
