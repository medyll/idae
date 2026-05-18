<!--
CardCreate.svelte
Form for creating a new record. Thin wrapper around CardForm locked to mode="create".
@role card-form
@prop {string} collection - Collection name
@prop {Record<string,unknown>} [withData] - Additional data to merge
@prop {string[]} [showFields] - Fields to display (default: all)
@prop {'vertical'|'wrap'} [displayMode] - Field layout mode
@prop {(payload: unknown) => void} [onsubmit] - Callback on successful create
-->
<script lang="ts" generics="COL = Record<string,unknown>">
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import type { CreateProps } from './types.js';

	let { onsubmit, ...props }: CreateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();
</script>

<CardForm {...props} mode="create" {onsubmit} />
