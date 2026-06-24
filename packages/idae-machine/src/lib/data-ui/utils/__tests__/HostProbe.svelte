<script lang="ts">
	import { useRecordData } from '../useRecordData.svelte.js';

	let {
		collection,
		collectionId,
		data
	}: {
		collection: string;
		collectionId?: string | number;
		data?: Record<string, unknown>;
	} = $props();

	const recordData = useRecordData(() => collection, () => ({ collectionId, data }));
</script>

<span data-testid="code">{recordData.record?.code ?? ''}</span>
<span data-testid="collectionId">{recordData.collectionId ?? ''}</span>
