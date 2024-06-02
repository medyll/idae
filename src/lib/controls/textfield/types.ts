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
