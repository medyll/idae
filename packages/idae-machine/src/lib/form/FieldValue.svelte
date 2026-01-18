<!-- // Displays and optionally edits a single field value for a collection item. Supports various field types and modes. -->
<!-- Component: CollectionFieldValue.svelte (ancien nom CollectionFieldInput.svelte) -->
<script lang="ts" generics="COL = Record<string,any>">
	// Importation des types et composants nécessaires 
	import type { TplCollectionName } from '@medyll/idae-idbql';
	import { getContext } from 'svelte';
	import { machine } from '$lib/main/machine.js';

	type LabelPosition = 'before' | 'after' | 'above' | 'below' | boolean;
	interface FieldValueProps<COL = Record<string, any>> {
		collection:   TplCollectionName;
		collectionId?: any;
		fieldName:     string;
		data?:         COL;
		mode?:         'show' | 'create' | 'update';
		editInPlace?:  boolean;
		inputForm?:    string;
		showLabel?:    LabelPosition;
		showAiGuess?:  boolean;
	}

	// Déclaration des propriétés du composant avec leurs valeurs par défaut

	let {
		collection = getContext('collection'),
		collectionId,
		fieldName,
		data = $bindable(),
		mode = 'show',
		editInPlace = false,
		inputForm,
		showLabel = true,
		showAiGuess = false
	}: FieldValueProps = $props();


	let _data = getContext('data');
	data = data ?? ({} as Record<string, any>);



	function fieldForge() {
		return machine.collections.collection(collection).fieldForge(String(fieldName), data);
	}
	function fieldType() {
		return fieldForge().fieldType;
	}
	function fieldArgs() {
		return fieldForge().fieldArgs ?? [];
	}
	function htmlInputType() {
		return fieldForge().htmlInputType;
	}
	function inputDataSet() {
		return fieldForge().inputDataSet ?? {};
	}
	function format() {
		return fieldForge().format;
	}
	function collectionFieldValues() {
		return machine.collections.collection(collection).collectionValues();
	}
	function inputDataset() {
		return collectionFieldValues().getInputDataSet(fieldName, data);
	}


	$effect(() => {
		collectionId;
		if (editInPlace && mode === 'show') {
			console.log('Edit in place activated for', fieldName);
		}
	});


	function isPrivate() {
		return Array.isArray(fieldArgs()) && (fieldArgs() as string[]).includes('private');
	}
	function required() {
		return Array.isArray(fieldArgs()) && (fieldArgs() as string[]).includes('required');
	}
	function readonly() {
		return Array.isArray(fieldArgs()) && (fieldArgs() as string[]).includes('readonly');
	}

	function finalArgs() {
		return {
			id: String(fieldName),
			name: String(fieldName),
			form: inputForm,
			placeholder: `${String(fieldName)} ${htmlInputType()}`,
			required: required(),
			readonly: readonly(),
			...inputDataSet()
		};
	}

	/**
	 * Fonction pour obtenir la position de l'étiquette
	 * @param {LabelPosition} position - Position de l'étiquette
	 * @returns {string} - Position de l'étiquette sous forme de chaîne
	 */
	function getLabelPosition(position: LabelPosition): string {
		if (position === true) return 'above';
		if (position === false) return '';
		return position;
	}

	function labelPosition() {
		return getLabelPosition(showLabel);
	}

	/**
	 * Fonction pour gérer la suggestion de valeur
	 * @param {string} fieldName - Nom du champ
	 * @param {string} value - Valeur suggérée
	 */
	function handleGuess(fieldName: string, value: string) {
		if (data) data[fieldName] = value;
	}

	/**
	 * Fonction pour itérer sur un tableau de données
	 * @param {any[]} data - Tableau de données
	 * @returns {any[]} - Tableau de données itéré
	 */
	// TODO: Fix or remove iterateArray/iterateObject if needed for Svelte 5
</script>

{#if !isPrivate()}
	<div class="cell relative flex flex-col gap-2 wrapper-{fieldType()}">
		{#if fieldType() !== 'id' && (labelPosition() === 'before' || labelPosition() === 'above')}
			<label form={inputForm} for={String(fieldName)} class="field-label {labelPosition()}">{String(fieldName)}</label>
		{/if}

		<div class="field-input flex">
			{#if mode === 'show'}
				<div class="flex w-48 gap-2">
						<div class="flex-1" {...inputDataset()}>
							{fieldName in data ? format() : ''}
						</div>
				</div>
			{:else if fieldType() === 'id'}
				{#if mode !== 'create'}
					<input type="hidden" value={data[fieldName] ?? ''} oninput={e => { const t = e.target as HTMLInputElement; if (t) data[fieldName] = t.value; }} {...inputDataset()} {...finalArgs()} />
				{/if}
			{:else if fieldType() === 'boolean'}
				<input type="checkbox" checked={!!data[fieldName]} oninput={e => { const t = e.target as HTMLInputElement; if (t) data[fieldName] = t.checked; }} {...inputDataset()} {...finalArgs()} />
			{:else if fieldType()?.includes('area')}
				<textarea
					style="width:100%;max-width:100%;"
					value={data[fieldName] ?? ''}
					oninput={e => { const t = e.target as HTMLTextAreaElement; if (t) data[fieldName] = t.value; }}
					rows="3"
					class="input h-24"
					{...inputDataset()}
					{...finalArgs()}></textarea>
			{:else}
				<input
					style="width: 100%"
					class="input"
					value={data[fieldName] ?? ''}
					oninput={e => { const t = e.target as HTMLInputElement; if (t) data[fieldName] = t.value; }}
					type={htmlInputType()}
					{...inputDataset()}
					{...finalArgs()}
				/>
			{/if}
		</div>

		{#if labelPosition() === 'after' || labelPosition() === 'below'}
			<label form={inputForm} for={String(fieldName)} class="field-label {labelPosition()}">{String(fieldName)}</label>
		{/if}
	</div>
{/if}

<style lang="postcss">
	@reference "../../styles/references.css";
	.field-label {
		display: block;
		font-weight: bold;
		padding: 0.5rem;
	}

	.field-label.before,
	.field-label.after {
		display: block;
		margin-right: 0.5em;
	}

	.field-label.above {
		margin-bottom: 0.25em;
	}

	.field-label.below {
		margin-top: 0.25em;
	}

	.field-input {
	}

	.wrapper-text-tiny {
		width: 110px;
	}

	.wrapper-text-medium {
		width: 370px;
	}

	.wrapper-text-area {
		flex-basis: 100%;
		flex-grow: 1;
		max-width: 100%;
	}

	.wrapper-text-long {
		flex-basis: 100%;
		flex-grow: 1;
		max-width: 100%;
	}
</style>
