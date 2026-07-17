<!--
Sort.svelte
Composable sort menu — prefs-aware. Drop next to <DataList collection> sharing the
same collection/prefsScope; both bind the same shared prefs store (mediator) and stay in sync.

@prop {string} collection
@prop {string} [prefsScope] - override scope (must match the DataList's)
@prop {boolean} [usePrefs=true]
-->
<script module lang="ts">
	export interface SortProps {
		collection: string;
		prefsScope?: string;
		usePrefs?: boolean;
	}
</script>

<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import {
		useMachinePrefs,
		dataListPrefsScope,
		dataListPrefsDefaults
	} from '$lib/data-ui/utils/useMachinePrefs.svelte.js';
	import DataSort from './DataSort.svelte';

	let {
		collection,
		prefsScope,
		usePrefs = true
	}: SortProps = $props();

	const scope = $derived(dataListPrefsScope(collection, prefsScope));
	const prefs = useMachinePrefs(() => scope, dataListPrefsDefaults(), () => usePrefs);

	let open = $state(false);

	const fields = $derived.by(() => {
		const logic = machine.logic.collection(collection);
		const pres = logic?.template?.presentation as string | undefined;
		if (pres) return pres.split(/\s+/).filter(Boolean);
		return Object.keys(logic?.fields ?? {}).filter((f) => !f.startsWith('_'));
	});

	const active = $derived((prefs.slots.sortBy ?? []).length > 0);
</script>

<div class="sort-menu">
	<button type="button" class="sort-trigger" class:active onclick={() => (open = !open)}>Sort ▾</button>
	{#if open}
		<div class="sort-pop" role="menu">
			{#each fields as f (f)}
				<DataSort field={f} bind:sortBy={() => prefs.get('sortBy'), (v) => prefs.set('sortBy', v)} />
			{/each}
			{#if !fields.length}<span class="sort-empty">No fields</span>{/if}
		</div>
	{/if}
</div>

<style>
	@layer components {
		.sort-menu {
			position: relative;
			display: inline-block;
		}
		.sort-trigger {
			padding: var(--pad-xs) var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			cursor: pointer;
			font-size: var(--text-sm);
		}
		.sort-trigger.active {
			background: var(--color-primary);
			color: var(--default-color-surface-light);
			border-color: var(--color-primary);
		}
		.sort-pop {
			position: absolute;
			top: 100%;
			left: 0;
			margin-top: var(--marg-xs);
			padding: var(--pad-xs);
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			background: var(--color-surface-overlay);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-sm);
			box-shadow: var(--shadow-md);
			min-width: calc(var(--gutter-3xl) * 2.5);
			z-index: var(--z-dropdown);
		}
		.sort-empty {
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}
	}
</style>
