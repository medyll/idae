<!--
FkFilter.svelte
Single-FK select filter. Options are the target collection's records, labeled via
its presentation template. Emits a where fragment matching whichever convention the
source collection actually stores the relation in: the flat scalar field resolved via
scheme.findFkField (e.g. `category: "compact"` — the common case in real/seed data),
falling back to the nested join snapshot dot path (`fks.<fkName>.code`) when no flat
field is registered. Same nested-then-flat priority as dataRelationUtils.resolveForwardRelations.

@prop {string} collection - source collection (owns the FK)
@prop {string} fkName - key in scheme.fks
@prop {Where|undefined} [where] - $bindable
@prop {string|undefined} [value] - $bindable selected target code
@prop {string} [label] - defaults to fkName
-->
<script module lang="ts">
	import type { Where } from '$lib/types/index.js';

	export interface FkFilterProps {
		collection: string;
		fkName: string;
		where?: Where | undefined;
		value?: string | undefined;
		label?: string;
	}
</script>

<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		fkName,
		where = $bindable(undefined),
		value = $bindable(undefined),
		label
	}: FkFilterProps = $props();

	const scheme = machine.logic.collection(collection);
	const targetCollection = scheme?.fks?.[fkName]?.code;
	// findFkField matches on the TARGET collection, so a source declaring two FKs to the
	// same target resolves both to the first one — filtering by either then narrows the
	// same field. No current model does this; revisit here if one starts to.
	const fieldInfo = targetCollection ? (scheme?.findFkField(targetCollection) ?? null) : null;
	const targetIndexKey = fieldInfo?.targetIndex ?? 'code';

	// Setup-time subscription — fkName/targetCollection are fixed per instance.
	const targetStore = targetCollection ? machine.store<Record<string, unknown>>(targetCollection) : null;
	const targetScheme = targetCollection ? machine.logic.collection(targetCollection) : null;

	const options = $derived.by(() => {
		if (!targetStore || !targetScheme) return [];
		return (targetStore.records as Record<string, unknown>[])
			.map((record) => ({
				key: String(record[targetIndexKey] ?? record.code ?? record.id ?? ''),
				label: targetScheme.collectionValues.presentation(record) || String(record.code ?? record.id ?? '')
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
	});

	function select(next: string): void {
		value = next || undefined;
		if (!value) {
			where = undefined;
		} else {
			where = fieldInfo ? { [fieldInfo.fieldName]: value } : { [`fks.${fkName}.code`]: value };
		}
	}
</script>

<label class="fk-filter">
	<span class="fk-filter-label">{label ?? fkName}</span>
	<select class="form-select" value={value ?? ''} onchange={(e) => select(e.currentTarget.value)}>
		<option value="">Tous</option>
		{#each options as option (option.key)}
			<option value={option.key}>{option.label}</option>
		{/each}
	</select>
</label>

<style>
	@layer components {
		.fk-filter {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
		}
		.fk-filter-label {
			font-size: var(--text-xs);
			color: var(--color-text-muted);
			text-transform: capitalize;
		}
	}
</style>
