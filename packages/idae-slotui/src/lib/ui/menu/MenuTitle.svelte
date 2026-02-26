<script module lang="ts">
// Module-level Props marker for migration tooling
export type MenuTitleProps = Record<string, unknown>;
</script>

<script lang="ts">
	import MenuItem from './MenuItem.svelte';
	import type { MenuItemProps } from './types.js';

	let { ...rest }: MenuItemProps = $props();
</script>

<MenuItem {...rest} class="menuTitle" />

<style global lang="postcss">
	@reference "tailwindcss";
	@use './menu.scss';
</style>
