import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { StepperProps } from '$lib/controls/stepper/types.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

// Props moved to the component module script during migration.

export const MarqueDemoValues: DemoerStoryProps<any> = {
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

// Export marquee demo values and child placeholder
export { MarqueDemoValues as marqueeDemoValues };
// Also create a direct exported alias for the generator (explicit symbol)
export const marqueeDemoValues: DemoerStoryProps<any> = MarqueDemoValues as any;
export const marqueeChildrenDemoValues: DemoerStoryProps<any> = {};
