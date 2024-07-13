import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import {
	buttonVariant,
	densePreset,
	uiPresets,
	widthPreset,
	type CommonProps,
	type Data,
	type ElementProps
} from '$lib/types/index.js';
import type { MenuListProps } from '$lib/ui/menuList/types.js';
import type { PopperProps } from '$lib/ui/popper/types.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

type ButtonProps = HTMLButtonAttributes & {
	element?: HTMLButtonElement;
	/** button type */
	type?: 'button' | 'submit' | 'reset';
	icon?: ElementProps['icon'];
	wrap?: ElementProps['wrap'];
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
};

export type ButtonMenuProps<T> = ButtonProps & {
	menuProps?: MenuListProps<T>;
	popperProps?: PopperProps;
	popperElement?: HTMLElement;
	menuItem?: Snippet<[{ item: T }]>;
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
	width: {
		type: 'width',
		default: widthPreset.med
	},
	tall: {
		type: 'tall',
		default: densePreset.default
	},
	bgTheme: {
		type: 'theme',
		default: 'primary'
	},
	variant: {
		type: 'buttonVariant',
		default: buttonVariant.contained
	},
	nowrap: {
		type: 'boolean',
		default: false
	},
	selected: {
		type: 'boolean',
		default: false
	},
	reverse: {
		type: 'boolean',
		default: false
	},
	loading: {
		type: 'boolean',
		default: false
	}
};

export let { parameters, componentArgs } = demoerArgs(ButtonDemoValues);
