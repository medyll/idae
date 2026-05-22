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
	let {
		value = '' as number | string,
		error = null as string | null,
		currencySymbol = '$',
		decimalPlaces = 2,
		disabled = false
	} = $props<{
		value?:         number | string;
		error?:         string | null;
		currencySymbol?: string;
		decimalPlaces?:  number;
		disabled?:       boolean;
	}>();

	let inputValue = $state<string>('');

	$effect(() => {
		if (typeof value === 'number') {
			inputValue = value.toFixed(decimalPlaces);
		} else {
			inputValue = String(value ?? '');
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
		const numValue = parseFloat(rawValue);

		inputValue = formatValue(rawValue);

		if (!isNaN(numValue)) {
			input.dispatchEvent(new CustomEvent('change-value', {
				detail: { value: numValue }
			}));
		}
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
			placeholder="0.00"
			class="currency-input"
		/>
	</div>
	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.field-currency { display: flex; flex-direction: column; gap: 0.25rem; }
	.input-wrapper { display: flex; align-items: center; border: 1px solid #ced4da; border-radius: 4px; padding: 0.5rem; background: #fff; }
	.input-wrapper:focus-within { border-color: #007bff; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }
	.field-currency.has-error .input-wrapper { border-color: #dc3545; }
	.currency-symbol { color: #6c757d; margin-right: 0.5rem; font-weight: 500; }
	.currency-input { border: none; outline: none; flex: 1; font-size: 1rem; text-align: right; }
	.error-message { color: #dc3545; font-size: 0.875rem; }
	input:disabled { background: #e9ecef; cursor: not-allowed; }
</style>
