<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';
	import type { StepType, StepperOrientation } from './types.js';

	export const actions = {
		setActiveStep: function (step: number) {
			activeStep = step ?? 0;
		}
	};

	type StepperProps = CommonProps & {
		/** Number of steps
		 * @type {StepType[]}
		 */
		steps: StepType[];

		/** orientation of the stepper
		 * @type {'horizontal' | 'vertical'}
		 */
		stepperOrientation: StepperOrientation;

		/** Actual active step */
		activeStep: number;
		children: Snippet<[{ step: StepType; index: number }]>;
	};

	let {
		steps = [],
		stepperOrientation = 'horizontal',
		activeStep = 0,
		children
	} = $props<StepperProps>();
</script>

<div class="stepper" {stepperOrientation}>
	{#each steps as step, index}
		{#if children}
			{@render children({ step, index })}
		{:else}
			<div title={step.text} class="step" />
		{/if}
	{/each}
</div>

<style lang="scss">
	@import './stepper.scss';
</style>
