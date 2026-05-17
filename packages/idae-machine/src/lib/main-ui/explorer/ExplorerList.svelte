<!--
ExplorerList.svelte
Collection record list with machine store binding.
@role explorer-list
@prop {string} collection - Collection name
@prop {object} [where] - Query filter
@prop {string} [displayMode] - Display mode (line|grid)
@prop {string} [target] - HTML target zone for card open
@slot children (let:item) - Custom item rendering
@event onclick - Emitted on item click
-->
<script lang="ts" generics="COL = Record<string,any>">
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/qoolie';
	import { machine } from '$lib/main/machine.js';
	import CardFields from '$lib/main-ui/card/CardFields.svelte';

	interface ExplorerListProps  {
		collection:     string;
		target?:        string;
		data?:          COL;
		menuListProps?: Record<string, unknown>;
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
	}:ExplorerListProps = $props();

	let logic = machine.logic;
	let store = machine.store;
	let errorMessage = $state<string | null>(null);

	function safeCollection(name: string) {
		try {
			return logic.collection(name);
		} catch (e) {
			return null;
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

	$inspect('ExplorerList', { collection, query, errorMessage });

	function load(item: COL, indexV: number | string) {
		openCrud((item as any)[index]);
	}

	function openCrud(id: string | number) {
		let mounted = hydrate(CardForm, {
			target: document.querySelector(`[data-target-zone="${target}"]`) as Element,
			props:  { collection: collection, dataId: id, mode: 'show' }
		});

		return mounted;
	}

	const _onclick = (data: COL, idx: number | string) => {
		if (onclick) {
			onclick(data, idx);
		} else {
			load(data, idx);
		}
	};
</script>

{#if errorMessage}
	<p class="explorer-error">{errorMessage}</p>
{/if}

<ul class="explorer-list" role="list">
	{#each query as item, idx (item[index])}
		<li
			class="explorer-item"
			role="button"
			tabindex="0"
			onclick={() => _onclick(item, idx)}
			onkeydown={(e) => e.key === 'Enter' && _onclick(item, idx)}
		>
			<CardFields collection={collection} data={item} mode="show" />
		</li>
	{/each}
</ul>

<style>
	.explorer-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.75rem;
	}
	.explorer-item {
		padding: 0.5rem;
		border: 1px solid var(--color-border, #e0e0e0);
		border-radius: 0.5rem;
		cursor: pointer;
	}
	.explorer-item:hover { background: var(--color-surface-hover, #f5f5f5); }
	.explorer-error { color: var(--color-error, red); font-size: 0.85em; }
</style>
