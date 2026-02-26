export const toolBarDemoValues = {};
export const toolbarSeparatorDemoValues = {};
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type ToolBarProps = CommonProps & {
	/** color of the toolbar */
	color?: string;
	/** whether the toolbar is vertical */
	vertical?: boolean;
	/**    */
	element?: HTMLDivElement;
	toolbarSeparator?: Snippet;
};
