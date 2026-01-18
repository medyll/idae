// Renders a menu list of collection items with optional actions. Used for navigation or selection from a collection.
<script lang="ts" generics="COL = Record<string,any>">
	import { type MenuListProps, Button, MenuList, MenuListItem, openWindow, type Props } from '@medyll/idae-slotui-svelte';
	import CreateUpdate from '$lib/form/CreateUpdate.svelte';
	import { machine } from '$lib/main/machine.js';
	import { IDbCollectionValues } from '$lib/main/machine/IDbCollectionValues.js';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/idae-idbql';

	interface DataListMenuProps {
		collection:     string;
		target?:        string; // html target
		data?:          COL;
		menuListProps?: MenuListProps;
		style?:         string;
		where?:         Where<COL>;
		onclick?:       (event: CustomEvent, index: number) => void;
	}


	let { collection, target, data, menuListProps, onclick, style, where }: DataListMenuProps = $props();


	let fieldValues = $state(undefined) as IDbCollectionValues<Record<string, any>> | undefined;
	let index: string | undefined = undefined;
	let qy = $state(undefined) as any;

	$effect(() => {
		if (collection && machine.store?.[collection]) {
			fieldValues = new IDbCollectionValues(collection);
			index = machine.collections.collection(collection).getIndexName();
			qy = where ? machine.store[collection].where(where) : machine.store[collection].getAll();
		}
	});

	function load(event: CustomEvent) {
		// Utilise event.detail comme identifiant de l'élément sélectionné
		openCrud(event.detail);
	}

	function openCrud(id: any) {
		// mount on target, returns component
		   const el = document.querySelector(`[data-target-zone="${target}"]`);
		   if (!el) return;
		   let mounted = hydrate(CreateUpdate, {
			   target: el,
			   props:  { collection: collection, dataId: id, mode: 'update' }
		   });
		   return mounted;
	}
</script>

<MenuList {style} onclick={onclick ?? load} data={qy} {...menuListProps}>
	   {#snippet children({ item })}
		   {#if fieldValues}
			   <MenuListItem data={item}>{fieldValues.presentation(item)}</MenuListItem>
		   {/if}
	   {/snippet}
</MenuList>
