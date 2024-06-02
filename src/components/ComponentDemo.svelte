<script lang="ts">
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	import { componentCite } from '$lib/componentCite.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';
	/* export let component: string = '';
	export let cite: string = componentCite?.[component] ?? ''; */

	let {
		component,
		cite = componentCite?.[component] ?? '',
		children
	}: {
		component: string;
		cite: string;
		children: Snippet;
	} = $props();

	let citation = componentCite?.[component.toLowerCase()]?.cite ?? '';
	let author = componentCite?.[component.toLowerCase()]?.author ?? '';

	const compDet = Object.values(slotuiCatalog).find((x) => x.name === component);
</script>

<div class="flex-v gap-large w-full">
	<div class="flex-h gap-small flex-align-middle">
		<h4>{`<${component} />`}</h4>
		<span>{compDet?.group}/{compDet?.code}.svelte</span>
	</div>
	<cite><p>"{@html citation}"<br />{@html author}</p></cite>
	{#if children}
		<div class="flex-v gap-medium">
			<h5>Component {component} demo :</h5>
			<div class="marg-l-4">
				<Slotted child={children} />
			</div>
		</div>
	{/if}
</div>
