<!--
FieldTextarea.svelte
Long-text field atom. Show mode renders wrapped text.
@role field-atom
@prop {string} value - Current value (bindable)
@prop {string} [display] - Pre-formatted display string (from scheme)
-->
<script lang="ts">
	let {
		value = $bindable(),
		display = undefined as string | undefined,
		mode = 'show',
		rows = 4,
		id,
		name,
		form,
		disabled = false
	} = $props<{
		value?: string;
		display?: string;
		mode?: 'show' | 'create' | 'update';
		rows?: number;
		id?: string;
		name?: string;
		form?: string;
		disabled?: boolean;
	}>();
</script>

{#if mode === 'show'}
	<span class="field-value field-value-area">{display ?? (value ?? '')}</span>
{:else}
	<textarea
		bind:value
		{rows}
		{id}
		{name}
		{form}
		{disabled}
	></textarea>
{/if}

<style>
	.field-value-area { white-space: pre-wrap; }
	textarea { width: 100%; max-width: 100%; resize: vertical; }
</style>
