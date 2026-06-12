<!--
FieldSelect.svelte
FK-aware select field atom. Show mode renders the resolved FK label
(passed via `display`); edit mode queries machine store for options.
@role field-atom
@prop {unknown} value - Current FK value (bindable)
@prop {string} [display] - Resolved FK label for show mode
@prop {string} collection - Target collection name (from fk-collection.field)
@prop {string} [targetField] - Target field written as option value. Defaults to scheme index.
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let {
		value = $bindable(undefined),
		display = undefined as string | undefined,
		mode = 'show',
		collection,
		targetField,
		id,
		name,
		form,
		disabled = false,
		multiple = false
	} = $props<{
		value?: unknown;
		display?: string;
		mode?: 'show' | 'create' | 'update';
		collection: string;
		targetField?: string;
		id?: string;
		name?: string;
		form?: string;
		disabled?: boolean;
		multiple?: boolean;
	}>();

	const scheme     = $derived(machine.logic.collectionOr(collection, null));
	const indexField = $derived(targetField ?? scheme?.index ?? 'id');
	const store      = $derived(machine.store(collection));
	const items      = $derived(store.records ?? []);

	function getLabel(item: Record<string, unknown>): string {
		return scheme?.collectionValues.presentation(item) || String(item[indexField] ?? '—');
	}
</script>

{#if mode === 'show'}
	<span class="field-value">{display ?? '—'}</span>
{:else if multiple}
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
