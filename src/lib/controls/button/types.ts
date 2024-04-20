import type { CommonProps, ElementProps, IconObj } from '$lib/types/index.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type ButtonProps = CommonProps & {
	element?: HTMLButtonElement;
	/** button type */
	type?: 'button' | 'submit' | 'reset';
	icon?: string | undefined;
	/** icon as a parameter */
	ico?: IconObj;
	/** endIcon as a parameter */
	iconEnd?: IconObj;
	/** background color theme */
	bgTheme?: string | undefined;
	/** paramters for usePopper */
	usePopper?: UsePopperProps | undefined;
	/** show / hide popper, when $$slots.popper exists */
	popperOpen?: boolean;
	/** show loading state */
	loading?: boolean;
	/** show chip */
	showChip?: boolean;
	/** button style */
	variant?: 'link' | 'contained' | 'bordered' | 'naked' | 'flat';

	size?: ElementProps['sizeType'] | 'full';
	/** add ellipsis on overflowed text */
	nowrap?: boolean;
	dense?: ElementProps['dense'];
	/**  button selected */
	selected?: boolean;
	/** @deprecated */
	primary?: string | undefined;
	value?: string | undefined;
	/** reverse the order of the button zone*/
	reverse?: boolean;
	/** aspect ratio of the button */
	ratio?: string;
	buttonPopper?: Snippet;
	buttonStart?: Snippet;
	buttonEnd?: Snippet;
	buttonLoadingIcon?: Snippet;
	slots?: {};
	restProps?: HTMLButtonAttributes;
} & HTMLButtonAttributes;
