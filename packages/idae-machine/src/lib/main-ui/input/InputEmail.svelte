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
	export let value: string = '';
	export let error: string | null = null;
	export let required = false;
	export let disabled = false;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let form: string | undefined = undefined;

	let email = $state(value);

	$effect(() => {
		email = value;
	});

	function validateEmail(email: string): boolean {
		if (!email && !required) return true;
		if (!email && required) return false;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function handleBlur(): void {
		if (!validateEmail(email)) {
			// Could emit error event here
		}
	}
</script>

<div class="field-email" class:has-error={error}>
	<input
		type="email"
		bind:value={email}
		onblur={handleBlur}
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
	.field-email { display: flex; flex-direction: column; gap: 0.25rem; }
	.email-input { padding: 0.5rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
	.email-input:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }
	.field-email.has-error .email-input { border-color: #dc3545; }
	.error-message { color: #dc3545; font-size: 0.875rem; }
	input:disabled { background: #e9ecef; cursor: not-allowed; }
</style>
