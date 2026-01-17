<script lang="ts" generics="T = Data">
	import type { StepperProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Data, ExpandProps } from '$lib/types/index.js';

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

<div class="stepper flex {stepperOrientation === 'vertical' ? 'flex-col' : ''}">
	{#each steps as step, index}
		<div title={step.title} class="stepper-step p-[var(--stepper-pad)] rounded-[var(--stepper-radius)] mt-2 {activeStep === index ? 'text-[var(--stepper-active-color)]' : ''}">
			<Slotted child={children} slotArgs={{ step, index }}>de</Slotted>
		</div>
	{/each}
</div>


