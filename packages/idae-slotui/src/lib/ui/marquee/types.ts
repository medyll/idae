import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { StepperProps } from '$lib/controls/stepper/types.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export interface MarqueeProps {
	showControls?: boolean;
	autoStart?: boolean;
	pauseOnHover?: boolean;
	activeElement?: number;
	activeIndex?: number;
	gutter?: ElementProps['gutter'];
	showStepper?: boolean;
	stepperProps?: StepperProps;
	marqueePrev?: Snippet;
	marqueeNext?: Snippet;
	children?: Snippet;
}

export const MarqueDemoValues: DemoerStoryProps<MarqueeProps> = {
	showControls: {
		type: 'boolean',
		default: true
	},
	autoStart: {
		type: 'boolean',
		default: true
	},
	showStepper: {
		type: 'boolean',
		default: true
	},
	gutter: {
		type: 'gutter'
	},
	pauseOnHover: {
		type: 'boolean',
		default: true
	}
};

export let { parameters, componentArgs } = demoerArgs(MarqueDemoValues);
