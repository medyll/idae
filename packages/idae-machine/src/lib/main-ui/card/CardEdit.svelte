<!--
CardEdit.svelte
Form for editing an existing record. Thin wrapper around CardForm locked to mode="update".
@role card-form
@prop {string} collection - Collection name
@prop {Record<string,unknown>} [data] - Record to edit
@prop {unknown} [dataId] - Record ID
@prop {Record<string,unknown>} [withData] - Additional data to merge
@prop {string[]} [showFields] - Fields to display (default: all)
@prop {boolean|string[]} [inPlaceEdit] - Enable in-place editing
@prop {'vertical'|'wrap'} [displayMode] - Field layout mode
@prop {boolean} [showFks] - Show reverse FK relationships
@prop {(payload: unknown) => void} [onsubmit] - Callback on successful update
-->
<script lang="ts" generics="COL = Record<string,unknown>">
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import type { UpdateProps } from '$lib/form/types.js';

	let { onsubmit, ...props }: UpdateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();
</script>

<CardForm {...props} mode="update" {onsubmit} />
