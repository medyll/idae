<script lang="ts" generics="T=Data">
	import Stepper from '$lib/controls/stepper/Stepper.svelte';
	import type { StepperProps } from '$lib/controls/stepper/types.js';
	import type { Data, ExpandProps } from '$lib/types/index.js';
	import Content from '$lib/utils/content/Content.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { MarqueeProps } from './types.js';

	let container = $state<HTMLElement>();

	let {
		showControls = true,
		autoStart = false,
		pauseOnHover = false,
		activeElement = $bindable(0),
		activeIndex = $bindable(0),
		showStepper = false,
		stepperProps = {} as StepperProps,
		gutter,
		marqueePrev,
		marqueeNext,
		children,
		...rest
	}: ExpandProps<MarqueeProps> = $props();

	/* export function pauseOnHoverFunction(
		node: HTMLElement | null,
		params: MarqueeProps
	): Action<HTMLElement, MarqueeProps> | undefined {
		if (!node) return;
		let isHovered = false;

		function handleMouseEnter() {
			isHovered = true;
		}

		function handleMouseLeave() {
			isHovered = false;
		}

		node.addEventListener('mouseenter', handleMouseEnter);
		node.addEventListener('mouseleave', handleMouseLeave);

		return {
			update({ pauseOnHover }) {
				if (pauseOnHover && isHovered) {
					node.style.animationPlayState = 'paused';
				} else {
					node.style.animationPlayState = 'running';
				}
			},
			destroy() {
				node.removeEventListener('mouseenter', handleMouseEnter);
				node.removeEventListener('mouseleave', handleMouseLeave);
			}
		};
	} */

	function scrollHorizontally(element: HTMLElement, distance: number) {
		element.scrollBy({ left: distance, behavior: 'smooth' });
	}

	function scrollNext() {
		if (container) scrollHorizontally(container, container.clientWidth);
	}

	function scrollPrev() {
		if (container) scrollHorizontally(container, -container.clientWidth);
	}
</script>

<div class="marquee-container" {...rest}>
	{#if showControls}
		<div class="marquee-controls-prev">
			<button onclick={scrollPrev}>Précédent</button>
		</div>
	{/if}
	<div bind:this={container} class="marquee">
		<Content {gutter} tag="div" class="marquee-children" style="scroll-snap-type: x mandatory;">
			{#if children}{@render children()}{:else}
				<div>enter content or data</div>
			{/if}
		</Content>
	</div>
	{#if showControls}
		<div class="marquee-controls-next">
			<Slotted child={marqueePrev}>
				<button onclick={scrollNext}>Suivant</button>
			</Slotted>
		</div>
	{/if}
</div>
{#if showStepper}
	<Stepper {...stepperProps} steps={[{ order: 1 }, { order: 2 }]}></Stepper>
{/if}

<style global lang="postcss">
	@import './marquee.css';
</style>
