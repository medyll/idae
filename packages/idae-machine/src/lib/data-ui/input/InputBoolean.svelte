<!--
InputBoolean.svelte
Checkbox/toggle input atom.
@role input-atom
@prop {boolean} value - Current value (bindable)
@prop {string} [id] - Input id
@prop {string} [name] - Input name
@prop {string} [form] - Form id
@prop {boolean} [disabled] - Disabled state
-->
<script lang="ts">
	let { value = $bindable(), id, name, form, disabled = false, onchange } = $props<{
		value?:    boolean;
		id?:       string;
		name?:     string;
		form?:     string;
		disabled?: boolean;
		onchange?: (next: boolean) => void;
	}>();
</script>

<input
	type="checkbox"
	bind:checked={value}
	{id}
	{name}
	{form}
	{disabled}
	onchange={(e) => onchange?.((e.target as HTMLInputElement).checked)}
/>
