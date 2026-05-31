<!--
InputSelect.svelte
FK-aware select input atom. Queries machine store for related collection records.
@role input-atom
@prop {unknown} value - Current FK value (bindable)
@prop {string} collection - Target collection name (from fk-collection.field)
@prop {string} [targetField] - Target field written as option value (from fk-X.field). Defaults to scheme index.
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
		targetField,
		id,
		name,
		form,
		disabled  = false,
		multiple  = false
	} = $props<{
		value?:       unknown;
		collection:   string;
		targetField?: string;
		id?:          string;
		name?:        string;
		form?:        string;
		disabled?:    boolean;
		multiple?:    boolean;
	}>();

	const scheme     = $derived(machine.logic.collectionOr(collection, null));
	const indexField = $derived(targetField ?? scheme?.index ?? 'id');
	const store      = $derived(machine.store(collection));
	const items      = $derived(store.items ?? []);

	function getLabel(item: Record<string, unknown>): string {
		return scheme?.collectionValues.presentation(item) || String(item[indexField] ?? '—');
	}
</script>

{#if multiple}
	<select multiple bind:value={value as string[]} {id} {name} {form} {disabled}>
		{#each items as item (item[indexField])}
			<option value={item[indexField]}>{getLabel(item)}</option>
		{/each}
	</select>
{:else}
	<select bind:value {id} {name} {form} {disabled}>
		<option value={undefined}>—</option>
		{#each items as item (item[indexField])}
			<option value={item[indexField]}>{getLabel(item)}</option>
		{/each}
	</select>
{/if}

<style>
	select { width: 100%; }
</style>
