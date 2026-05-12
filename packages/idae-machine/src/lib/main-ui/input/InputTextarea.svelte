<!--
InputTextarea.svelte
Textarea input atom.
@role input-atom
@prop {string} value - Current value (bindable)
@prop {number} [rows] - Number of rows (default: 3)
@prop {string} [id] - Input id
@prop {string} [name] - Input name
@prop {string} [form] - Form id
@prop {boolean} [disabled] - Disabled state
-->
<script lang="ts">
	let { value = $bindable(''), rows = 3, id, name, form, disabled = false } = $props<{
		value?:    string;
		rows?:     number;
		id?:       string;
		name?:     string;
		form?:     string;
		disabled?: boolean;
	}>();
</script>

<textarea
	bind:value
	{rows}
	{id}
	{name}
	{form}
	{disabled}
	style="width:100%;max-width:100%;resize:vertical;"
></textarea>
