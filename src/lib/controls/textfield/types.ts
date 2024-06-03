import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';

export type TextFieldProps = CommonProps & {
	/** icon as a parameter */
	icon?: ElementProps['icon'];

	/** icon color as a parameter */
	iconColor?: string;

	/** end icon as a parameter */
	endIcon?: string;

	/** end icon color as a parameter */
	endIconColor?: string;

	/** parameters for usePopper */
	usePopper?: UsePopperProps;

	/** width of the input using presets */
	size?: ElementProps['width'] | 'full';

	/** height of the input, using preset values */
	height?: string;

	/** has no border */
	borderless?: boolean;

	/** has no border */
	transparent?: boolean;

	/** value of the input */
	value?: any;

	inputLast?: Snippet;
	inputFirst?: Snippet;
};

export const TextFieldDemoValues: DemoerStoryProps<TextFieldProps> = {
	icon: {
		type: 'string',
		values: ['search', 'close']
	},
	iconColor: {
		type: 'string',
		values: ['primary', 'secondary']
	},
	endIcon: {
		type: 'string',
		values: ['search', 'close']
	},
	endIconColor: {
		type: 'string',
		values: ['primary', 'secondary']
	},
	size: {
		type: 'size',
		values: ['small', 'medium', 'large']
	},
	height: {
		type: 'string',
		values: ['small', 'medium', 'large']
	},
	borderless: {
		type: 'boolean',
		values: [true, false]
	},
	transparent: {
		type: 'boolean',
		values: [true, false]
	}
};

export const TextFieldDemoValues2: DemoerStoryProps<TextFieldProps> = {
	value: {
		type: 'string',
		values: ['hello', 'world']
	},
	icon: {
		type: 'string',
		values: ['search', 'close']
	},
	endIcon: {
		type: 'string',
		values: ['search', 'close']
	},
	size: {
		type: 'string',
		values: ['small', 'medium', 'large']
	}
};

export let { parameters, componentArgs } = demoerArgs(TextFieldDemoValues);
