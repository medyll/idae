import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data, ElementProps } from '$lib/types/index.js';
import type { SvelteComponent, Snippet } from 'svelte';

export type WindowProps<T = Data> = CommonProps & {
	/** can be opened with a component */
	component?: any;
	/** used when props.component is used */
	componentProps?: any;
	/** content can be set from a html string */
	contentHTML?: any;
	/** reference to the component's DOM container */
	element?: HTMLElement;
	/** parent of the window */
	parentNode?: HTMLElement;
	/** icon used on the left side*/
	icon?: string;
	iconClose?: string;
	iconValidate?: string;
	flow?: ElementProps['flow'];
	/** start position */
	startPosition?: 'center' | 'cascade' | 'overlap';
	/** close the window on accept */
	closeOnValidate?: boolean;
	/** destroy the component on close */
	removeFromDomOnClose?: boolean;
	/** used to destroy component when opened from function.openWindow */
	self?: SvelteComponent;
	/** private */
	componentInstance?: any;
	/** whether the window is outer */
	outer?: boolean;
	/** Id of the component's instance */
	frameId?: string;
	/** the title appears on the handle bar */
	title?: string;
	/** boolean to show the window */
	open?: boolean;
	/** state of the window */
	minimized?: boolean;
	maximized?: boolean;
	/** is on top of others*/
	active?: boolean;
	/** the secondaryTitle appears below the title */
	secondaryTitle?: string;
	/** the description appears somewhere */
	description?: string;
	/** shows or hide the handle, if dismissed, then the whole window is draggable */
	showHandle?: boolean;
	data?: T;
	/** actions triggered on click*/
	onClose?: (args?: any) => void;
	onCancel?: (args?: any) => void;
	onValidate?: (args?: any) => void;
	/** buttons visible in the bottom bar */
	hideAcceptButton?: boolean;
	hideCloseButton?: boolean;
	hideCancelButton?: boolean;
	windowIcon?: Snippet;
	windowButtonZone?: Snippet;
};

const windowDemoValues: DemoerStoryProps<WindowProps> = {
	title: {
		type: 'string',
		values: ['Title'],
		default: 'Title'
	},
	secondaryTitle: {
		type: 'string',
		values: ['Secondary Title'],
		default: 'Secondary Title'
	},
	description: {
		type: 'string',
		values: ['Description'],
		default: 'Description'
	},
	icon: {
		type: 'icon',
		values: ['add'],
		default: 'add'
	},
	iconClose: {
		type: 'icon',
		values: ['close'],
		default: 'close'
	},
	iconValidate: {
		type: 'icon',
		values: ['check'],
		default: 'check'
	},
	open: {
		type: 'boolean',
		default: true
	},
	minimized: {
		type: 'boolean',
		default: false
	},
	maximized: {
		type: 'boolean',
		default: false
	},
	active: {
		type: 'boolean',
		default: false
	},
	showHandle: {
		type: 'boolean',
		default: true
	},
	hideAcceptButton: {
		type: 'boolean',
		default: false
	},
	hideCloseButton: {
		type: 'boolean',
		default: false
	},
	hideCancelButton: {
		type: 'boolean',
		default: false
	},
	data: {
		type: 'data',
		values: ['<p>Content</p>'],
		default: [
			{ id: 1, name: 'name' },
			{ id: 2, name: 'name' },
			{ id: 3, name: 'name' },
			{ id: 4, name: 'name' }
		],
		private: true
	}
};

export const { parameters, componentArgs } = demoerArgs(windowDemoValues);
