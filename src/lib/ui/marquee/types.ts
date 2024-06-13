import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { Snippet } from 'svelte';

export interface MarqueeProps {
	showControls?: boolean;
	autoStart?: boolean;
	pauseOnHover?: boolean;
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
	pauseOnHover: {
		type: 'boolean',
		default: true
	}
};

export let { parameters, componentArgs } = demoerArgs(MarqueDemoValues);
