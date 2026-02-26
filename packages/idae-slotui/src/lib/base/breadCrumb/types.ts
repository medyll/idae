import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

interface BreadListType {
	action?: () => void;
	breads?: BreadListItemType[];
}

interface BreadListItemType<D = Record<string, any>> {
	text: string;
	icon: string;
	link?: string;
	data?: D;
	children: Snippet;
}

export interface BreadCrumbProps extends CommonProps {
	/** breadCrumb class */
	class?: string;
	/** breadCrumb style */
	style?: string;
	/** breadCrumb list */
	breadList: BreadListType[];
	element: HTMLElement;
}

// Placeholder demo export for BreadCrumb
import type { DemoerStoryProps } from "../demoer/types.js";
export const breadCrumbDemoValues: DemoerStoryProps<any> = {};
