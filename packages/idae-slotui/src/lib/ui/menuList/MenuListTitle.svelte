<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<script lang="ts">
	import MenuListItem from './MenuListItem.svelte';
	import type { MenuListItemProps } from './types.js';

	let { class: className, ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} selectable={false} class="slotui-menulist-title {className}" />

<style global lang="postcss">
	@reference "tailwindcss"
	@use './menu-list.scss';
</style>
