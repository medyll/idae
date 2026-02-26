import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type ContentProps = CommonProps & {
	/** all the html tags */
	tag?: keyof HTMLElementTagNameMap;
	element?: Partial<HTMLElement>;
	cssPrefix?: string;
	cssVar?: string;
	/** uses style.display = contents */
	solid?: boolean;
	/* bindable props */
	dimensions?: {
		clientHeight?: number;
		clientWidth?: number;
		offsetHeight?: number;
		offsetWidth?: number;
	};
	implementation?: 'inline' | 'style';
	//
	tall?: ElementProps['tall'];
	width?: ElementProps['width'];
	gutter?: ElementProps['gutter'];
	elevation?: ElementProps['elevation'];
	onresize?: (event: BindableEvent) => void;
	children?: Snippet;
};

export type BindableEvent = CustomEvent<{
	element: any;
	clientHeight?: number;
	clientWidth?: number;
	offsetHeight?: number;
	offsetWidth?: number;
}>;

import type { DemoerStoryProps } from '../../base/demoer/types.js';

// Placeholder demo export for Content utility
export const contentDemoValues: DemoerStoryProps<any> = {};
