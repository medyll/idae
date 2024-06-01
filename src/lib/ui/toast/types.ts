import type { CommonProps } from '$lib/types/index.js';
import type { Snippet, SvelteComponent } from 'svelte';

export type ToastProps = CommonProps & {
	/** Unique ID for the toast */
	toastId: string;

	/** Toast will safe close after delay */
	autoClose: boolean;

	/** Default delay in milliseconds before auto closing  */
	autoCloseDelay: number;

	/** Component to be rendered in the toast */
	component?: SvelteComponent;

	/** Props for the component to be rendered in the toast */
	componentProps?: any;

	/** ID of the toaster */
	toasterId: string;
	element: HTMLDivElement;
	/** Children snippet for the default content */
	children?: Snippet;
};
export type ToastType = {
	toastId?: any;
	autoClose?: boolean;
	autoCloseDelay?: number;
	component?: SvelteComponent;
	componentProps?: any;
};
