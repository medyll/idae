<!--
Group.svelte
Composable group-by control — prefs-aware wrapper around DataGroup.
Shares the same prefs store as the matching <DataList collection> (mediator).

@prop {string} collection
@prop {string} [prefsScope] - override scope (must match the DataList's)
@prop {boolean} [usePrefs=true]
-->
<script lang="ts">
	import {
		useMachinePrefs,
		dataListPrefsScope,
		dataListPrefsDefaults
	} from '$lib/data-ui/utils/useMachinePrefs.svelte.js';
	import DataGroup from './DataGroup.svelte';

	let {
		collection,
		prefsScope,
		usePrefs = true
	}: { collection: string; prefsScope?: string; usePrefs?: boolean } = $props();

	const scope = $derived(dataListPrefsScope(collection, prefsScope));
	const prefs = useMachinePrefs(() => scope, dataListPrefsDefaults(), () => usePrefs);
</script>

<DataGroup {collection} bind:groupBy={() => prefs.get('groupBy'), (v) => prefs.set('groupBy', v)} />
