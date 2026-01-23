<!-- CollectionFieldGuess.svelte -->
<script lang="ts">
	import type { TplCollectionName } from '@medyll/idae-idbql';
	import { IconButton } from '@medyll/idae-slotui-svelte';

	let { collection, collectionId, fieldName, data, onGuess } = $props<{
		collection:    TplCollectionName;
		collectionId?: any;
		fieldName:     string;
		data:          Record<string, any>;
		onGuess:       (fieldName: string, value: string) => void;
	}>();



</script>

<IconButton icon="mdi:brain" tall="tiny"    />
