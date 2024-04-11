import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { IconProps } from '@iconify/svelte';
import type { SvelteComponent } from 'svelte';
export type CartoucheClasses = {
	control: string;
	controlIcon: string;
	controlLabel: string;
	content: string;
};
export type CartoucheProps = CommonProps & {
	/** className off the root component */
	class?: string;
	/** classNames off the whole component */
	classes: CartoucheClasses;
	/** css style off the root component */
	style?: string;
	/** element root HTMLDivElement props */
	element?: HTMLDivElement;
	/** displayed title of the cartouche */
	primary: string;
	/** displayed sub title of the cartouche */
	secondary?: string;
	icon?: string;
	iconProps: IconProps;
	/** can be set as a prop or as a className */
	stacked: boolean;
	component?: SvelteComponent;
	componentProps: Record<string, any>;
	/** State of content is preserved while visibility is toggled */
	keepCartoucheContent: boolean;
	/** show the title divider line */
	showTitleDivider: boolean;
	/** show the default border style */
	bordered: boolean;
	isOpen: boolean;
	/** component actions
	 * @type {Record<'open'|'toggle' | 'close', Function>}
	 */
	actions: Record<'open' | 'toggle' | 'close', Function>;
	/** @deprecated */
	dense: ElementProps['dense'];
	tall: ElementProps['tall'];
};
