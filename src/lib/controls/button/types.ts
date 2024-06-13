import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import {
	buttonVariant,
	densePreset,
	uiPresets,
	widthPreset,
	type CommonProps,
	type ElementProps
} from '$lib/types/index.js';
import type { MenuListProps } from '$lib/ui/menuList/types.js';
import type { PopperProps } from '$lib/ui/popper/types.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface ButtonProps extends HTMLButtonAttributes {
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
	/** preset width of the button */
	width?: ElementProps['width'];
	/** add ellipsis on overflowed text */
	nowrap?: boolean;
	tall?: ElementProps['tall'];
	/**  button selected */
	selected?: boolean;
	/** button value */
	value?: string;
	/** reverse the order of the button zone*/
	reverse?: boolean;
	/** aspect ratio of the button */
	ratio?: string;
	children?: Snippet;
	buttonPopper?: Snippet;
	buttonStart?: Snippet;
	buttonEnd?: Snippet;
	buttonLoadingIcon?: Snippet;
}

export type ButtonMenuProps = ButtonProps & {
	menuProps?: MenuListProps;
	popperProps?: PopperProps;
	menuItem?: Snippet;
};

const ButtonDemoValues: DemoerStoryProps<ButtonProps> = {
	type: {
		type: 'string',
		values: ['button', 'submit', 'reset'],
		default: 'button'
	},
	icon: {
		type: 'icon'
	},
	bgTheme: {
		type: 'theme',
		default: 'primary'
	},
	variant: {
		type: 'buttonVariant',
		default: buttonVariant.bordered
	},
	width: {
		type: 'width',
		default: widthPreset.default
	},
	nowrap: {
		type: 'boolean',
		default: false
	},
	tall: {
		type: 'dense',
		default: densePreset.default
	},
	selected: {
		type: 'boolean',
		default: false
	},
	reverse: {
		type: 'boolean',
		default: false
	}
};

export let { parameters, componentArgs } = demoerArgs(ButtonDemoValues);
