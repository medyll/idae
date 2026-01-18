/**
 * DemoerComponent.svelte
 * Affiche la démo d'un composant avec citation, code, titre et slots personnalisés.
 *
 * Props :
 * - component (string) : nom du composant à documenter
 * - cite (string) : citation associée
 * - code (string) : code source à afficher
 * - title (string) : titre de la démo
 * - componentArgs, parameters (object) : props et paramètres du composant
 * - children (slot/Snippet) : contenu de la démo
 *
 * Utilise <Slotted> pour l'injection de contenu, et componentCite pour les citations.
 */
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

<div class="flex-v gap-large w-full">
	<div class="flex-v gap-small flex-align-middle">
		<h5>{`<${component} />`}</h5>
		<!-- <span>@medyll/slotted/{compDet?.group}/{compDet?.code}.svelte</span> -->
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
