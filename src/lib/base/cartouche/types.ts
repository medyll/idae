import { tallPreset, type CommonProps, type ElementProps } from '$lib/types/index.js';
import type { Snippet, SvelteComponent } from 'svelte';
import { demoerArgs } from '../demoer/demoer.utils.js';
import type { DemoerStoryProps } from '../demoer/types.js';
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
	classes?: CartoucheClasses;
	/** css style off the root component */
	style?: string;
	/** element root HTMLDivElement props */
	element?: HTMLDivElement;
	/** displayed title of the cartouche */
	primary: string;
	/** displayed sub title of the cartouche */
	secondary?: string;
	icon?: ElementProps['icon'];
	/** can be set as a prop or as a className */
	stacked?: boolean;
	component?: SvelteComponent;
	componentProps?: Record<string, any>;
	/** State of content is preserved while visibility is toggled */
	keepCartoucheContent?: boolean;
	/** show the title divider line */
	showTitleDivider?: boolean;
	/** show the default border style */
	bordered?: boolean;
	isOpen?: boolean;
	/** component actions	 */
	actions?: Record<'open' | 'toggle' | 'close', (event: Event) => void>;
	/** @deprecated */
	dense?: ElementProps['dense'];
	tall?: ElementProps['tall'];
	//
	children?: Snippet;
	cartoucheIcon?: Snippet;
	cartouchePrimary?: Snippet;
	cartoucheSecondary?: Snippet;
	cartoucheButtons?: Snippet;
};

export const cartoucheDemoValues: DemoerStoryProps<CartoucheProps> = {
	primary: {
		type: 'string',
		values: ['A smart title', 'Second title']
	},
	secondary: {
		type: 'string',
		values: [undefined, 'A smart subtitle', 'Second subtitle'],
		default: undefined
	},
	icon: {
		type: 'icon',
		values: ['mdi:window', 'mdi:user', undefined]
	},
	stacked: {
		type: 'boolean',
		default: false
	},
	showTitleDivider: {
		type: 'boolean',
		default: false
	},
	bordered: {
		type: 'boolean',
		default: false
	},
	isOpen: {
		type: 'boolean',
		default: true
	},
	tall: {
		type: 'tall',
		default: tallPreset.default
	}
};

export let { parameters, componentArgs } = demoerArgs(cartoucheDemoValues);
