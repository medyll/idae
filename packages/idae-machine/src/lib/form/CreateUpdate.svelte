// Form component for creating, updating, or showing a collection item. Handles validation and field rendering.
<!-- 
    Component CreateUpdate :  to open a CreateUpdateShow window for a specific collection.
    Button validate and cancel is in the Window component.
 -->

<script lang="ts" generics="COL = Record<string,any>">
	
	import { IDbFormValidate } from '$lib/main/machine/IDbFormValidate.js';
	// Update the import path if the file exists elsewhere, for example:
		// import type { CreateUpdateProps } from '$lib/form/types.ts';
	// Or, if the type is simple, define it inline as a temporary fix:
		type CreateUpdateProps = {
			collection: string;
			data?: Record<string, any>;
			dataId?: string | number;
			mode?: 'create' | 'update' | 'show';
			withData?: Record<string, any>;
			showFields?: string[];
			inPlaceEdit?: boolean | string[];
			displayMode?: string;
			afterCreate?: () => void;
			showFks?: boolean;
		};
	import CollectionReverseFks from '$lib/ui/CollectionReverseFks.svelte';
	import FieldInput from '$lib/form/FieldValue.svelte';
 	import {machine} from '$lib/main/machine.js';

	let {
		collection,
		data = {},
		dataId,
		mode = 'show',
		withData,
		showFields,
		inPlaceEdit,
		displayMode = 'wrap',
		afterCreate,
		showFks = false
	}: CreateUpdateProps = $props();
	
	
	let collections = machine.collections;
	let store = machine.store;



let inputForm = `form-${String(collection)}-${mode}`;
let indexName = collections.collection(collection).getIndexName();
let formFields = showFields
		? Object.fromEntries(
				Object.entries(collections.parseRawCollection(collection) ?? {}).filter(([key]) => showFields.includes(key))
			)
		: (collections.parseRawCollection(collection) ?? {});
let qy: any = $derived(() => dataId && indexName ? store[collection].where({ [indexName]: { eq: dataId } }) : {});
let formData = { ...data, ...withData, ...(Array.isArray(qy) ? qy[0] : {}) };
let ds = Object.keys(data).length > 0 ? data : (Array.isArray(qy) ? qy[0] : {});
let formValidator = new IDbFormValidate(collection);

	$effect.pre(() => {
		setFormDataDefaultFieldValues();
	});
	let validationErrors: Record<string, string> = {};

	const validateFormData = (formData: Record<string, any> = {}) => {
		const { isValid, errors } = formValidator.validateForm(formData, {
			ignoreFields: mode == 'create' ? [indexName] : undefined
		});
		validationErrors = errors;

		return isValid;
	};

	export const submit = async (event: FormDataEvent) => {
		if (!validateFormData(formData)) {
			Object.entries(validationErrors).forEach(([fieldName, errorMessage]) => {
				// Trouver l'élément input correspondant dans le formulaire
				const inputElement = document.querySelector(
					`[name="${fieldName}"][form="${inputForm}"]`
				) as HTMLInputElement | null;
				console.log({ inputElement });

				if (inputElement) {
					// Ajouter une classe d'erreur à l'élément input
					inputElement.classList.add('input-error');

					// Créer ou mettre à jour un message d'erreur
					let errorElement = inputElement.nextElementSibling as HTMLElement;
					if (!errorElement || !errorElement.classList.contains('error-message')) {
						errorElement = document.createElement('div');
						errorElement.classList.add('error-message');
						inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
					}
					errorElement.textContent = errorMessage;

					// Optionnel : Ajouter un attribut aria pour l'accessibilité
					inputElement.setAttribute('aria-invalid', 'true');
					inputElement.setAttribute('aria-describedby', `error-${fieldName}`);
					errorElement.id = `error-${fieldName}`;
				}
			});
			return;
		}
		let datadb = formData;
		switch (mode) {
			case 'create':
				if (!dataId) {
					await store[collection].add({ ...datadb, ...withData });
					mode = 'show';
				}
				break;
			case 'update':
				if (dataId) {
					await store[collection].update(dataId, datadb);
				}
				break;
		}
	};

	function setFormDataDefaultFieldValues() {
		Object.entries(formFields).forEach(([fieldName, field]) => {
			if (formData[fieldName] === undefined && getDefaultValue(field?.fieldType)) {
				formData[fieldName] = getDefaultValue(field?.fieldType);
			}
		});
	}

	// déplacer qqpart ?
	function getDefaultValue(fieldType?: string) {
		if (mode !== 'create') return undefined;
		switch (fieldType) {
			case 'timestamp':
				return Date.now();
			case 'date':
				return new Date().toISOString().split('T')[0];
			case 'datetime':
				return new Date().toISOString();
			case 'time':
				return new Date().toISOString().split('T')[1].split('.')[0];
		}
	}
</script>

<form
	id={inputForm}
	name={inputForm}
	onchange={(event) => {
		console.log('Form changed', event);
	}}
	onsubmit={(event) => {
		event.preventDefault();
		// onSubmit(event);
	}}
></form>

<div style="width:750px;display:flex;">
	<div class="crud {displayMode}">
		{#each Object.entries(formFields) as [fieldName, fieldInfo]}
			<FieldInput
				{collection}
				{fieldName}
				{mode}
				editInPlace={inPlaceEdit === true ||
					(Array.isArray(inPlaceEdit) && inPlaceEdit.includes(fieldName))}
				bind:data={formData}
				inputForm={inputForm}
			/>
		{/each}
	</div>
	{#if showFks && (mode === 'show' || mode === 'update')}
		<div>
			<CollectionReverseFks showTitle={true} {collection} collectionId={dataId}>
				{#snippet children({ collection, template })}
					<div class="p2">presentation</div>
				{/snippet}
			</CollectionReverseFks>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "../../styles/references.css";

	:global(.crud) {
		min-width: 32rem;
		padding: 2rem;

		&.wrap {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		&.inline {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}
	}

	[aria-invalid='true'] {
		background-color: #ffeeee;
		border-color: red;
	}

	.error-message {
		color: red;
		font-size: 0.8em;
		margin-top: 0.2em;
	}
</style>
