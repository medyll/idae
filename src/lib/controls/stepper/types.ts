import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data } from '$lib/types/index.js';
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
		type: 'string',
		values: ['horizontal', 'vertical'],
		default: 'horizontal'
	}
};

export const { parameters, componentArgs } = demoerArgs(StepperDemoValues);
