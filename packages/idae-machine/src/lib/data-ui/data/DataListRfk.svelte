<script lang="ts">
	import DataListRelations from './DataListRelations.svelte';
	let { collection, recordId, data, fk, showTitle, usePrefs, prefsScope, ...rest }:
		{ collection: string; recordId?: string|number; data?: Record<string,unknown>|null; fk?: string;
		  showTitle?: boolean; usePrefs?: boolean; prefsScope?: string;
		  [key: string]: unknown } = $props();
</script>
<DataListRelations direction="reverse" {collection} {recordId} {data} {fk} {showTitle} {usePrefs} {prefsScope} {...rest} />
