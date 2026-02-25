<script lang="ts" generics="T=Data">
	//import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	import { componentCite } from '$lib/componentCite.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';
	import type { Data } from '$lib/types/index.js';

	let {
		component,
		cite = componentCite?.[component.toLowerCase()] ?? '',
		code,
		title = '',
		componentArgs = {} as T,
		parameters = {} as T,
		children
	}: {
		component: string;
		/** parameters values for the component */
		parameters?: T;
		/** component demo arguments for props */
		componentArgs?: T;
		cite?: string;
		/** code sample */
		code?: string;
		title?: string;
		/** use for several DemoPage */
		children: Snippet;
	} = $props();

	let citation = componentCite?.[component.toLowerCase()]?.cite ?? '';
	let author = componentCite?.[component.toLowerCase()]?.author ?? '';

	// const compDet = '';Object.values(slotuiCatalog).find((x) => x.name === component);
</script>

<div class="flex flex-col gap-large w-full">
	<div class="flex flex-col gap-small flex-align-middle">
		<h5>{`<${component} />`}</h5>
		<!-- <span>@medyll/slotted/{compDet?.group}/{compDet?.code}.svelte</span> -->
	</div>
	<cite><p>"{@html citation}"<br />{@html author}</p></cite>
	{#if children}
		<div class="flex flex-col gap-2">
			{component} svelte component
			<div class="m-l-4">
				<Slotted child={children} />
			</div>
		</div>
	{/if}
</div>
