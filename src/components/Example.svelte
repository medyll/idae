<script lang="ts">
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	import { sitePaths } from '$lib/utils/engine/site.utils.js';
	import { componentCite } from '$lib/componentCite.js';
	export let component: string = '';
	export let cite: string = componentCite?.[component] ?? '';

	$: citation = componentCite?.[component.toLowerCase()]?.cite ?? '';
	$: author = componentCite?.[component.toLowerCase()]?.author ?? '';

	const compDet = Object.values(slotuiCatalog).find((x) => x.name === component);
</script>

<div class="flex-v gap-large w-full">
	<div class="flex-h gap-small flex-align-middle">
		<h4>{`<${component} />`}</h4>
		<span>{compDet?.group}/{compDet?.code}.svelte</span>
	</div>
	<cite><p>"{@html citation}"<br />{@html author}</p></cite>
	{#if $$slots.default}
		<div class="flex-v gap-medium">
			<h5>Component {component} examples :</h5>
			<div class="marg-l-4"><slot /></div>
		</div>
	{/if}
	<div class="flex-v gap-medium">
		<h5>Api preview :</h5>
		<div class="marg-l-4">
			<!-- <CompReadMe /> -->
		</div>
	</div>
	<div class="flex-v gap-medium">
		<h5>Link to api :</h5>
		<div class="marg-l-4">
			<a href={sitePaths.api({ code: component.toLowerCase() })}>Api for component "{component}"</a>
		</div>
	</div>
</div>
