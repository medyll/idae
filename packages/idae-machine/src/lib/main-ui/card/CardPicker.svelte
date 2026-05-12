<!--
CardPicker.svelte
Button that opens a CardForm window for a collection.
@role card-action
@prop {string} collection - Collection name
@prop {object} [withData] - Data to prefill
@slot button - Custom button content
@event click - Emitted on button click
-->

<script lang="ts" generics="COL">
	import { Button, openWindow } from '@medyll/idae-slotui-svelte';
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import { type CreateUpdateProps } from '$lib/form/types.js';
	let { collection = 'book', withData, ...rest } = $props<{ collection?: string; withData?: Record<string, any> } & CreateUpdateProps>();
	function openCrud(collection: string) {
		openWindow(`create-${collection}`, {
			component:       CardForm,
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
