<!--
CollectionButton.svelte
Svelte 5 button to open CreateUpdate window for a collection
@role ui-button
@prop {string} collection - Collection name
@prop {object} [withData] - Data to prefill
@slot button - Custom button content
@event click - Emitted on button click
-->

<script lang="ts" generics="COL">
	import { Button, openWindow } from '@medyll/idae-slotui-svelte';
	import CreateUpdate from '$lib/form/CreateUpdate.svelte';
	import { type CreateUpdateProps } from '../form/types.js';
	let { collection = 'book', withData, ...rest } = $props<{ collection?: string; withData?: Record<string, any> } & CreateUpdateProps>();
	function openCrud(collection: string) {
		openWindow(`create-${collection}`, {
			component:       CreateUpdate,
			componentProps:  { collection, withData, ...rest },
			hideCloseButton: false
		});
	}
</script>

{#snippet button()}
	<Button class="ellipsis" onclick={() => openCrud(collection)} width="auto" icon="mdi:add" value={`ui.${rest.mode}-${collection}`} />
{/snippet}

{@render button()}
