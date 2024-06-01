import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export interface BoxProps extends CommonProps {
	element: HTMLDivElement;
	style: string;
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
	bottomZone: string;
	/** component actions
	 * @type {Record<'open'|'toggle' | 'close', Function>}
	 */
	actions: Record<'open' | 'toggle' | 'close', Function>;
	boxBottomZone?: Snippet;
	titleBarTitle?: Snippet;
	titleBarIcon?: Snippet;
	/** @deprecated */
	slots?: {
		boxBottomZone: Snippet;
		titleBarTitle: Snippet;
		titleBarIcon: Snippet;
	};
}
