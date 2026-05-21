<!--
InputSelect.svelte
FK-aware select input atom. Queries machine store for related collection records.
@role input-atom
@prop {unknown} value - Current FK id value (bindable)
@prop {string} collection - Target collection name (from fk-collection.field)
@prop {string} [id] - Input id
@prop {string} [name] - Input name
@prop {string} [form] - Form id
@prop {boolean} [disabled] - Disabled state
@prop {boolean} [multiple] - Multiple selection
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let {
		value    = $bindable(undefined),
		collection,
		id,
		name,
		form,
		disabled  = false,
		multiple  = false
	} = $props<{
		value?:      unknown;
		collection:  string;
		id?:         string;
		name?:       string;
		form?:       string;
		disabled?:   boolean;
		multiple?:   boolean;
	}>();

	function safeScheme() {
		try { return machine.logic.collection(collection); } catch { return null; }
	}

	const scheme     = $derived(safeScheme());
	const indexField = $derived(scheme?.template?.index ?? 'id');
	const fkLabelFields = $derived(
		(scheme?.views?.fkLabelView ?? []).map(f => f.name)
	);
	const presentationFields = $derived(
		fkLabelFields.length > 0
			? fkLabelFields
			: (scheme?.template?.presentation ?? 'name').split(' ').filter(Boolean)
	);
	const items = $derived(machine.store?.[collection]?.getAll() ?? []);

	function getLabel(item: Record<string, unknown>): string {
		return presentationFields
			.map((f) => item[f])
			.filter((v) => v !== undefined && v !== null && v !== '')
			.join(' ') || String(item[indexField] ?? '—');
	}
</script>

{#if multiple}
	<select multiple bind:value={value as any} {id} {name} {form} {disabled} style="width:100%;">
		{#each items as item (item[indexField])}
			<option value={item[indexField]}>{getLabel(item)}</option>
		{/each}
	</select>
{:else}
	<select bind:value {id} {name} {form} {disabled} style="width:100%;">
		<option value={undefined}>—</option>
		{#each items as item (item[indexField])}
			<option value={item[indexField]}>{getLabel(item)}</option>
		{/each}
	</select>
{/if}
