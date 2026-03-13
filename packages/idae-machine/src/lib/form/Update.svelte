<!--
Update.svelte
Form component for editing an existing record in a collection.
Thin wrapper around CreateUpdate locked to mode="update".
@role form
@prop {string} collection - Collection name
@prop {Record<string,unknown>} [data] - Record to edit
@prop {unknown} [dataId] - Record ID (used to fetch from store if data not provided)
@prop {Record<string,unknown>} [withData] - Additional data to merge
@prop {string[]} [showFields] - Fields to display (default: all)
@prop {boolean|string[]} [inPlaceEdit] - Enable in-place editing for all or specific fields
@prop {'vertical'|'wrap'} [displayMode] - Field layout mode
@prop {boolean} [showFks] - Show reverse foreign key relationships
@prop {(payload: unknown) => void} [onsubmit] - Callback on successful update
-->
<script lang="ts" generics="COL = Record<string,unknown>">
	import CreateUpdate from '$lib/form/CreateUpdate.svelte';
	import type { UpdateProps } from './types.js';

	let { onsubmit, ...props }: UpdateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();
</script>

<CreateUpdate {...props} mode="update" {onsubmit} />
