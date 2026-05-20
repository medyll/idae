<!--
CardRfk.svelte
Retro-compat wrapper for DataRfk.
-->
<script lang="ts">
	import DataRfk from '$lib/data-ui/data/DataRfk.svelte';
	import type { TplCollectionName } from '$lib/types/machine-model.js';
	import type { Where } from '@medyll/qoolie';
	import type { SvelteComponent } from 'svelte';

	let { collection, collectionId, showTitle = false, component, componentProps = {}, children } = $props<{
		collection: TplCollectionName;
		collectionId?: string | number;
		where?: Where;
		showTitle?: boolean | string;
		component?: typeof SvelteComponent;
		componentProps?: Record<string, any>;
		children?: any;
	}>();
</script>

<DataRfk {collection} {collectionId} {showTitle} {component} {componentProps} {children} />
