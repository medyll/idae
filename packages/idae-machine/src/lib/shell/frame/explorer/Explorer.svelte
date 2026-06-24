<!--
Explorer.svelte
Unified collection browser — TemplateShell layout: collection nav sidebar + content zone.
Content zone starts empty; sidebar clicks loadIn ExplorerContent into this Explorer's
zone (toggle, state preserved across collection switches).
Sidebar = DataList over appscheme, grouped by fks.appscheme_base (company services).
@role explorer
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import TemplateShell from '$lib/shell/layout/TemplateShell.svelte';
	import { untrack } from 'svelte';
	import { generateFrameId } from '$lib/main/frame/frameUtils.js';
	import type { SortBy } from '$lib/types/index.js';

	let {
		collection,
		sortBy
	}: {
		collection: string;
		sortBy?: SortBy;
	} = $props();

	const frameId = untrack(() => generateFrameId(collection));
</script>

<TemplateShell zoneId={frameId} collection={collection}>
	{#snippet leftbar()}
		<DataList collection="appscheme" {sortBy} link="loadIn:explorer.content@{frameId}" linkCollectionField="code" groupBy="fks.appscheme_base" />
	{/snippet}
</TemplateShell>
