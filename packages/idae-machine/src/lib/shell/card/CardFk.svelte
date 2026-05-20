<!--
CardFk.svelte
Retro-compat wrapper for DataFk.
-->
<script lang="ts">
	import DataFk from '$lib/data-ui/data/DataFk.svelte';
	import type { TplCollectionName } from '$lib/types/machine-model.js';
	import type { Where } from '@medyll/qoolie';

	let { collection, collectionId, where, children } = $props<{
		collection: TplCollectionName;
		collectionId?: string | number;
		where?: Where;
		children?: any;
	}>();
</script>

<DataFk {collection} {collectionId} {where} {children} />
