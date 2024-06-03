import type { CommonProps, IconObj } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { DemoerStoryProps } from '../demoer/types.js';

export type ContentSwitcherProps = CommonProps & {
	/** className off the root component */
	class?: string;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement;
	/** icon for the switcher */
	icon?: string | IconObj;

	/** icon for the back action */
	iconback?: string | IconObj;

	/** parent element of the switcher */
	parent?: HTMLElement;
	contentSwitcherTogglerIcon?: Snippet;
	contentSwitcherBackIcon?: Snippet;
	contentSwitcherReveal?: Snippet;
};

export const contentSwitcherDemoValues: DemoerStoryProps<ContentSwitcherProps> = {
	icon: {
		type: 'icon',
		values: ['mdi:window', 'mdi:user', undefined]
	},
	iconback: {
		type: 'icon',
		values: ['mdi:window', 'mdi:user', undefined]
	}
};
