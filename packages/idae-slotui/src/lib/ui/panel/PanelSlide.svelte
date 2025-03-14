<svelte:options />

<script lang="ts">
	import { transitions } from '$lib/utils/effects/transitions.js';
	import { onMount, setContext, getContext } from 'svelte';
	import type { PanelContextType } from './types.js';
	const { slideInNoName, slideOutNoName } = transitions;

	import type { SvelteComponent } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	type PanelSlideProps = CommonProps & {
		/** Whether the panel is open or not */
		open: boolean;

		/** Component to be rendered in the panel */
		component?: SvelteComponent;

		/** Flow of the panel */
		flow?: ElementProps['flow'];

		/** Whether the panel is outer or not */
		outer?: boolean;

		/** Unique ID for the panel slide */
		panelSlideId?: string;
		panelSlideZoom?: import('svelte').Snippet;
		/** Children   for the default content */
		children?: Snippet<[any]>;
	};
	let panelSlideRef: any;
	let {
		class: className = '',
		element = $bindable<HTMLInputElement>(panelSlideRef),
		style = '',
		open,
		component,
		flow = 'absolute',
		outer,
		panelSlideId = crypto.randomUUID() as string,
		panelSlideZoom,
		children,
		...rest
	}: PanelSlideProps = $props();

	let transitionTo: 'prev' | 'next';

	export const actions = {
		open: () => {
			setVisible(true);
		},
		close: () => {
			setVisible(false);
		},
		toggle: () => {
			setVisible(!open);
		},
		hasNextPrev: (nextPrev: 'next' | 'prev') => {
			const registredPanelSlides = $panelerContext.panelSlides;
			const slidePanelsKeys = Object.keys(registredPanelSlides);
			const activeIdx = slidePanelsKeys.indexOf(panelSlideId);
		}
	};

	const panelerContext = getContext<PanelContextType>('Paneler');
	if (outer) setContext<string>('PanelSlide', panelSlideId);

	$effect(() => {
		if (!$panelerContext.panelSlides[panelSlideId] && outer && panelerContext) {
			$panelerContext.panelSlides[panelSlideId] = {};
		}
	});

	$effect(() => {
		if (panelerContext && component && outer) {
			$panelerContext.panelSlides[panelSlideId] = component;
		}
	});

	$effect(() => {
		panelSlideRef?.addEventListener('panel-button-clicked', (event: CustomEvent) => {
			toggleSlidePanels(event);
		});
		return () => {
			delete $panelerContext.panelSlides?.[panelSlideId];
		};
	});

	function setVisible(vis: boolean) {
		open = vis;
	}

	/** receives PanelpanelSlideId to show/hide */
	function toggleSlidePanels(
		event: CustomEvent<{ panelId: string; page: 'next' | 'prev'; data?: any }>
	) {
		const { panelId, page, data } = event.detail;
		// get other context.panelSlideId
		const registredPanelSlides = $panelerContext.panelSlides;
		const slidePanelsKeys = Object.keys(registredPanelSlides);
		const activeIdx = slidePanelsKeys.indexOf(panelSlideId);
		let prevNext;

		if (page === 'next' && slidePanelsKeys[activeIdx + 1]) {
			prevNext = slidePanelsKeys[activeIdx + 1];
			transitionTo = 'next';
		}
		if (page === 'prev' && slidePanelsKeys[activeIdx - 1]) {
			prevNext = slidePanelsKeys[activeIdx - 1];
			transitionTo = 'prev';
		}
		// transitionTo
		actions.close();
		// new activePanelSlide
		// will be bound to the default child
		if (prevNext) {
			const activePanelSlideId = registredPanelSlides[prevNext].panelSlideId;
			$panelerContext.activePanelSlideData[activePanelSlideId] = data;
			registredPanelSlides[prevNext].actions.open();
		}
	}
</script>

{#if !outer}
	<svelte:self
		bind:this={component}
		outer={true}
		{panelSlideId}
		{flow}
		{open}
		{style}
		{children}
		{panelSlideZoom}
	/>
{:else if open}
	<div
		bind:this={panelSlideRef}
		out:slideOutNoName|global={{ duration: 125, delay: 20, direction: transitionTo }}
		in:slideInNoName|global={{ duration: 150, delay: 150, direction: transitionTo }}
		class="sidePanel {className}"
		style:position={flow ?? ''}
		{style}
		{...rest}
	>
		{@render children?.({ panelSlideId, data: $panelerContext.activePanelSlideData[panelSlideId] })}
	</div>
	{#if panelSlideZoom}
		<svelte:self class={className}>
			{@render panelSlideZoom?.()}
		</svelte:self>
	{/if}
{/if}

<style lang="scss">
	@use './panel.scss';
	.sidePanel {
		position: absolute;
		top: 0;
		bottom: 0;
		padding: 1rem 2rem;
		width: 100%;
	}
</style>
