import type { CommonProps, DemoStoryProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

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

export const chipperDemoValues: DemoStoryProps<ChipperProps> = {
	showChip: {
		type: 'boolean',
		values: [true, false],
		default: true
	},
	position: {
		type: 'string',
		values: ['top', 'right', 'left', 'bottom']
	},
	theme: {
		type: 'string',
		values: [
			'primary',
			'secondary',
			'tertiary',
			'success',
			'warning',
			'danger',
			'light',
			'medium',
			'dark'
		]
	},
	color: {
		type: 'string',
		values: ['#ff0000', '#00ff00', '#0000ff']
	},
	content: {
		type: 'string',
		values: ['Some content', 'Other content']
	}
};
