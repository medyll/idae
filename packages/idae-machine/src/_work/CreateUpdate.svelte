<!-- CreateUpdate.svelte - Initial version based on README.md -->
<script lang="ts">
	/**
	 * CreateUpdate component
	 * Props: collection, mode, dataId, showFields, inPlaceEdit, showFks
	 * TODO: implement form logic, field rendering, FK support
	 */
	export let collection: string;
	export let mode: 'create' | 'update' | 'show' = 'create';
	export let dataId: number | null = null;
	export let showFields: string[] = [];
	export let inPlaceEdit: boolean = false;
	export let showFks: boolean = false;
	// Placeholder for form data
	let formData: any = {};
</script>

<div class="create-update">
	<h2>{collection} - {mode}</h2>
	<form>
		{#each showFields as field}
			<div class="field">
				<label for={field + '-input'}>{field}</label>
				<input id={field + '-input'} type="text" bind:value={formData[field]} readonly={mode === 'show'} />
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
	input[type="text"] {
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
</style>