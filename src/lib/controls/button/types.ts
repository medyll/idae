import type { CommonProps, ElementProps, IconObj } from '$lib/types/index.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

type Button = {
	element?: HTMLButtonElement;
	/** button type */
	type?: 'button' | 'submit' | 'reset';
	icon?: ElementProps['icon'];
	/** icon as a parameter */
	ico?: IconObj;
	/** endIcon as a parameter */
	iconEnd?: IconObj;
	/** background color theme */
	bgTheme?: string;
	/** paramters for usePopper */
	usePopper?: UsePopperProps;
	/** show / hide popper, when $$slots.popper exists */
	popperOpen?: boolean;
	/** show loading state */
	loading?: boolean;
	/** show chip */
	showChip?: boolean;
	/** button style */
	variant?: ElementProps['buttonVariant'];

	size?: ElementProps['width'];
	/** add ellipsis on overflowed text */
	nowrap?: boolean;
	dense?: ElementProps['dense'];
	/**  button selected */
	selected?: boolean;
	/** @deprecated */
	primary?: string;
	value?: string;
	/** reverse the order of the button zone*/
	reverse?: boolean;
	/** aspect ratio of the button */
	ratio?: string;
	buttonPopper?: Snippet;
	buttonStart?: Snippet;
	buttonEnd?: Snippet;
	buttonLoadingIcon?: Snippet;
	restProps?: HTMLButtonAttributes;
};

export type ButtonProps = Button & CommonProps & HTMLButtonAttributes;

type DemoStory<T> = {
	[K in keyof T]: {
		type: T[K];
		values: any;
	};
};

type TransformedButtonProps = DemoStory<Button>;
