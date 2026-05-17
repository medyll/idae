<!--
ExplorerActions.svelte
Menu list of collection records with action handling.
@role explorer-menu
@prop {string} collection - Collection name
@prop {object[]} [data] - Data array
@prop {string} [target] - HTML target zone
@prop {string} [style] - Custom style
@prop {object} [where] - Query filter
@event onclick - Emitted on item click
-->
<script lang="ts" generics="COL = Record<string,any>">
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import { hydrate } from 'svelte';
	import type { Where } from '@medyll/qoolie';

	export type ActionListProps = {
		dense?:    boolean;
		bordered?: boolean;
	};

	let { collection, target, data, style, where, onclick } = $props<{
		collection:   string;
		target?:      string;
		data?:        COL[];
		style?:       string;
		where?:       Where<COL>;
		onclick?:     (event: CustomEvent, index: number) => void;
		actionProps?: ActionListProps;
	}>();

	let items = $derived(data ?? []);

	function openCrud(id: string | number) {
		hydrate(CardForm, {
			target: document.querySelector(`[data-target-zone="${target}"]`) as Element,
			props:  { collection, dataId: id, mode: 'update' }
		});
	}

	function load(_event: any, indexV: number) {
		const item = items[indexV] as any;
		openCrud(item?.id ?? indexV);
	}
</script>

<ul class="action-list" {style} role="list">
	{#each items as item, idx}
		<li
			class="action-item"
			role="button"
			tabindex="0"
			onclick={(e) => onclick ? onclick(e as any, idx) : load(e, idx)}
			onkeydown={(e) => e.key === 'Enter' && (onclick ? onclick(e as any, idx) : load(e, idx))}
		>
			{(item as any)?.name ?? (item as any)?.label ?? String(idx)}
		</li>
	{/each}
</ul>

<style>
	.action-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	.action-item {
		padding: 0.4rem 0.75rem;
		cursor: pointer;
		border-radius: 0.25rem;
	}
	.action-item:hover {
		background: var(--color-surface-hover, #f0f0f0);
	}
</style>
