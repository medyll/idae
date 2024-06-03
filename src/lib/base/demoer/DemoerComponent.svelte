<script lang="ts">
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	import { componentCite } from '$lib/componentCite.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';
	/* export let component: string = '';
	export let cite: string = componentCite?.[component] ?? ''; */

	let {
		component,
		cite = componentCite?.[component.toLowerCase()] ?? '',
		children
	}: {
		component: string;
		cite?: string;
		children: Snippet;
	} = $props();

	let citation = componentCite?.[component.toLowerCase()]?.cite ?? '';
	let author = componentCite?.[component.toLowerCase()]?.author ?? '';

	const compDet = Object.values(slotuiCatalog).find((x) => x.name === component);
</script>

<div class="flex-v gap-large w-full">
	<div class="flex-h gap-small flex-align-middle">
		<h5>{`<${component} />`}</h5>
		<span>{compDet?.group}/{compDet?.code}.svelte</span>
	</div>
	<cite><p>"{@html citation}"<br />{@html author}</p></cite>
	{#if children}
		<div class="flex-v gap-medium">
			{component} svelte component
			<div class="marg-l-4">
				<Slotted child={children} />
			</div>
		</div>
	{/if}
</div>
