<script lang="ts">
	/**
	 * FieldCurrency - Currency input with formatting
	 */

	/** Current value */
	export let value: number | string = '';
	/** Error message */
	export let error: string | null = null;
	/** Currency symbol */
	export let currencySymbol = '$';
	/** Decimal places */
	export let decimalPlaces = 2;
	/** Disabled state */
	export let disabled = false;

	/** Internal state for input */
	let inputValue = $state(String(value));

	/** Sync with external value */
	$effect(() => {
		if (typeof value === 'number') {
			inputValue = value.toFixed(decimalPlaces);
		} else {
			inputValue = value;
		}
	});

	/** Format value for display */
	function formatValue(val: string): string {
		// Remove non-numeric chars except decimal point
		const numeric = val.replace(/[^0-9.]/g, '');
		const parts = numeric.split('.');
		
		// Add thousand separators
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		
		return parts.join('.');
	}

	/** Handle input change */
	function handleChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		const rawValue = input.value.replace(/,/g, '');
		const numValue = parseFloat(rawValue);
		
		inputValue = formatValue(rawValue);
		
		if (!isNaN(numValue)) {
			// Dispatch custom event with numeric value
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
	.field-currency {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		border: 1px solid #ced4da;
		border-radius: 4px;
		padding: 0.5rem;
		background: #fff;
	}

	.input-wrapper:focus-within {
		border-color: #007bff;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}

	.field-currency.has-error .input-wrapper {
		border-color: #dc3545;
	}

	.currency-symbol {
		color: #6c757d;
		margin-right: 0.5rem;
		font-weight: 500;
	}

	.currency-input {
		border: none;
		outline: none;
		flex: 1;
		font-size: 1rem;
		text-align: right;
	}

	.error-message {
		color: #dc3545;
		font-size: 0.875rem;
	}

	input:disabled {
		background: #e9ecef;
		cursor: not-allowed;
	}
</style>
