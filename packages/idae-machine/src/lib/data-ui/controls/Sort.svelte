<!--
Sort.svelte
Composable sort menu — prefs-aware. Drop next to <DataList collection> sharing the
same collection/prefsScope; both bind the same shared prefs store (mediator) and stay in sync.

@prop {string} collection
@prop {string} [prefsScope] - override scope (must match the DataList's)
@prop {boolean} [usePrefs=true]
-->
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
	}: { collection: string; prefsScope?: string; usePrefs?: boolean } = $props();

	const scope = $derived(dataListPrefsScope(collection, prefsScope));
	const prefs = useMachinePrefs(() => scope, dataListPrefsDefaults(), () => usePrefs);

	let open = $state(false);

	const fields = $derived.by(() => {
		const logic = machine.logic.collectionOr(collection, null);
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
			padding: 0.25rem 0.75rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			cursor: pointer;
			font-size: 0.875rem;
		}
		.sort-trigger.active {
			background: var(--color-primary);
			color: var(--color-on-primary);
			border-color: var(--color-primary);
		}
		.sort-pop {
			position: absolute;
			top: 100%;
			left: 0;
			margin-top: 0.25rem;
			padding: 0.375rem;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			background: var(--color-surface);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-sm);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			min-width: 160px;
			z-index: 10;
		}
		.sort-empty {
			color: var(--color-text-muted, #888);
			font-size: 0.875rem;
		}
	}
</style>
