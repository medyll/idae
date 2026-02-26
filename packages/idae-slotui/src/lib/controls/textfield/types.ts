export const textFieldDemoValues = {};
export const inputFirstDemoValues = {};
export const inputLastDemoValues = {};
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { tallPreset, uiPresets, type CommonProps, type ElementProps } from '$lib/types/index.js';
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
	width?: ElementProps['width'];

	/** height of the input, using preset values */
	tall?: ElementProps['tall'];

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
		type: 'icon',
		values: ['search', undefined]
	},
	endIcon: {
		type: 'icon',
		values: ['search', undefined]
	},
	width: {
		type: 'width'
	},
	tall: {
		type: 'tall',
		default: tallPreset.default
	},
	transparent: {
		type: 'boolean'
	}
};

export let { parameters, componentArgs } = demoerArgs(TextFieldDemoValues);
