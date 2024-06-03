import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepType = {
	index?: number;
	text: string;
	action?: () => void;
};
export const StepperDemoValues: DemoerStoryProps<StepType> = {
	index: {
		type: 'range',
		values: [1, 50]
	},
	text: {
		type: 'string',
		values: ['Step 1', 'Step 2']
	}
};

export let { parameters, componentArgs } = demoerArgs(StepperDemoValues);
