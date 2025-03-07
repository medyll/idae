<script lang="ts" generics="T = Record<string, any>">
	import { Button, openWindow, type Props } from '@medyll/idae-slotui-svelte';
	import CrudCollectionList from './CollectionListMenu.svelte';

	interface CrudZoneProps {
		collection: string;
		data?:      Record<string, any>;
		style?:     ElementCSSInlineStyle;
	}

	let { collection, style }: CrudZoneProps = $props();

</script>

<div style="max-height:100%;height:350px;min-width:750px; {style}" class="flex border">
	<div class="w-48 border">
		<CrudCollectionList {collection} target="collection-list" />
	</div>
	<div data-target-zone="collection-list">ss</div>
</div>
