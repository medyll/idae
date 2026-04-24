<!--
DataCreate.svelte
Form component for creating a new record in a collection.
Thin wrapper around DataForm locked to mode="create".
@role form
@prop {string} collection - Collection name
@prop {Record<string,unknown>} [withData] - Additional data to merge into the new record
@prop {string[]} [showFields] - Fields to display (default: all)
@prop {'vertical'|'wrap'} [displayMode] - Field layout mode
@prop {(payload: unknown) => void} [onsubmit] - Callback on successful create
-->
<script lang="ts" generics="COL = Record<string,unknown>">
	import DataForm from '$lib/data/DataForm.svelte';
	import type { CreateProps } from '$lib/form/types.js';

	let { onsubmit, ...props }: CreateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();
</script>

<DataForm {...props} mode="create" {onsubmit} />
