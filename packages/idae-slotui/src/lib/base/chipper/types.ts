import type { CommonProps, DemoStoryProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import { demoerArgs } from '../demoer/demoer.utils.js';
import type { DemoerStoryProps } from '../demoer/types.js';

export interface ChipperProps extends CommonProps {
	/** position of the chipper  */
	position?: ElementProps['position'];
	/** status of the chip */
	theme?:
		| 'primary'
		| 'secondary'
		| 'tertiary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'light'
		| 'medium'
		| 'dark';
	/** css color code for the chip */
	color?: string;
	/** text or html is snippet is not used */
	content?: string;
	/** show or hide the chip */
	showChip?: boolean;
	chipperChip?: Snippet;
}

export const chipperDemoValues: DemoerStoryProps<ChipperProps> = {
	showChip: {
		type: 'boolean',
		default: true
	},
	position: {
		type: 'position'
	},
	theme: {
		type: 'theme'
	},
	color: {
		type: 'color',
		values: ['#ff0000', '#00ff00', '#0000ff']
	},
	content: {
		type: 'string',
		values: ['Some content', 'Other content']
	}
};

export let { parameters, componentArgs } = demoerArgs(chipperDemoValues);
