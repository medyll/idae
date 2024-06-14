import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type ContentProps = CommonProps & {
	/** all the html tags */
	tag?: keyof HTMLElementTagNameMap;
	element?: Partial<HTMLElement>;
	cssPrefix?: string;
	cssVar?: string;
	gutter?: ElementProps['gutter'];
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
