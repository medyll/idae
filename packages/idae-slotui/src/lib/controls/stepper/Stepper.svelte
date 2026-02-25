<script module lang="ts">
import type { Snippet } from 'svelte';
import type { Data } from '$lib/types/index.js';
import Slotted from '$lib/utils/slotted/Slotted.svelte';
import type { ExpandProps } from '$lib/types/index.js';
/**
 * Orientation for the Stepper component.
 */
export type StepperOrientation = 'horizontal' | 'vertical';
/**
 * Type for a single step in the Stepper.
 */
export type StepType<T = Data> = {
	order?: number;
	data?: T;
	title?: string;
	disabled?: boolean;
	action?: () => void;
};
/**
 * Props for the Stepper component.
 * Represents a stepper with customizable steps, orientation, and slot support.
 */
export type StepperProps<T = Data> = {
	/** Steps array */
	steps: StepType<T>[];
	/** Orientation of the stepper */
	stepperOrientation: StepperOrientation;
	/** Actual active step */
	activeStep?: number;
	/** Slot for step content */
	children?: Snippet<[{ step: StepType<T>; index: number }]>;
};
</script>

<script lang="ts" generics="T = Data">

export const actions = {
	setActiveStep: function (step: number) {
		activeStep = step ?? 0;
	}
};

let {
	steps = $bindable([]),
	stepperOrientation = 'horizontal',
	activeStep = $bindable(0),
	children
}: ExpandProps<StepperProps<T>> = $props();

let child = children;
</script>

<div class="stepper {stepperOrientation}">
	{#each steps as step, index}
		<div title={step.title} class="stepper-step">
			<Slotted child={children} slotArgs={{ step, index }}>de</Slotted>
		</div>
	{/each}
</div>

<style global lang="postcss">
  @import './stepper.css';
</style>
