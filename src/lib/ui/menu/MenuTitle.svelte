<script lang="ts">
	import MenuItem from './MenuItem.svelte';
	import type { MenuItemProps } from './types.js';

	let { ...rest }: MenuItemProps = $props();
</script>

<MenuItem {...rest} class="menuTitle" />

<style lang="scss">
	@import './menu.scss';
</style>
