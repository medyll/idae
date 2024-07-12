import type { SvelteComponent } from 'svelte';

export type UseBackDropProps = {
	component?: SvelteComponent | any;
	componentProps?: {};
	parentNode?: HTMLElement | any;
};

export const backdrop = (node: HTMLElement, props?: UseBackDropProps) => {};
