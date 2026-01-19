<!-- 
    Component CreateUpdate :  to open a CreateUpdateShow window for a specific collection.
    Button validate and cancel is in the Window component.
 -->

<script lang="ts" generics="COL = Record<string,any>">
	
 	import {machine} from '$lib/main/machine.js'; 
	import type { CreateUpdateProps } from './types.js';
	import CollectionReverseFks from '$lib/ui/CollectionReverseFks.svelte';
	import FieldInput from '$lib/form/FieldValue.svelte';

	let {
		collection,
		data = {},
		dataId,
		mode = 'show',
		withData,
		showFields,
		inPlaceEdit,
		displayMode = 'wrap', 
		showFks = false
	}: CreateUpdateProps = $props();
	
	
	let inputForm = `form-${String(collection)}-${mode}`; 

	let logic = machine.logic ;
	let store = machine.store[(collection as string)];

	let formFields = logic.collection(collection).parseRawCollection();
	let validator = logic.collection(collection).validator;

	let indexName = logic.collection(collection).template.index;
	let query: any = $derived(dataId && indexName ? store.where({ [indexName]: { eq: dataId } }) : {});

	let formData = $state<Record<string, any>>({ ...data, ...withData, ...$state.snapshot(query)[0] });

	$effect.pre(() => {
		setFormDataDefaultFieldValues();
	});
	 
 
	let validationErrors: Record<string, string> = {};

	const validateFormData = (formData: Record<string, any> = {}) => {
		const { isValid, errors } = validator.validateForm(formData, {
			ignoreFields: mode == 'create' ? [indexName] : undefined
		});
		validationErrors = errors;

		return isValid;
	};

	export const submit = async (event: FormDataEvent) => {
		if (!validateFormData($state.snapshot(formData))) {
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
		
		let datadb = $state.snapshot(formData);
		switch (mode) {
			case 'create':
				if (!dataId) {
					await store.add({ ...datadb, ...withData });
					mode = 'show';
				}
				break;
			case 'update':
				if (dataId) {
					await store.update(dataId, datadb);
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
			<!-- <FieldInput
				{collection}
				{fieldName}
				{mode}
				editInPlace={inPlaceEdit === true ||
					(Array.isArray(inPlaceEdit) && inPlaceEdit.includes(fieldName))}
				bind:data={formData}
				{inputForm}
			/> -->
		{/each}
	</div>
	{#if showFks && (mode === 'show' || mode === 'update')}
		<div>
			<!-- <CollectionReverseFks showTitle={true} {collection} collectionId={dataId}>
				{#snippet children({ collection, template })}
					<div class="p2">presentation</div>
				{/snippet}
			</CollectionReverseFks> -->
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
