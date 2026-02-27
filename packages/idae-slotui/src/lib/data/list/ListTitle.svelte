<script module lang="ts">
// Module-level Props marker for migration tooling
export type ListTitleProps = Record<string, unknown>;
</script>

<script lang="ts">
	import MenuListTitle from '$lib/ui/menuList/MenuListTitle.svelte';
	import type { MenuListItemProps } from '$lib/ui/menuList/types.js';

	let { ...rest }: MenuListItemProps = $props();
</script>

<MenuListTitle {...rest} />
