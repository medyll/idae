<script lang="ts">
	import MenuItem from './MenuItem.svelte';
	import type { MenuItemProps } from './types.js';

	let { ...rest }: MenuItemProps = $props();
</script>

<MenuItem {...rest} class="menuTitle" />

<style global lang="postcss">
	@use './menu.scss';
</style>
