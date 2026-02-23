<script module lang="ts">
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { Writable } from 'svelte/store';
/**
 * Context type for Paneler and PanelSlide.
 */
export type PanelContextType = Writable<{
	activePanelId?: string;
	activePanelSlideData: Record<string, any>;
	panelSlides: Record<string, any>;
	panels: Record<string, any>;
}>;

/**
 * Props for the PanelGrid component.
 * @template T - The type of the data property (default: Data)
 */
export type PanelGridProps<T = Data> = CommonProps & {
	/** Data to be displayed in the grid */
	data?: T[];
	/** Number of columns in the grid */
	columns?: number;
	/** Whether the grid is expanded or not */
	isExpanded?: boolean;
	/** Children snippet for the default content */
	children?: Snippet<[{ data: T }]>;
	/** Slot for the zoomed in view */
	panelGridZoom?: Snippet;
};

/**
 * Props for the Panel component.
 * @template T - The type of the data property (default: Data)
 */
export type PanelProps<T = Data> = {
	/** Title of the panel */
	title: string;
	/** ID of the panel */
	panelId?: string;
	/** Data to be displayed in the panel */
	data?: T;
	/** Whether to show navigation or not */
	showNavigation?: boolean;
	/** Custom previous button snippet */
	panelButtonPrevious?: Snippet;
	/** Custom next button snippet */
	panelButtonNext?: Snippet;
	/** Children snippet for the panel content */
	children?: Snippet;
};
</script>
<script lang="ts" generics="T=Data">
	import { run } from 'svelte/legacy';

	import { onMount, getContext } from 'svelte';
	import Button from '$lib/controls/button/Button.svelte';

	import type { Data } from '$lib/types/index.js';

	let {
		title = 'not set',
		panelId = crypto.randomUUID() as string,
		data = undefined,
		showNavigation = true,
		panelButtonPrevious,
		panelButtonNext,
		children
	}: PanelProps<T> = $props();
	export const actions = {
		load: (args: any) => {}
	};

	let ref: HTMLDivElement | undefined = $state(undefined);
	let panelSlideId = getContext<string>('PanelSlide');
	let panelerContext = getContext<PanelContextType>('Paneler');

	let currentIdx = $state(),
		hasNext = $state(),
		hasPrev = $state();

	$effect(() => {
		if ($panelerContext.panelSlides) {
			currentIdx = Object.keys($panelerContext.panelSlides).indexOf(panelSlideId);
			hasNext = Boolean(Object.keys($panelerContext.panelSlides)[currentIdx + 1]);
			hasPrev = Boolean(Object.keys($panelerContext.panelSlides)[currentIdx - 1]);
		}
	});

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
			{#if panelButtonPrevious}
				<div
					onclick={() => {
						prevNextPanel('prev');
					}}
				>
					{@render panelButtonPrevious?.()}
				</div>
			{:else}
				<Button
					icon="chevron-left"
					tall="mini"
					variant="naked"
					onclick={() => {
						prevNextPanel('prev');
					}}
				/>
			{/if}
		{/if}
		{#if hasNext}
			{#if panelButtonNext}
				<div
					onclick={() => {
						prevNextPanel('next');
					}}
				>
					{@render panelButtonNext?.()}
				</div>
			{:else}
				<Button
					iconEnd="chevron-right"
					variant="naked"
					tall="mini"
					onclick={() => {
						prevNextPanel('next');
					}}
				></Button>
			{/if}
		{/if}
	</div>
	<div class="panelContent">
		{@render children?.({ panelId, actions })}
	</div>
</div>

<style global lang="css">
  @import './panel.css';
</style>
