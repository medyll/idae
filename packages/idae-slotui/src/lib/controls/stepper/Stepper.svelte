<script module lang="ts">
	import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
	import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
	import { orientation, type CommonProps, type Data } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';

	export type StepperProps<T = Data> = CommonProps & {
		/** Steps   */
		steps: StepType<T>[];
		/** orientation of the stepper */
		stepperOrientation: StepperOrientation;
		/** Actual active step */
		activeStep?: number;
		children?: Snippet<[{ step: StepType<T>; index: number }]>;
	};
	export type StepperOrientation = 'horizontal' | 'vertical';
	export type StepType<T = Data> = {
		order?: number;
		data?: T;
		title?: string;
		disabled?: boolean;
		action?: () => void;
	};
	const StepperDemoValues: DemoerStoryProps<StepperProps> = {
		steps: {
			type: 'array',
			values: [
				[
					{ order: 1, title: 'Step 1' },
					{ order: 2, title: 'Step 2' }
				]
			],
			default: [
				{ order: 1, title: 'Step 1' },
				{ order: 2, title: 'Step 2' }
			]
		},
		activeStep: {
			type: 'number',
			values: [1, 2],
			default: 1
		},
		stepperOrientation: {
			type: 'orientation',
			default: orientation.horizontal
		}
	};

	export const { parameters, componentArgs } = demoerArgs(StepperDemoValues);
</script>

<script lang="ts" generics="T = Data">
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
		}: ExpandProps<import('./Stepper.svelte').StepperProps<T>> = $props();

		let child = children;
</script>

<div class="stepper flex {stepperOrientation === 'vertical' ? 'flex-col' : ''}">
	{#each steps as step, index}
		<div title={step.title} class="stepper-step p-[var(--stepper-pad)] rounded-[var(--stepper-radius)] mt-2 {activeStep === index ? 'text-[var(--stepper-active-color)]' : ''}">
			<Slotted child={children} slotArgs={{ step, index }}>de</Slotted>
		</div>
	{/each}
</div>


