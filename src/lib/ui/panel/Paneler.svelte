<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { PanelContextType } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { CommonProps } from '$lib/types/index.js';

	type PanelerProps = CommonProps & {
		/** Data to be displayed in the panel */
		dd: string | undefined;
	};

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		dd,
		children,
		...rest
	}: PanelerProps = $props();

	export const panelerStore = writable({
		activePanelId: undefined,
		activePanelSlideData: {},
		panelSlides: {},
		panels: {}
	});
	setContext<PanelContextType>('Paneler', panelerStore);

	function toggleSlidePanels(event) {}
</script>

<div
	on:panel-button-clicked={toggleSlidePanels}
	transition:fade|global={{ duration: 50 }}
	class={className}
	{style}
>
	<!-- <slot></slot> -->
	<Slotted child={children}></Slotted>
</div>

<style lang="scss">
	@import '../../styles/presets.scss';
</style>
