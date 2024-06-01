import type { CommonProps, IconObj } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type ContentSwitcherProps = CommonProps & {
	/** className off the root component */
	class?: string;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement;
	/** icon for the switcher */
	icon: string | IconObj;

	/** icon for the back action */
	iconback?: string | IconObj;

	/** parent element of the switcher */
	parent?: HTMLElement;
	togglerIcon?: Snippet;
	backIcon?: Snippet;
	contentSwitcherReveal?: Snippet;
};
