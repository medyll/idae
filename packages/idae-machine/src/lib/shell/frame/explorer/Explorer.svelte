<!--
Explorer.svelte
Unified collection browser — TemplateShell layout: collection nav sidebar + content zone.
Content zone starts empty; sidebar clicks loadIn ExplorerContent into this Explorer's
zone (toggle, state preserved across collection switches).
@role explorer
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import MenuTree from '$lib/shell/layout/MenuTree.svelte';
	import TemplateShell from '$lib/shell/layout/TemplateShell.svelte';
	import { untrack } from 'svelte';
	import { generateFrameId } from '$lib/main/frame/frameUtils.js';

	let {
		collection
	}: {
		collection: string;
	} = $props();

	const frameId = untrack(() => generateFrameId(collection));
</script>

<TemplateShell zoneId={frameId} collection={collection}>
	{#snippet leftbar()}
		<MenuTree zone="side" link="loadIn:explorer.content@{frameId}" />
	{/snippet}
</TemplateShell>
