<!--
CollectionList.svelte
Svelte 5 collection list with Looper
@role ui-list
@prop {string} collection - Collection name
@prop {object} [data] - Data object
@prop {object} [menuListProps] - Menu props
@prop {string} [target] - HTML target
@prop {string} [style] - Custom style
@prop {object} [where] - Query filter
@prop {string} [displayMode] - Display mode
@slot children (let:item) - Custom item rendering
@slot loopTitle - Custom title rendering
@event click - Emitted on item click
-->


<script lang="ts" generics="COL = Record<string,any>">
	import {
		type MenuListProps,
		Looper
	} from '@medyll/idae-slotui-svelte';
	import CreateUpdate from '$lib/form/CreateUpdate.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/idae-idbql';
	import { machine } from '$lib/main/machine.js'; 
	import CollectionListFieldValues from './CollectionListFieldValues.svelte';

	interface CollectionListProps  {
		collection:     string;
		target?:        string;
		data?:          COL;
		menuListProps?: MenuListProps;
		style?:         string;
		displayMode?:   'line' | 'grid';
		where?:         Where<COL>;
		children?:      any;
		onclick?:       (data: COL, index: number | string) => void;
	}
	let {
		collection,
		target,
		onclick,
		where,
		children: _children,
	} = $props<CollectionListProps>();
	
	let logic = machine.logic;
	let store = machine.store;
	let fieldValues = $derived(logic.collection(collection).collectionValues);
	let index = $derived(logic.collection(collection).template.index);
	let query = $derived(where ? store[collection].where(where) : store[collection]?.getAll());

	$inspect('CollectionList', { collection, query });



	function load(event: CustomEvent, indexV: number | string) {
		openCrud(event[index]);
	}

	function openCrud(id: any) {
		// mount on target, returns component
		let mounted = hydrate(CreateUpdate, {
			target: document.querySelector(`[data-target-zone="${target}"]`),
			props:  { collection: collection, dataId: id, mode: 'show' }
		});

		return mounted;
	}

	const _onclick = (data: COL, index: number | string) => {
		console.log('onclick', data, index);

		if (onclick) {
			onclick(data, index);
		} else {
			load(data, index);
		}
	};

	$inspect('query', {  query });
</script>


<div class="grid grid-cols-3 gap-3 p-3">
	<Looper data={query}>
		{#snippet loopTitle()}
			<!-- Default: nothing -->
		{/snippet}
		{#snippet children({item, idx})}
			<div class="flex aspect-square flex-col rounded-2xl border border-gray-300 p-2">
					<CollectionListFieldValues
						collection={collection}
						data={item}
						mode="show"
				/>
			</div>
		{/snippet}
	</Looper>
</div>
