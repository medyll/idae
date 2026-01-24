<script lang="ts">
	import Box from '$lib/base/box/Box.svelte';
	import { toastStore } from './store.js';
	import { mount, onMount } from 'svelte';
	import Toaster from './Toaster.svelte';
	import type { ToastProps } from './types.js';
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

<style lang="scss">
	@use '../../styles/slotui-presets.scss';
	@use '../../styles/slotui-mixins.scss';
</style>
