<!--
FieldCurrency.svelte
Currency field atom — formatted display in show mode, formatted input in edit.
@role field-atom
@prop {number|string} value - Current value (bindable)
@prop {string} [display] - Pre-formatted display string (from scheme)
-->
<script module lang="ts">
	export interface FieldCurrencyProps {
		value?: number | string;
		display?: string;
		mode?: 'show' | 'create' | 'update';
		error?: string | null;
		currencySymbol?: string;
		decimalPlaces?: number;
		disabled?: boolean;
		id?: string;
		name?: string;
		form?: string;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	let {
		value = $bindable<number | string | undefined>(),
		display = undefined as string | undefined,
		mode = 'show',
		error = null as string | null,
		currencySymbol = '$',
		decimalPlaces = 2,
		disabled = false,
		id = undefined as string | undefined,
		name = undefined as string | undefined,
		form = undefined as string | undefined
	}: FieldCurrencyProps = $props();

	let inputValue = $state<string>('');

	$effect(() => {
		const currentValue = value;
		if (typeof currentValue === 'number') {
			untrack(() => { inputValue = currentValue.toFixed(decimalPlaces); });
		} else {
			untrack(() => { inputValue = String(currentValue ?? ''); });
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

{#if mode === 'show'}
	<span class="field-value">{display ?? `${currencySymbol}${value ?? ''}`}</span>
{:else}
	<div class="field-currency" class:has-error={error}>
		<div class="input-wrapper">
			<span class="currency-symbol">{currencySymbol}</span>
			<input
				type="text"
				bind:value={inputValue}
				oninput={handleChange}
				{disabled}
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
{/if}

<style>
	.field-currency { display: flex; flex-direction: column; gap: var(--gutter-xs); width: 100%; }
	.input-wrapper { display: flex; align-items: center; min-height: var(--control-height); border: var(--focus-ring-width) solid var(--color-border); border-radius: var(--radius-sm); padding: var(--pad-xs) var(--pad-sm); background: var(--color-surface-raised); }
	.input-wrapper:focus-within { border-color: var(--color-primary); box-shadow: none; }
	.field-currency.has-error .input-wrapper { border-color: var(--color-critical); }
	.currency-symbol { color: var(--color-text-muted); margin-right: var(--marg-sm); font-weight: var(--font-medium); }
	.currency-input { border: none; outline: none; flex: 1; font-size: var(--text-sm); text-align: right; }
	.error-message { color: var(--color-critical); font-size: var(--text-xs); }
	input:disabled { background: var(--color-surface-alt); cursor: not-allowed; }
</style>
