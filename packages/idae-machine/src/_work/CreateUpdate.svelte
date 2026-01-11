<!-- CreateUpdate.svelte - Initial version based on README.md -->
<script lang="ts">
	/**
	 * CreateUpdate component (Svelte 5)
	 * Props: collection, mode, dataId, showFields, inPlaceEdit, showFks
	 * TODO: implement form logic, field rendering, FK support
	 */
	let {
		collection,
		mode = 'create',
		dataId = null,
		showFields = [],
		inPlaceEdit = false,

		showFks = false,
		crud
	}: {
		collection: string;
		mode?: 'create' | 'update' | 'show';
		dataId?: number | null;
		showFields?: string[];
		inPlaceEdit?: boolean;
		showFks?: boolean;
		crud?: any;
	} = $props();

	import { schemeModelDb } from './dbSchema';

	let formData = $state<any>({});
	let errors = $state<Record<string, string>>({});

	function validate() {
		errors = {};
		const schema = schemeModelDb[collection]?.fields || {};
		for (const field of showFields) {
			const rule = schema[field];
			const value = formData[field];
			if (rule?.required && (value === undefined || value === null || value === '')) {
				errors[field] = 'This field is required.';
			} else if (rule?.type === 'number' && value !== undefined && value !== null && value !== '') {
				if (isNaN(Number(value))) {
					errors[field] = 'Must be a number.';
				}
			} else if (rule?.type === 'email' && value) {
				if (!/^\S+@\S+\.\S+$/.test(value)) {
					errors[field] = 'Invalid email address.';
				}
			} else if (rule?.type === 'boolean' && value !== undefined && value !== null && value !== '') {
				if (!(value === true || value === false || value === 'true' || value === 'false' || value === 1 || value === 0)) {
					errors[field] = 'Must be true or false.';
				}
			}
		}
		return Object.keys(errors).length === 0;
	}

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (validate()) {
			if (crud && mode === 'update' && dataId != null) {
				crud.update(collection, dataId, { ...formData });
				dispatch('update', { id: dataId, data: { ...formData } });
			} else if (crud && mode === 'create') {
				const created = crud.create(collection, { ...formData });
				dispatch('create', { data: created });
			}
		}
	}
</script>

<div class="create-update">
	<h2>{collection} - {mode}</h2>
	<form on:submit={handleSubmit} autocomplete="off">
		{#each showFields as field}
			<div class="field">
				<label for={field + '-input'}>{field}</label>
				<input
					id={field + '-input'}
					type="text"
					bind:value={formData[field]}
					readonly={mode === 'show'}
				/>
				{#if errors[field]}
					<span class="error">{errors[field]}</span>
				{/if}
			</div>
		{/each}
		{#if mode !== 'show'}
			<button type="submit">{mode === 'create' ? 'Create' : 'Update'}</button>
		{/if}
	</form>
	{#if showFks}
		<div class="fks">Foreign keys section (to implement)</div>
	{/if}
</div>

<style>
	.create-update {
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		max-width: 400px;
		margin: 0 auto;
	}
	.field {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: bold;
	}
	input[type='text'] {
		width: 100%;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
	button {
		padding: 0.5rem 1.5rem;
		border-radius: 4px;
		border: none;
		background: #0077ff;
		color: #fff;
		font-weight: bold;
		cursor: pointer;
	}
	.fks {
		margin-top: 1.5rem;
		background: #f7f7f7;
		padding: 1rem;
		border-radius: 6px;
	}
	.error {
		color: #c00;
		font-size: 0.9em;
		margin-left: 0.5rem;
	}
</style>
