<script lang="ts">
	import MenuListItem from './MenuListItem.svelte';
	import type { MenuListItemProps } from './types.js';

	let { class: className, ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} selectable={false} class="menu-list-title {className}" />

<style lang="scss">
	@import './menu-list.scss';
</style>
