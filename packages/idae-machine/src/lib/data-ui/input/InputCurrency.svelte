<!--
InputCurrency.svelte
Currency input with formatting.
@role input-atom
@prop {number|string} value - Current value
@prop {string} [error] - Error message
@prop {string} [currencySymbol] - Currency symbol (default: $)
@prop {number} [decimalPlaces] - Decimal places (default: 2)
@prop {boolean} [disabled] - Disabled state
-->
<script lang="ts">
	import { untrack } from 'svelte';
	let {
		value = $bindable(),
		error = null as string | null,
		currencySymbol = '$',
		decimalPlaces = 2,
		disabled = false,
		id = undefined as string | undefined,
		name = undefined as string | undefined,
		form = undefined as string | undefined
	} = $props<{
		value?:         number | string;
		error?:         string | null;
		currencySymbol?: string;
		decimalPlaces?:  number;
		disabled?:       boolean;
		id?:            string;
		name?:          string;
		form?:          string;
	}>();

	let inputValue = $state<string>('');

	$effect(() => {
		if (typeof value === 'number') {
			untrack(() => { inputValue = value.toFixed(decimalPlaces); });
		} else {
			untrack(() => { inputValue = String(value ?? ''); });
		}
	});

	function formatValue(val: string): string {
		const numeric = val.replace(/[^0-9.]/g, '');
		const parts = numeric.split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return parts.join('.');
	}

	function handleChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		const rawValue = input.value.replace(/,/g, '');

		inputValue = formatValue(rawValue);

		if (rawValue === '') {
			value = '';
			return;
		}

		const numValue = parseFloat(rawValue);
		if (!isNaN(numValue)) value = numValue;
	}
</script>

<div class="field-currency" class:has-error={error}>
	<div class="input-wrapper">
		<span class="currency-symbol">{currencySymbol}</span>
		<input
			type="text"
			bind:value={inputValue}
			oninput={handleChange}
			disabled={disabled}
			{id}
			{name}
			{form}
			placeholder="0.00"
			class="currency-input"
		/>
	</div>
	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.field-currency { display: flex; flex-direction: column; gap: 0.25rem; width: 100%; }
	.input-wrapper { display: flex; align-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0.5rem; background: var(--color-surface); }
	.input-wrapper:focus-within { border-color: var(--color-primary); box-shadow: 0 0 0 0.2rem var(--color-primary-muted); }
	.field-currency.has-error .input-wrapper { border-color: var(--color-critical); }
	.currency-symbol { color: var(--color-text-muted); margin-right: 0.5rem; font-weight: 500; }
	.currency-input { border: none; outline: none; flex: 1; font-size: 1rem; text-align: right; }
	.error-message { color: var(--color-critical); font-size: 0.875rem; }
	input:disabled { background: var(--color-surface-alt); cursor: not-allowed; }
</style>
