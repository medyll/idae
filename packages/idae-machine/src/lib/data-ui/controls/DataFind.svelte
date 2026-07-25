<!--
DataFind.svelte
Debounced schema-aware search. Advanced mode exposes the field and match operator.

@prop {string} collection - Source collection (used for advanced field discovery)
@prop {string} [defaultField] - Field name to search (falls back to template.presentation first token)
@prop {Record<string, unknown> | undefined} where - Bindable qoolie where fragment owned by this control
	@prop {boolean} [advanced=false] - Expose field picker + partial/exact mode
@prop {number} [debounceMs=250] - Debounce delay for input → where
-->
<script module lang="ts">
	export interface DataFindProps {
		collection: string;
		defaultField?: string;
		where?: Record<string, unknown> | undefined;
		advanced?: boolean;
		debounceMs?: number;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import type { MachineFieldDef } from '$lib/types/index.js';

	type MatchMode = 'partial' | 'exact';
	type FieldOption = { field: string; label: string; type: string };

	let {
		collection,
		defaultField,
		where = $bindable(undefined),
		advanced = false,
		debounceMs = 250
	}: DataFindProps = $props();

	let value = $state('');
	let selectedField = $state<string | undefined>(undefined);
	let matchMode = $state<MatchMode>('partial');

	const fieldOptions = $derived.by((): FieldOption[] => {
		const logic = machine.logic.collection(collection);
		const fields = (logic?.fields ?? {}) as Record<string, MachineFieldDef>;
		const skipped = new Set(['id', 'json', 'password', 'image', 'file']);
		return Object.entries(fields)
			.filter(([name, definition]) => !name.startsWith('_') && !skipped.has(definition.type ?? 'text'))
			.map(([field, definition]) => ({ field, label: field, type: definition.type ?? 'text' }));
	});

	const effectiveField = $derived.by(() => {
		if (selectedField) return selectedField;
		if (defaultField) return defaultField;
		const collLogic = machine.logic.collection(collection);
		const presentation = collLogic?.template?.presentation as string | undefined;
		return presentation?.split(/\s+/).filter(Boolean)[0];
	});

	const effectiveType = $derived(
		fieldOptions.find((option) => option.field === effectiveField)?.type ?? 'text'
	);
	const supportsPartial = $derived(
		['text', 'text-area', 'email', 'url', 'phone'].includes(effectiveType)
	);

	$effect(() => {
		if (!selectedField || !fieldOptions.some((option) => option.field === selectedField)) {
			selectedField = defaultField ?? fieldOptions.find((option) => option.field === effectiveField)?.field ?? fieldOptions[0]?.field;
		}
		if (!supportsPartial && matchMode === 'partial') matchMode = 'exact';
	});

	let timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const kw = value.trim();
		const field = effectiveField;
		const mode = supportsPartial ? matchMode : 'exact';
		const fieldType = effectiveType;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			untrack(() => {
				if (!field || !kw) {
					where = undefined;
				} else {
					let queryValue: unknown = kw;
					if (mode === 'exact' && ['number', 'integer', 'currency'].includes(fieldType)) {
						const parsed = Number(kw);
						queryValue = Number.isNaN(parsed) ? kw : parsed;
					} else if (mode === 'exact' && fieldType === 'boolean') {
						queryValue = kw === 'true';
					}
					// Operator keys are BARE, never $-prefixed: qoolie's matchOperators
					// switches on 'eq'/'contains'/... with no default branch, so a '$eq'
					// key is skipped and the clause silently matches every record.
					// (The $-spelling in node_modules/@medyll/qoolie/dist/lib/operators.d.ts
					// is a stale published artifact — packages/qoolie/src is authoritative.)
					where = { [field]: { [mode === 'exact' ? 'eq' : 'contains']: queryValue } };
				}
			});
		}, debounceMs);
		return () => {
			if (timer) clearTimeout(timer);
		};
	});

	function clear(): void {
		value = '';
	}
</script>

<div class="data-find">
	{#if advanced}
		<select class="form-select data-find-field" aria-label="Search field" bind:value={selectedField}>
			{#each fieldOptions as option (option.field)}
				<option value={option.field}>{option.label}</option>
			{/each}
		</select>
		<select class="form-select data-find-mode" aria-label="Search mode" bind:value={matchMode} disabled={!supportsPartial}>
			<option value="partial">Contains</option>
			<option value="exact">Equals</option>
		</select>
	{/if}
	<input
		type="search"
		class="data-find-input"
		placeholder={effectiveField ? `Find by ${effectiveField}…` : 'Find…'}
		aria-label={effectiveField ? `Find by ${effectiveField}` : 'Find records'}
		bind:value
	/>
	{#if value}
		<button type="button" class="data-find-clear" onclick={clear} aria-label="Clear search">×</button>
	{/if}
</div>

<style>
	@layer components {
		.data-find {
			display: inline-flex;
			align-items: center;
			gap: var(--gutter-xs);
			position: relative;
		}
		.data-find-input {
			min-height: var(--control-height);
			padding: var(--pad-xs) var(--pad-sm);
			border: var(--focus-ring-width) solid var(--color-border);
			background: var(--color-surface-raised);
			border-radius: var(--radius-sm);
			font-size: var(--text-sm);
			min-inline-size: calc(var(--gutter-3xl) * 2.5);
		}
		.data-find-field {
			min-inline-size: calc(var(--gutter-3xl) * 2);
		}
		.data-find-mode {
			min-inline-size: calc(var(--gutter-3xl) * 1.5);
		}
		.data-find-clear {
			position: absolute;
			right: var(--gutter-xs);
			top: 50%;
			transform: translateY(-50%);
			background: transparent;
			border: none;
			cursor: pointer;
			min-height: 0;
			font-size: var(--text-md);
			line-height: 1;
			color: var(--color-text-muted);
			padding: 0 var(--pad-xs);
			box-shadow: none;
		}
	}
</style>
