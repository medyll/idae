<!-- FieldValue.svelte - Initial version based on README.md -->
<script lang="ts">
	/**
	 * FieldValue component
	 * Props: collection, fieldName, data, mode, editInPlace
	 * TODO: implement type detection and rendering logic
	 */
	export let collection: string;
	export let fieldName: string;
	export let data: any = {};
	export let mode: 'edit' | 'show' = 'show';
	export let editInPlace: boolean = false;
</script>

<div class="field-value">
	<label for={fieldName + '-input'}>{fieldName}</label>
	{#if mode === 'edit' && editInPlace}
		<input id={fieldName + '-input'} type="text" bind:value={data[fieldName]} />
	{:else}
		<span>{data[fieldName] ?? '(empty)'}</span>
	{/if}
</div>

<style>
	.field-value {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}
	label {
		font-weight: bold;
		min-width: 100px;
	}
	input[type="text"] {
		flex: 1;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
	span {
		flex: 1;
		padding: 0.5rem;
		background: #f7f7f7;
		border-radius: 4px;
		color: #333;
	}
</style>