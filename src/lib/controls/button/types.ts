import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import {
	buttonVariant,
	densePreset,
	widthPreset,
	type CommonProps,
	type ElementProps,
	type IconObj
} from '$lib/types/index.js';
import type { MenuListProps } from '$lib/ui/menuList/types.js';
import type { PopperProps } from '$lib/ui/popper/types.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
import type { Action } from 'svelte/action';
import type { HTMLButtonAttributes } from 'svelte/elements';

type Button = {
	element?: HTMLButtonElement;
	/** button type */
	type?: 'button' | 'submit' | 'reset';
	icon?: ElementProps['icon'];
	/** endIcon as a parameter */
	iconEnd?: ElementProps['icon'];
	/** background color theme */
	bgTheme?: string;
	/** paramters for usePopper */
	usePopper?: UsePopperProps;
	/** show / hide popper   */
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
};

export type ButtonProps = Button & CommonProps & HTMLButtonAttributes;

export type ButtonMenuProps = ButtonProps & {
	menuProps?: MenuListProps;
	popperProps?: PopperProps;
	menuItem?: Snippet;
};

export const ButtonDemoValues: DemoerStoryProps<ButtonProps> = {
	type: {
		type: 'string',
		values: ['button', 'submit', 'reset'],
		default: 'button'
	},
	icon: {
		type: 'string',
		values: ['mdi:search', 'mdi:user', 'edit', 'icon-park-outline:avatar', 'carbon:phone-ip']
	},
	bgTheme: {
		type: 'string',
		values: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'],
		default: 'primary'
	},
	variant: {
		type: 'string',
		values: Object.values(buttonVariant),
		default: buttonVariant.bordered
	},
	size: {
		type: 'string',
		values: Object.values(widthPreset),
		default: widthPreset.default
	},
	nowrap: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	dense: {
		type: 'dense',
		values: Object.values(densePreset),
		default: densePreset.default
	},
	selected: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	reverse: {
		type: 'boolean',
		values: [true, false],
		default: false
	}
};
