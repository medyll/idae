import type { CommonProps, DemoStoryProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import { demoerArgs } from '../demoer/demoer.utils.js';

export interface BoxProps extends CommonProps {
	element?: HTMLDivElement;
	style?: string;
	/** is the content visible */
	isOpen: boolean;
	/** show a working closer icon */
	showCloseControl: boolean;
	/** used to activate the slotted.TitleBar component */
	hasMenu: boolean;
	/** text to be shown in the title bar */
	title: string;
	/** alternative to iconSlot, icon to be used with the internat iconify component */
	icon: string;
	/** alternative to contentSlot,  content to be shown in the main area */
	content: string;
	/** alternative to snippet.bottomZone, content to be shown in the bottom button zone */
	bottomZone?: string;
	/** component actions
	 * @type {Record<'open'|'toggle' | 'close', Function>}
	 */
	actions?: Record<'open' | 'toggle' | 'close', Function>;
	children?: Snippet;
	boxBottomZone?: Snippet;
	titleBarTitle?: Snippet;
	titleBarIcon?: Snippet;
}

export const BoxDemoValues: DemoStoryProps<BoxProps> = {
	isOpen: {
		type: 'boolean',
		values: [true, false],
		default: true
	},
	showCloseControl: {
		type: 'boolean',
		values: [true, false],
		default: true
	},
	hasMenu: {
		type: 'boolean',
		values: [true, false],
		default: true
	},
	title: {
		type: 'string',
		values: ['A smart title on a smart box', 'second title']
	},
	icon: {
		type: 'icon',
		values: ['mdi:window', 'mdi:user', undefined]
	},
	content: {
		type: 'string',
		values: ['Some content as text / html', 'second content']
	},
	bottomZone: {
		type: 'string',
		values: ['bottomZone as text / html', 'second bottomZone']
	}
};

export let { parameters, componentArgs } = demoerArgs(BoxDemoValues);
