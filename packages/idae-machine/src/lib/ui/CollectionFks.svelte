<!--
CollectionFks.svelte
Svelte 5 FK relation viewer for a collection
@role ui-fragment
@prop {string} collection - Collection name
@prop {any} [collectionId] - Optional collection id
@prop {object} [where] - Optional filter
@slot children (let:item) - Custom FK rendering
-->


<script lang="ts">
	import type { TplCollectionName, Where } from '@medyll/idae-idbql';
	import { Looper } from '@medyll/idae-slotui-svelte';
	import { machine } from '$lib/main/machine.js';
	let { collection, collectionId, where } = $props<{ collection: TplCollectionName; collectionId?: any; where?: Where }>();
	const fks = $derived(machine.logic.collection(collection).parseFks());
</script>

<Looper data={Object.entries(fks)}>
	{#snippet children(item)}
		<div>{item[0]}</div>
	{/snippet}
</Looper>
