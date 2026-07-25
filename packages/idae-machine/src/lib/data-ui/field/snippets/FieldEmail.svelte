<!--
FieldEmail.svelte
Email field atom. Show mode renders a mailto link.
@role field-atom
@prop {string} value - Current value (bindable)
@prop {string} [error] - Error message
-->
<script module lang="ts">
	export interface FieldEmailProps {
		value?: string;
		mode?: 'show' | 'create' | 'update';
		error?: string | null;
		required?: boolean;
		disabled?: boolean;
		id?: string;
		name?: string;
		form?: string;
		oninput?: (e: Event) => void;
	}
</script>

<script lang="ts">
	let {
		value = $bindable(),
		mode = 'show',
		error = null as string | null,
		required = false,
		disabled = false,
		id = undefined as string | undefined,
		name = undefined as string | undefined,
		form = undefined as string | undefined,
		oninput = undefined as ((e: Event) => void) | undefined
	}: FieldEmailProps = $props();

	function validateEmail(email: string): boolean {
		if (!email && !required) return true;
		if (!email && required) return false;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
</script>

{#if mode === 'show'}
	{#if value}
		<a class="field-email-link" href={`mailto:${value}`}>{value}</a>
	{:else}
		<span class="field-empty">—</span>
	{/if}
{:else}
	<div class="field-email" class:has-error={error}>
		<input
			type="email"
			bind:value
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
{/if}

<style>
	.field-email { display: flex; flex-direction: column; gap: var(--gutter-xs); width: 100%; }
	.email-input { width: 100%; padding: var(--pad-xs) var(--pad-sm); border: var(--focus-ring-width) solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--text-sm); }
	.email-input:focus { border-color: var(--color-primary); outline: none; box-shadow: none; }
	.field-email.has-error .email-input { border-color: var(--color-critical); }
	.error-message { color: var(--color-critical); font-size: var(--text-xs); }
	input:disabled { background: var(--color-surface-alt); cursor: not-allowed; }
	.field-empty { color: var(--color-text-muted); }
</style>
