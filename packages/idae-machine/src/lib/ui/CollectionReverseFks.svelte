
<script lang="ts"> 
	import type { Tpl, TplCollectionName, Where } from '@medyll/idae-idbql';
	import { Looper } from '@medyll/idae-slotui-svelte';
	import type { Snippet, SvelteComponent } from 'svelte';
    import { machine } from '$lib/main/machine.js';

	type CollectionFksProps = {
		collection:      TplCollectionName;
		collectionId?:   any;
		where?:          Where;
		children:        Snippet<[{ collection: string; template: Tpl }]>;
		showTitle?:      boolean | string;
		component?:      typeof SvelteComponent;
		componentProps?: Record<string, any>;
	};
	let { collection, children: child, showTitle = false, component, componentProps = {} }: CollectionFksProps = $props();
	
	const dbFields = machine;
	const reverseFks = $derived( machine.logic.collection(collection).parseReverseFks());

	function getTitle() {
		if (typeof showTitle === 'string') return showTitle;
		return showTitle ? `Related ${collection}` : '';
	}
</script>

<Looper data={Object.entries(reverseFks)}>
	{#snippet children({ item })}
		{#if showTitle}
			<div class="p2 font-bold">{item?.[0]}</div>
		{/if}
		{#if component}
			<svelte:component this={component} collection={item[0]} template={item[1]} {...componentProps} />
		{:else}
			{@render child({
				collection: item[0],
				template: item[1]
			})}
		{/if}
	{/snippet}
</Looper>
