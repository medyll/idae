<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { PanelContextType } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import { onEvent } from '$lib/utils/uses/event.js';

	interface PanelerProps {
		class?: string;
		element?: HTMLInputElement | null;
		style?: string;
		dd?: string;
		children?: import('svelte').Snippet;
	}

	let {
		class: className = '',
		element = null,
		style = '',
		dd = '',
		children
	}: PanelerProps = $props();

	export const panelerStore: PanelContextType = writable({
		activePanelId: undefined,
		activePanelSlideData: {},
		panelSlides: {},
		panels: {}
	});

	setContext<PanelContextType>('Paneler', panelerStore);

	let slideLeft: any;
	let slideRight: any;

	function toggleSlidePanels(event) {
		console.log(event);
		// get children from context
		// alert("red");
		/* slideLeft.actions.toggle();
		slideRight.actions.toggle();

		panelerStore.set({
			...$panelerStore,
			open: !$panelerStore?.open
		});
		setContext('PanelSlide', panelerStore); */
	}
</script>

<div
	use:onEvent={{ event: 'panel:button:clicked', action: toggleSlidePanels }}
	transition:fade|global={{ duration: 50 }}
	class={className}
	{style}
>
	{@render children?.()}
</div>

<style lang="scss">
	@import '../../styles/presets.scss';
</style>
