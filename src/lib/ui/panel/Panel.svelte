<svelte:options accessors />

<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { PanelContextType } from './types.js';

	export let title = 'not set';

	/** panelId will be bound to the targeted panelSlide */
	export let panelId = crypto.randomUUID() as string;
	/** data will be bound to the targeted panelSlide */
	export let data: any | undefined = undefined;
	/** data will be bound to the targeted panelSlide */
	export let showNavigation: boolean = true;
	export const actions = {
		load: (args: any) => {}
	};

	let ref: HTMLDivElement | undefined = undefined;
	let panelSlideId = getContext<string>('PanelSlide');
	let panelerContext = getContext<PanelContextType>('Paneler');

	let currentIdx, hasNext, hasPrev;

	$: if ($panelerContext.panelSlides) {
		currentIdx = Object.keys($panelerContext.panelSlides).indexOf(panelSlideId);
		hasNext = Boolean(Object.keys($panelerContext.panelSlides)[currentIdx + 1]);
		hasPrev = Boolean(Object.keys($panelerContext.panelSlides)[currentIdx - 1]);
	}

	function prevNextPanel(page: 'next' | 'prev') {
		const event = new CustomEvent('panel:button:clicked', {
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
			{#if $$slots.panelButtonPrevious}
				<div
					on:click={() => {
						prevNextPanel('prev');
					}}
				>
					<slot name="panelButtonPrevious" />
				</div>
			{:else}
				<Button
					icon="chevron-left"
					naked
					on:click={() => {
						prevNextPanel('prev');
					}}
				/>
			{/if}
		{/if}
		{#if hasNext}
			{#if $$slots.panelButtonNext}
				<div
					on:click={() => {
						prevNextPanel('next');
					}}
				>
					<slot name="panelButtonNext" />
				</div>
			{:else}
				<Button
					endIcon="chevron-right"
					on:click={() => {
						prevNextPanel('next');
					}}>see all</Button
				>
			{/if}
		{/if}
	</div>
	<div class="panelContent">
		<slot {panelId} {actions} />
	</div>
</div>

<style lang="scss">
	@import './panel.scss';
</style>
