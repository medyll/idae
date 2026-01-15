<script lang="ts">
	import { IDbBase } from '$lib/db/dbFields.js';
	import { schemeModel, idbqlState } from '$lib/db/dbSchema.js';
	import type { TplCollectionName, Where } from '@medyll/idae-idbql';
	import { Looper } from '@medyll/idae-slotui-svelte';

	import { machine } from '$lib/main/machine.js'; 
	type CollectionFksProps = {
		collection:    TplCollectionName;
		collectionId?: any;
		where?:        Where;
	};
	let { collection }: CollectionFksProps = $props();

	// idbqlState[fkCollection].get(fkId);

	const dbFields = machine.collections;
	const collections = new IDbBase(schemeModel);
	const fks = $derived(collections.fks(collection));
</script>

<Looper data={Object.entries(fks)}>
	{#snippet children({ item })}
		<div>{item[0]}</div>
	{/snippet}
</Looper>
