<!--
ExplorerActions.svelte
Menu list of collection records with action handling.
@role explorer-menu
@prop {string} collection - Collection name
@prop {object[]} [data] - Data array
@prop {object} [menuListProps] - Menu props
@prop {string} [target] - HTML target zone
@prop {string} [style] - Custom style
@prop {object} [where] - Query filter
@slot children (let:item) - Custom menu item rendering
@event onclick - Emitted on item click
-->
<script lang="ts" generics="COL = Record<string,any>">
	import { type MenuListProps, MenuList, MenuListItem } from '@medyll/idae-slotui-svelte';
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/idae-idbql';
	let { collection, target, data, menuListProps, onclick, style, where } = $props<{ collection: string; target?: string; data?: COL[]; menuListProps?: MenuListProps; style?: string; where?: Where<COL>; onclick?: (event: CustomEvent, index: number) => void }>();
	let items = $derived(data ?? []);
	function load(event: CustomEvent, indexV: number) {
		openCrud(event[indexV]);
	}
	function openCrud(id: string | number) {
		let mounted = hydrate(CardForm, {
			target: document.querySelector(`[data-target-zone="${target}"]`) as Element,
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
