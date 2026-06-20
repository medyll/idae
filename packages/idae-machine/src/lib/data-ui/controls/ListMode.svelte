<!--
ListMode.svelte
Composable list/table/grid mode switcher — prefs-aware.
Shares the same prefs store as the matching <DataList collection> (mediator).

@prop {string} collection
@prop {string} [prefsScope] - override scope (must match the DataList's)
@prop {boolean} [usePrefs=true]
@prop {Array<'list'|'table'|'grid'>} [modes] - which modes to offer
-->
<script lang="ts">
	import {
		useMachinePrefs,
		dataListPrefsScope,
		dataListPrefsDefaults
	} from '$lib/data-ui/utils/useMachinePrefs.svelte.js';

	let {
		collection,
		prefsScope,
		usePrefs = true,
		modes = ['list', 'table', 'grid']
	}: {
		collection: string;
		prefsScope?: string;
		usePrefs?: boolean;
		modes?: Array<'list' | 'table' | 'grid'>;
	} = $props();

	const scope = $derived(dataListPrefsScope(collection, prefsScope));
	const prefs = useMachinePrefs(() => scope, dataListPrefsDefaults(), () => usePrefs);

	const current = $derived(prefs.slots.mode ?? 'list');
</script>

<div class="mode-switcher">
	{#each modes as m (m)}
		<button type="button" class="mode-btn" class:active={current === m} onclick={() => prefs.set('mode', m)}>
			{m}
		</button>
	{/each}
</div>

<style>
	@layer components {
		.mode-switcher {
			display: flex;
			gap: 0.25rem;
		}
		.mode-btn {
			padding: 0.25rem 0.75rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			cursor: pointer;
			border-radius: var(--radius-sm);
			text-transform: capitalize;
		}
		.mode-btn.active {
			background: var(--color-primary);
			color: var(--color-on-primary);
			border-color: var(--color-primary);
		}
	}
</style>
