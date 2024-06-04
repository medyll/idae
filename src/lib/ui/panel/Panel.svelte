<script lang="ts" generics="T= Data">
	import { getContext } from 'svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { PanelContextType, PanelProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Data, ExpandProps } from '$lib/types/index.js';

	/** Actions to be performed by the panel */
	export const actions = {
		load: (args: any) => {}
	};

	let {
		title = 'not set',
		panelId = crypto.randomUUID() as string,
		data = undefined,
		showNavigation = true,
		panelButtonPrevious,
		panelButtonNext,
		children
	}: ExpandProps<PanelProps> = $props();

	let ref: HTMLDivElement | undefined = undefined;
	let panelSlideId = getContext<string>('PanelSlide');
	let panelerContext = getContext<PanelContextType>('Paneler');

	let currentIdx;

	let hasNext: boolean = $state(false);
	let hasPrev: boolean = $state(false);

	$effect(() => {
		if ($panelerContext.panelSlides) {
			currentIdx = Object.keys($panelerContext.panelSlides).indexOf(panelSlideId);
			hasNext = Boolean(Object.keys($panelerContext.panelSlides)[currentIdx + 1]);
			hasPrev = Boolean(Object.keys($panelerContext.panelSlides)[currentIdx - 1]);
		}
	});

	function prevNextPanel(page: 'next' | 'prev') {
		const event = new CustomEvent('panel-button-clicked', {
			detail: { panelId, page, data },
			bubbles: true
		});
		ref?.dispatchEvent(event);
	}
</script>

<div class="panel" bind:this={ref}>
	<div class="panel-bar pos-sticky top-0 gap-small">
		<div style="flex:1">{title}</div>
		{#if hasPrev}
			{#if panelButtonPrevious}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					onclick={() => {
						prevNextPanel('prev');
					}}
				>
					<Slotted child={panelButtonPrevious}></Slotted>
				</div>
			{:else}
				<Button
					icon="chevron-left"
					variant="naked"
					onclick={() => {
						prevNextPanel('prev');
					}}
				/>
			{/if}
		{/if}
		{#if hasNext}
			{#if panelButtonNext}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					onclick={() => {
						prevNextPanel('next');
					}}
				>
					<Slotted child={panelButtonNext}></Slotted>
				</div>
			{:else}
				<Button
					iconEnd="chevron-right"
					onclick={() => {
						prevNextPanel('next');
					}}>see all</Button
				>
			{/if}
		{/if}
	</div>
	<div class="panelContent">
		<Slotted child={children} slotArgs={{ panelId, actions }} />
	</div>
</div>

<style lang="scss">
	@import './panel.scss';
</style>
