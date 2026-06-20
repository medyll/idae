<!--
FieldText.svelte
Generic field atom — text/number/date/datetime/time/password/url/phone.
Handles both show (formatted display) and edit (typed input) via `mode`.
@role field-atom
@prop {unknown} value - Raw value (bindable)
@prop {string} [display] - Canonical formatted string (from scheme) for show mode
@prop {string} [type] - HTML input type for edit mode
-->
<script lang="ts">
	let {
		value = $bindable(),
		display = undefined as string | undefined,
		mode = 'show',
		type = 'text',
		id,
		name,
		form,
		disabled = false
	} = $props<{
		value?: unknown;
		display?: string;
		mode?: 'show' | 'create' | 'update';
		type?: string;
		id?: string;
		name?: string;
		form?: string;
		disabled?: boolean;
	}>();
</script>

{#if mode === 'show'}
	<span class="field-value">{display ?? (value ?? '')}</span>
{:else}
	<input
		{type}
		bind:value
		{id}
		{name}
		{form}
		{disabled}
	/>
{/if}

<style>
	.field-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
	input { width: 100%; }
</style>
