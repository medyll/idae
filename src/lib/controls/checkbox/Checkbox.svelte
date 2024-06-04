<script lang="ts">
	import type { CommonProps, ElementProps, ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { CheckboxProps } from './types.js';

	let {
		title,
		indeterminate = $bindable(false),
		class: className = '',
		inputElement = $bindable(),
		labelElement,
		checked = $bindable(false),
		value = $bindable(undefined),
		disabled = $bindable(false),
		dense,
		children,
		...rest
	}: ExpandProps<CheckboxProps> = $props();
</script>

<label class="checkbox-root" class:disabled class:indeterminate bind:this={labelElement}>
	<div class="checkbox-container dense-{dense}">
		<!-- @ts-ignore -->
		<input
			bind:this={inputElement}
			bind:checked
			bind:indeterminate
			{value}
			{disabled}
			{...rest}
			type="checkbox"
			class="checkbox {className}"
		/>
		<svg aria-hidden="true" class="svg" viewBox={'0 0 16 16'}>
			{#if indeterminate}
				<path
					class="path-indeterminate"
					fill="currentColor"
					d="M213.5,554.5C207.5,554.5 201.917,553.417 196.75,551.25C191.583,549.083 187.083,546.083 183.25,542.25C179.417,538.417 176.333,533.917 174,528.75C171.667,523.583 170.5,518 170.5,512C170.5,506 171.667,500.417 174,495.25C176.333,490.083 179.417,485.583 183.25,481.75C187.083,477.917 191.583,474.917 196.75,472.75C201.917,470.583 207.5,469.5 213.5,469.5L810.5,469.5C816.5,469.5 822.083,470.583 827.25,472.75C832.417,474.917 836.917,477.917 840.75,481.75C844.583,485.583 847.667,490.083 850,495.25C852.333,500.417 853.5,506 853.5,512C853.5,518 852.333,523.583 850,528.75C847.667,533.917 844.583,538.417 840.75,542.25C836.917,546.083 832.417,549.083 827.25,551.25C822.083,553.417 816.5,554.5 810.5,554.5Z"
				/>
			{:else if checked}
				<path
					class="path-check"
					d="m14.431 3.323l-8.47 10l-.79-.036l-3.35-4.77l.818-.574l2.978 4.24l8.051-9.506z"
					clip-rule="evenodd"
					stroke-width="4"
					fill="white"
				/>
			{/if}
		</svg>
	</div>
	{#if children || title}
		<div>
			<Slotted child={children}>{title}</Slotted>
		</div>
	{/if}
</label>

<style lang="scss">
	@import './checkbox.scss';
</style>
