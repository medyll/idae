<!--
DataForm.svelte
Smart CRUD form — fetch, validate, submit, field iteration.
@role data-form
@prop {string} collection - Collection name
@prop {string} [dataId] - Record id for update/show mode
@prop {'show'|'create'|'update'} [mode] - Form mode
@prop {Record<string,unknown>} [withData] - Additional data to merge
@prop {Record<string,unknown>} [data] - Initial data override
@prop {SortBy | SortBy[]} [sortBy] - Sort field order
@prop {string} [groupBy] - Group fields by field def property
@prop {(payload: {mode: string; data: Record<string,unknown>}) => void} [onsubmit] - Submit callback
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import { machine } from '$lib/main/machine.js';
	import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
	import type { SortBy } from '$lib/types/machine-model.js';
	import DataFields from './DataFields.svelte';

	let {
		onsubmit: onsubmit_callback,
		mode = 'create',
		collection,
		data,
		dataId,
		withData,
		sortBy,
		groupBy
	}: {
		onsubmit?: (payload: { mode: string; data: Record<string, unknown> }) => void;
		mode?: 'show' | 'create' | 'update';
		collection: string;
		data?: Record<string, unknown>;
		dataId?: string | number;
		withData?: Record<string, unknown>;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
	} = $props();

	const store = $derived(collection ? machine.store[collection] : undefined);
	const collLogic = $derived(collection ? safeCollection(collection) : null);
	const formFields = $derived(collLogic?.parse() ?? {});
	const validator = $derived(collLogic?.validator);
	const indexName = $derived(collLogic?.index);

	const inputFormId = $derived(`form-${String(collection ?? '')}-${mode ?? ''}`);

	let formData = $state<Record<string, unknown>>({});
	let validationErrors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	$effect(() => {
		if (mode === 'create') {
			formData = {
				...SchemeFieldDefaultValues.getDefaults(Object.keys(formFields), collection),
				...data,
				...withData
			};
		} else if (store && dataId) {
			const id = isNaN(Number(dataId)) ? dataId : Number(dataId);
			(async () => {
				const record = await store.get(id) ?? {};
				formData = { ...data, ...withData, ...record };
			})();
		}
	});

	const validate = async (data: Record<string, unknown>) => {
		const v = validator;
		if (!v || typeof v.validateForm !== 'function') return true;

		const ignore = mode === 'create' && indexName ? [indexName] : undefined;
		const out = await v.validateForm(data, { ignoreFields: ignore });

		validationErrors = out.errors || {};
		return out.isValid;
	};

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;

		const snapshot = $state.snapshot(formData);

		if (!(await validate(snapshot))) {
			isSubmitting = false;
			return;
		}

		try {
			if (mode === 'create' && !dataId) {
				await store?.create({ ...snapshot, ...withData });
			} else if (mode === 'update' && dataId) {
				await store?.update(dataId, snapshot);
			}

			onsubmit_callback?.({ mode, data: snapshot });
		} catch (e) {
			console.error('Submission failed', e);
		} finally {
			isSubmitting = false;
		}
	}

	function safeCollection(name: string) {
		try { return machine.logic.collection(name); } catch { return null; }
	}

	let errorMessage = $state<string | null>(null);

	$effect(() => {
		if (!safeCollection(collection)) {
			errorMessage = `Collection '${collection}' non trouvée dans le schéma.`;
		} else {
			errorMessage = null;
		}
	});
</script>

{#if errorMessage}
	<div class="error-message">{errorMessage}</div>
{:else}
	<form
		id={inputFormId}
		name={inputFormId}
		aria-labelledby="form-title"
		onsubmit={handleSubmit}
	>
	</form>

	<h2 id="form-title" class="sr-only">
		{mode} {collection}
	</h2>

	<div class="flex">
		<div class="crud {mode}">
			<DataFields
				bind:data={formData}
				{collection}
				{mode}
				{sortBy}
				{groupBy}
			/>
		</div>
	</div>

	<div class="toolbar toolbar-end">
		<button
			type="submit"
			class="btn-primary"
			form={inputFormId}
			disabled={isSubmitting}
			aria-label="Submit"
		>
			{isSubmitting ? '...' : 'Valider'}
		</button>
	</div>
{/if}

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0,0,0,0);
		white-space: nowrap;
		border-width: 0;
	}
	.error-message { color: red; padding: 1rem; }
</style>
