<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet, SvelteComponent } from 'svelte';
/**
 * Props for the Toast component.
 */
export type ToastProps = CommonProps & {
	/** Unique ID for the toast */
	toastId?: string;
	/** Toast will auto close after delay */
	autoClose?: boolean;
	/** Delay in milliseconds before auto closing */
	autoCloseDelay?: number;
	/** Component to be rendered in the toast */
	component?: SvelteComponent;
	/** Props for the component to be rendered in the toast */
	componentProps?: any;
	/** ID of the toaster */
	toasterId?: string;
	/** Root HTML element reference */
	element?: HTMLDivElement;
	/** Children snippet for the default content */
	children?: Snippet;
};
/**
 * Type for toast instance.
 */
export type ToastType = {
	toastId?: any;
	autoClose?: boolean;
	autoCloseDelay?: number;
	component?: SvelteComponent;
	componentProps?: any;
};
</script>
<script lang="ts">
	import Box from '$lib/base/box/Box.svelte';
	import { toastStore } from './store.js';
	import { mount, onMount } from 'svelte';
	import Toaster from './Toaster.svelte';

	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		toastId = crypto.randomUUID() as string,
		autoClose = false,
		autoCloseDelay = 5000,
		component,
		componentProps,
		toasterId = 'defaultToasterRoot',
		children,
		...rest
	}: ToastProps = $props();

	let isOpen: boolean = true;
	// ensure is in store, not to show twice
	if (!$toastStore[toastId]) {
		$toastStore[toastId] = {
			toastId,
			autoClose,
			autoCloseDelay,
			component,
			componentProps
		};
	}

	onMount(() => {
		// check parentNode toasterId
		if (!document.body.querySelector('[data-toasterId=' + toasterId + ']')) {
			let a  = mount(Toaster, { target: document.body, props: { toasterId,children:undefined } });
 
		}

		document?.body
			.querySelector('[data-toasterId="' + toasterId + '"]')
			?.appendChild(document.body.querySelector('[data-toastId="' + toastId + '"]'));
	});

	$effect(() => {
		if (autoClose) {
			setTimeout(() => {
				isOpen = false;
			}, autoCloseDelay ?? 5000);
		}
	});
</script>

<Box bind:element style="width:auto;" data-toastId={toastId} {isOpen} {...rest}>
	<Slotted child={children} />
</Box>

<style lang="postcss">
    @reference "tailwindcss";

    /* toast.css was empty; no component-specific styles to inline */
</style>
