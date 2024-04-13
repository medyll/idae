import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export type TextFieldProps = CommonProps &
	Partial<HTMLInputElement> & {
		/** icon as a parameter */
		icon: string | undefined;

		/** icon color as a parameter */
		iconColor: string;

		/** end icon as a parameter */
		endIcon: string | undefined;

		/** end icon color as a parameter */
		endIconColor: string;

		/** parameters for usePopper */
		usePopper: UsePopperProps | undefined;

		/** width of the input using presets */
		size: ElementProps['sizeType'] | 'full';

		/** height of the input, using preset values */
		height: string;

		/** has no border */
		borderless: boolean;

		/** has no border */
		transparent: boolean;

		/** value of the input */
		value: any | undefined;

		inputLast: Snippet | undefined;
		inputFirst: Snippet | undefined;
	};
