<!--
InputEmail.svelte
Email input with format validation.
@role input-atom
@prop {string} value - Current value
@prop {string} [error] - Error message
@prop {boolean} [required] - Required field
@prop {boolean} [disabled] - Disabled state
-->
<script lang="ts">
	let {
		value = $bindable(),
		error = null as string | null,
		required = false,
		disabled = false,
		id = undefined as string | undefined,
		name = undefined as string | undefined,
		form = undefined as string | undefined,
		oninput = undefined as ((e: Event) => void) | undefined
	} = $props<{
		value?:    string;
		error?:    string | null;
		required?: boolean;
		disabled?: boolean;
		id?:       string;
		name?:     string;
		form?:     string;
		oninput?:  (e: Event) => void;
	}>();

	function validateEmail(email: string): boolean {
		if (!email && !required) return true;
		if (!email && required) return false;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function handleBlur(): void {
		if (!validateEmail(value ?? '')) {
			// Could emit error event here
		}
	}
</script>

<div class="field-email" class:has-error={error}>
	<input
		type="email"
		bind:value
		onblur={handleBlur}
		{oninput}
		{disabled}
		{required}
		{id}
		{name}
		{form}
		placeholder="email@example.com"
		class="email-input"
	/>
	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.field-email { display: flex; flex-direction: column; gap: 0.25rem; width: 100%; }
	.email-input { width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 1rem; }
	.email-input:focus { border-color: var(--color-primary); outline: none; box-shadow: 0 0 0 0.2rem var(--color-primary-muted); }
	.field-email.has-error .email-input { border-color: var(--color-critical); }
	.error-message { color: var(--color-critical); font-size: 0.875rem; }
	input:disabled { background: var(--color-surface-alt); cursor: not-allowed; }
</style>
