<!--
DataLinksBack.svelte
Svelte 5 reverse FK relation viewer for a collection
@role ui-fragment
@prop {string} collection - Collection name
@prop {any} [collectionId] - Optional collection id
@prop {object} [where] - Optional filter
@prop {boolean|string} [showTitle] - Show or override title
@prop {typeof SvelteComponent} [component] - Custom component
@prop {object} [componentProps] - Props for custom component
@slot children (let:collection, let:template) - Custom reverse FK rendering
-->
<script lang="ts">
	import type { Tpl, TplCollectionName, Where } from '@medyll/idae-idbql';
	import type { SvelteComponent } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	let { collection, showTitle = false, component, componentProps = {}, children } = $props<{
		collection: TplCollectionName;
		collectionId?: string | number;
		where?: Where;
		showTitle?: boolean | string;
		component?: typeof SvelteComponent;
		componentProps?: Record<string, any>;
		children?: any
	}>();
	const reverseFks = $derived(machine.logic.collection(collection).parseReverseFks());
	function getTitle() {
		if (typeof showTitle === 'string') return showTitle;
		return showTitle ? `Related ${collection}` : '';
	}
</script>

{#each Object.entries(reverseFks) as item (item[0])}
	<div>
		{#if showTitle}
			<div class="p2 font-bold">{collection}</div>
		{/if}
		{#if component}
			{@const DynComp = component}
			<DynComp collection={collection} template={item[1]} {...componentProps} />
		{:else}
			{#if children}
				{@render children(item)}
			{/if}
		{/if}
	</div>
{/each}
