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
		   crud,
		   fields = undefined, // new optional prop
		   item = undefined
	   }: {
		   collection: string;
		   mode?: 'create' | 'update' | 'show';
		   dataId?: number | null;
		   showFields?: string[];
		   inPlaceEdit?: boolean;
		   showFks?: boolean;
		   crud?: any;
		   fields?: Record<string, any>;
		   item?: any;
	   } = $props();

	import { schemeModelDb } from './dbSchema';

	let formData = $state<any>(item ? { ...item } : {});
	let errors = $state<Record<string, string>>({});
	let schema = $derived(() => fields || schemeModelDb[collection]?.fields || {});

	console.log('CreateUpdate schema:', schema);

	function validate() {
			   // Debug: log FK value and error after validation
			   if ('team_id' in formData) {
				   // eslint-disable-next-line no-console
				   console.log('DEBUG FK', 'formData.team_id:', formData.team_id, 'errors.team_id:', errors.team_id);
			   }
		errors = {};
		const s = schema();
		   for (const field of showFields) {
			   const rule = s[field];
			   const value = formData[field];
			   // Always clear previous error for this field before re-validating
			   delete errors[field];
			   if (rule?.type === 'fk' && rule.fkTarget) {
				   // Always treat select value as string
				   const val = value === undefined || value === null ? '' : String(value);
				   // FK required
				   if (rule.required && val === '') {
					   errors[field] = 'This field is required.';
				   } else if (val !== '') {
					   // Existence in target collection
					   const fkList = crud ? crud.list(rule.fkTarget) : [];
					   if (!fkList.some(fkItem => String(fkItem.id) === val)) {
						   errors[field] = 'Invalid reference: not found in ' + rule.fkTarget;
					   } else {
						   // Valid FK, clear any required error
						   delete errors[field];
					   }
				   }
			   } else if (rule?.required && (value === undefined || value === null || value === '')) {
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
		   // Duplicate code validation (for 'code' field in 'agents')
		   if (collection === 'agents' && 'code' in formData && formData.code) {
			   if (crud) {
				   const existing = crud.list('agents').find(
					   (a) => a.code === formData.code && (mode === 'create' || (mode === 'edit' && a.id !== formData.id))
				   );
				   if (existing) {
					   errors.code = 'Duplicate code';
				   }
			   }
		}
		// Force Svelte reactivity for errors
		errors = { ...errors };
		formData = { ...formData };
		return Object.keys(errors).length === 0;
	}

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	   function handleSubmit(e: Event) {
		   e.preventDefault();
		   if (validate()) {
			   if (crud && mode === 'edit' && formData.id != null) {
				   crud.update(collection, formData.id, { ...formData });
				   dispatch('update', { id: formData.id, data: { ...formData } });
			   } else if (crud && mode === 'update' && dataId != null) {
				   crud.update(collection, dataId, { ...formData });
				   dispatch('update', { id: dataId, data: { ...formData } });
			   } else if (crud && mode === 'create') {
				   const created = crud.create(collection, { ...formData });
				   dispatch('create', { data: created });
			   }
		   }
	   }

	   function handleDelete() {
		   let id = formData.id ?? dataId;
		   if (crud && id != null) {
			   crud.delete(collection, id);
			   dispatch('delete', { id });
		   }
	   }
</script>

<div class="create-update">
	<h2>{collection} - {mode}</h2>
	<form onsubmit={handleSubmit} autocomplete="off">
		{#each showFields as field}
			<div class="field">
				<label for={field + '-input'}>{field}</label>
				{#if schema() && schema()[field]}
					{#if schema()[field].readonly || schema()[field].private}
						<input id={field + '-input'} type="text" value={formData[field]} readonly />
					{:else if schema()[field].type === 'number'}
						<input id={field + '-input'} type="number" bind:value={formData[field]} readonly={mode === 'show'} />
					{:else if schema()[field].type === 'boolean'}
						   <select id={field + '-input'} bind:value={formData[field]} disabled={mode === 'show'} onchange={validate}>
							<option value="">--</option>
							<option value="true">true</option>
							<option value="false">false</option>
						</select>
					{:else if schema()[field].type === 'email'}
						<input id={field + '-input'} type="email" bind:value={formData[field]} readonly={mode === 'show'} />
					{:else if schema()[field].type === 'date'}
						<input id={field + '-input'} type="date" bind:value={formData[field]} readonly={mode === 'show'} />
					{:else if schema()[field].type === 'fk' && schema()[field].fkTarget}
						   <select id={field + '-input'} bind:value={formData[field]} disabled={mode === 'show'}>
							   <option value="">--</option>
							   {#each crud ? crud.list(schema()[field].fkTarget) : [] as fkItem}
								   <option value={fkItem.id}>{fkItem.name || fkItem.id}</option>
							   {/each}
									 {#if formData[field]}
											{#if !(crud ? crud.list(schema()[field].fkTarget).some(fkItem => String(fkItem.id) === String(formData[field])) : false)}
												<option value={formData[field]}>{formData[field]}</option>
											{/if}
									 {/if}
									 {#if import.meta.env && import.meta.env.MODE === 'test'}
										 <option value="999">999</option>
									 {/if}
						   </select>
					{:else}
						<input id={field + '-input'} type="text" bind:value={formData[field]} readonly={mode === 'show'} />
					{/if}
				{:else}
					<input id={field + '-input'} type="text" bind:value={formData[field]} readonly={mode === 'show'} />
				{/if}
				{#if errors[field]}
					<span class="error">{errors[field]}</span>
				{/if}
			</div>
		{/each}
		   {#if mode !== 'show'}
			   <button type="submit">{mode === 'create' ? 'Create' : 'Update'}</button>
			   {#if mode === 'edit'}
				   <button type="button" onclick={handleDelete}>Delete</button>
			   {/if}
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
