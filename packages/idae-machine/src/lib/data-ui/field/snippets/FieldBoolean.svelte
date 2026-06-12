<!--
FieldBoolean.svelte
Boolean field atom — checkbox/toggle. Show mode renders read-only state.
@role field-atom
@prop {boolean} value - Current value (bindable)
-->
<script lang="ts">
	let {
		value = $bindable(),
		mode = 'show',
		id,
		name,
		form,
		disabled = false,
		onchange
	} = $props<{
		value?: boolean;
		mode?: 'show' | 'create' | 'update';
		id?: string;
		name?: string;
		form?: string;
		disabled?: boolean;
		onchange?: (next: boolean) => void;
	}>();
</script>

{#if mode === 'show'}
	<input type="checkbox" checked={!!value} disabled />
{:else}
	<input
		type="checkbox"
		bind:checked={value}
		{id}
		{name}
		{form}
		{disabled}
		onchange={(e) => onchange?.((e.target as HTMLInputElement).checked)}
	/>
{/if}
