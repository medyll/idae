<svelte:options />

<script module lang="ts">
// Module-level Props marker for migration tooling
export type ListItemProps = Record<string, unknown>;
</script>

<script lang="ts">
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import type { MenuListItemProps } from '$lib/ui/menuList/types.js';

	let { ...rest }: MenuListItemProps = $props();
</script>

<MenuListItem {...rest} />
