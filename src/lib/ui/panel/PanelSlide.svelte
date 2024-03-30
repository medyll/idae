<svelte:options accessors={true} />

<script lang="ts">
	import { transitions } from '$lib/utils/effects/transitions.js';
	import { onMount, setContext, getContext } from 'svelte';
	import type { PanelContextType } from './types.js';
	const { slideInNoName, slideOutNoName } = transitions;

	/*  common slotUi exports*/
	let className = '';
	export { className as class };
	export let element: HTMLInputElement | null = null;
	export let style: string = '';
	/*  end slotUi exports*/

	export let open: boolean;
	export let component = null;
	export let flow: ElementProps['flow'] | undefined = 'absolute';
	export let outer = true;

	export let panelSlideId = crypto.randomUUID() as string;
	let transitionTo: 'prev' | 'next';

	let panelSlideRef: any;
	/** panelSlideData comes from the source Panel.data and will be bound to the default slot */
	let panelSlideData: any | undefined = undefined;

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

	$: if (!$panelerContext.panelSlides[panelSlideId] && outer && panelerContext) {
		$panelerContext.panelSlides[panelSlideId] = {};
	}

	$: if (panelerContext && component && outer) {
		$panelerContext.panelSlides[panelSlideId] = component;
	}

	onMount(() => {
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
		// will be bound to the default slot
		const activePanelSlideId = registredPanelSlides[prevNext].panelSlideId;
		$panelerContext.activePanelSlideData[activePanelSlideId] = data;
		registredPanelSlides[prevNext].actions.open();
	}
</script>

{#if outer}
	<svelte:self bind:this={component} outer={false} />
{:else if open}
	<div
		bind:this={panelSlideRef}
		on:panel:button:clicked={toggleSlidePanels}
		out:slideOutNoName|global={{ duration: 125, delay: 20, direction: transitionTo }}
		in:slideInNoName|global={{ duration: 150, delay: 150, direction: transitionTo }}
		class="sidePanel {className}"
		style:position={flow ?? ''}
		{style}
	>
		<slot {panelSlideId} data={$panelerContext.activePanelSlideData[panelSlideId]} />
	</div>
{/if}

<style lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	.sidePanel {
		position: absolute;
		top: 0;
		bottom: 0;
		padding: 1rem 2rem;
		width: 100%;
	}
</style>
