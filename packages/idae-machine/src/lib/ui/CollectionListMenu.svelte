<!--
CollectionListMenu.svelte
Svelte 5 menu list for a collection
@role ui-menu
@prop {string} collection - Collection name
@prop {object} [data] - Data object
@prop {object} [menuListProps] - Menu props
@prop {string} [target] - HTML target
@prop {string} [style] - Custom style
@prop {object} [where] - Query filter
@slot children (let:item) - Custom menu item rendering
@event click - Emitted on item click
-->

<script lang="ts" generics="COL = Record<string,any>">
	import { type MenuListProps, MenuList, MenuListItem } from '@medyll/idae-slotui-svelte';
	import CreateUpdate from '$lib/form/CreateUpdate.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/idae-idbql';
	let { collection, target, data, menuListProps, onclick, style, where } = $props<{ collection: string; target?: string; data?: COL[]; menuListProps?: MenuListProps; style?: string; where?: Where<COL>; onclick?: (event: CustomEvent, index: number) => void }>();
	// If data is provided, use it directly. Otherwise, expect parent to provide data via prop or slot.
	let items = data ?? [];
	function load(event: CustomEvent, indexV: number) {
		openCrud(event[index]);
	}
	function openCrud(id: any) {
		let mounted = hydrate(CreateUpdate, {
			target: document.querySelector(`[data-target-zone="${target}"]`),
			props:  { collection, dataId: id, mode: 'update' }
		});
		return mounted;
	}
</script>

<MenuList {style} onclick={onclick ?? load} data={items} {...menuListProps}>
	{#snippet children(item)}
		<MenuListItem data={item}>{item && item.name ? item.name : ''}</MenuListItem>
	{/snippet}
</MenuList>
