<!--
DataPicker.svelte
Svelte 5 button to open DataForm window for a collection
@role ui-button
@prop {string} collection - Collection name
@prop {object} [withData] - Data to prefill
@slot button - Custom button content
@event click - Emitted on button click
-->

<script lang="ts" generics="COL">
	import { Button, openWindow } from '@medyll/idae-slotui-svelte';
	import DataForm from '$lib/data/DataForm.svelte';
	import { type CreateUpdateProps } from '$lib/form/types.js';
	let { collection = 'book', withData, ...rest } = $props<{ collection?: string; withData?: Record<string, any> } & CreateUpdateProps>();
	function openCrud(collection: string) {
		openWindow(`create-${collection}`, {
			component:       DataForm,
			componentProps:  { collection, withData, ...rest },
			hideCloseButton: false
		});
	}
</script>

{#snippet button()}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div onclick={() => openCrud(collection)}><Button class="ellipsis" width="auto" icon="mdi:add" value={`ui.${rest.mode}-${collection}`} /></div>
{/snippet}

{@render button()}
