import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { DemoerStoryProps } from '../demoer/types.js';
import { demoerArgs } from '../demoer/demoer.utils.js';

export type TitleBarProps = {
	title: string;
	/** Function to be called when the close button is clicked */
	readonly onClose?: () => void;

	/** Determines if the title bar has a menu */
	hasMenu?: boolean;

	/** Icon to be displayed in the title bar */
	icon?: ElementProps['icon'];
	titleBarIcon?: Snippet;
	titleBarTitle?: Snippet;
	children?: Snippet;
};

export const titleBarDemoValues: DemoerStoryProps<TitleBarProps> = {
	onClose: {
		type: 'function',
		values: [() => console.log('close')]
	},
	hasMenu: {
		type: 'boolean',
		values: [true, false]
	},
	icon: {
		type: 'icon',
		values: ['mdi:window', 'mdi:user', undefined]
	},
	title: {
		type: 'string',
		values: ['Title', 'Title 2', 'Title 3']
	}
};

export let { parameters, componentArgs } = demoerArgs(titleBarDemoValues);
