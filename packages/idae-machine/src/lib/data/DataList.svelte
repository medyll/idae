<!--
DataList.svelte
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
	import type { MenuListProps } from '@medyll/idae-slotui-svelte';
	import DataForm from '$lib/data/DataForm.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/idae-idbql';
	import { machine } from '$lib/main/machine.js';
	import DataListFields from './DataListFields.svelte';

	interface DataListProps  {
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
	}:DataListProps = $props();

	let logic = machine.logic;
	let store = machine.store;
	let errorMessage = $state<string | null>(null);

	function safeCollection(name: string) {
		try {
			return logic.collection(name);
		} catch (e) {
			return null as any;
		}
	}

	let fieldValues = $derived(safeCollection(collection)?.collectionValues ?? {});
	let index = $derived(safeCollection(collection)?.template?.index ?? '');
	let query = $derived(where ? store[collection]?.where(where) : store[collection]?.getAll() ?? []);
	$effect(() => {
		if (!safeCollection(collection)) {
			const msg = `Collection '${collection}' non trouvée dans le schéma`;
			errorMessage = `${msg}. Vérifiez que le schéma est à jour ou videz IndexedDB (ex: effacer la base dans l'inspecteur du navigateur).`;
		} else {
			errorMessage = null;
		}
	});

	$inspect('DataList', { collection, query, errorMessage });

	function load(item: COL, indexV: number | string) {
		openCrud(item[index]);
	}

	function openCrud(id: any) {
		// mount on target, returns component
		let mounted = hydrate(DataForm, {
			target: document.querySelector(`[data-target-zone="${target}"]`),
			props:  { collection: collection, dataId: id, mode: 'show' }
		});

		return mounted;
	}

	const _onclick = (data: COL, idx: number | string) => {
		console.log('onclick', data, idx);

		if (onclick) {
			onclick(data, idx);
		} else {
			load(data, idx);
		}
	};
</script>

<div class="grid grid-cols-3 gap-3 p-3">
	{#each query as item, idx (item[index])}
		<div class="flex aspect-square flex-col rounded-2xl border border-gray-300 p-2">
			<DataListFields
				collection={collection}
				data={item}
				mode="show"
			/>
		</div>
	{/each}
</div>
