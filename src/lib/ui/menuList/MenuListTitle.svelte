<script lang="ts">
	import MenuListItem from './MenuListItem.svelte';
	import type { MenuListItemProps } from './types.js';

	let { class: className, ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} class="menuListTitle {className}" />

<style lang="scss">
	@import './menu-list.scss';
</style>
