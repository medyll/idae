<!--
DataFkValue.svelte
Reusable reactive renderer of an FK field's resolved presentation value.
Resolves the FK target record via machine.store and formats it through the
target collection's `template.presentation` (MachineSchemeValues.presentation).
Renders the value only — no wrapper tag, no CSS. Drop-in by (collection, fieldName, data).
Used by DataRecord (view="fk") and table cell renders.
@role data-fk-value
@prop {string} collection - Owner collection name
@prop {string} fieldName - FK field name on the owner record
@prop {Record<string,unknown>} data - Owner record holding the raw FK value
-->
<script lang="ts">
	import type { TplCollectionName } from '$lib/types/index.js';
	import { machine } from '$lib/main/machine.js';
	import { parseFkType } from '$lib/data-ui/utils/data-utils.js';

	let {
		collection,
		fieldName,
		data
	}: {
		collection: TplCollectionName;
		fieldName: string;
		data: Record<string, unknown>;
	} = $props();

	function safeScheme(name: string) {
		try { return machine.logic.collection(name); } catch { return null; }
	}

	const scheme    = $derived(collection ? safeScheme(collection) : null);
	const fieldType = $derived(scheme?.field(fieldName).parse()?.fieldType as string | undefined);
	const fk        = $derived(parseFkType(fieldType));
	const rawValue  = $derived(data?.[fieldName]);

	// Reactive target lookup — same path DataList uses. Empty name → { items: [] }.
	const targetStore = $derived(
		fk && rawValue != null
			? machine.store(fk.collection, { [fk.targetIndex]: rawValue } as any)
			: { items: [] as Record<string, unknown>[] }
	);
	const target = $derived(targetStore.items[0] as Record<string, unknown> | undefined);

	const value = $derived.by(() => {
		if (!fk) return '';
		if (rawValue == null) return '—';
		if (!target) return String(rawValue);
		const fkScheme = safeScheme(fk.collection);
		const presented = fkScheme?.collectionValues.presentation(target) ?? '';
		return presented || String(target[fk.targetIndex] ?? rawValue);
	});
</script>

{value}
