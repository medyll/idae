<!--
Find.svelte
Composable search control — prefs-aware wrapper around DataFind.
Shares the same prefs store as the matching <DataList collection> (mediator).

@prop {string} collection
@prop {string} [prefsScope] - override scope (must match the DataList's)
@prop {boolean} [usePrefs=true]
-->
<script module lang="ts">
	export interface FindProps {
		collection: string;
		prefsScope?: string;
		usePrefs?: boolean;
	}
</script>

<script lang="ts">
	import {
		useMachinePrefs,
		dataListPrefsScope,
		dataListPrefsDefaults
	} from '$lib/data-ui/utils/useMachinePrefs.svelte.js';
	import DataFind from './DataFind.svelte';

	let {
		collection,
		prefsScope,
		usePrefs = true
	}: FindProps = $props();

	const scope = $derived(dataListPrefsScope(collection, prefsScope));
	const prefs = useMachinePrefs(() => scope, dataListPrefsDefaults(), () => usePrefs);
</script>

<DataFind {collection} bind:where={() => prefs.get('find'), (v) => prefs.set('find', v)} />
