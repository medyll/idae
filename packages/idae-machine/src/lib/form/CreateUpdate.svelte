<!-- 
    Component CreateUpdate :  to open a CreateUpdateShow window for a specific collection.
    Button validate and cancel is in the Window component.
 -->

<script lang="ts" generics="COL = Record<string,any>">
	
 	import {machine} from '$lib/main/machine.js'; 
	import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
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

	let formFields = $derived(logic.collection(collection).parse());
	let validator = $derived(logic.collection(collection).validator);

	let indexName = $derived(logic.collection(collection).template.index);
	let query: any = $derived(dataId && indexName ? store.where({ [indexName]: { eq: dataId } }) : {});

	let defaultVAlues = $derived(logic.collection(collection).parse())

	let formData = $state<Record<string, any>>(
		mode === 'create'
			? {
				...SchemeFieldDefaultValues.getDefaults(Object.keys(defaultVAlues), collection),
				...data,
				...withData
			  }
			: { ...data, ...withData, ...$state.snapshot(query)[0] }
	);

// Default values are set in formData initialization; no need for setFormDataDefaultFieldValues
	 
 
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

	// --- INTEGRATION: Default values for creation mode ---
	// import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
	// ...existing code...

	// Replace formData initialization for creation mode
	// let formData = $state<Record<string, any>>(
	//   mode === 'create'
	//     ? {
	//         ...SchemeFieldDefaultValues.getDefaults(Object.keys($derived(logic.collection(collection).parse())), collection),
	//         ...data,
	//         ...withData
	//       }
	//     : { ...data, ...withData, ...$state.snapshot(query)[0] }
	// );

	// Remove or comment out setFormDataDefaultFieldValues and getDefaultValue (now obsolete)
	// function setFormDataDefaultFieldValues() { ... }
	// function getDefaultValue(fieldType?: string) { ... }
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
<input type="submit" form={inputForm}   />
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
				{inputForm}
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
