<script lang="ts" generics="T=Data">
	import type { Data } from '$lib/types/index.js';
	import type { MarqueeProps } from './types.js';

	let container = $state<HTMLElement>();

	let {
		showControls = true,
		autoStart = false,
		pauseOnHover = false,
		children,
		...rest
	}: MarqueeProps = $props();

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

<div class="marquee-container">
	{#if showControls}
		<button onclick={scrollPrev}>Précédent</button>
	{/if}
	<div bind:this={container} class="marquee" {...rest}>
		<div class="marquee-children" style="scroll-snap-type: x mandatory;">
			{#if children}{@render children()}{:else}
				<div>a one</div>
			{/if}
		</div>
	</div>
	{#if showControls}
		<button onclick={scrollNext}>Suivant</button>
	{/if}
</div>

<style>
	.marquee-container {
		display: flex;
		align-items: center;
	}

	.marquee {
		flex: 1;
		overflow-x: auto;
		scroll-behavior: smooth;
		scroll-snap-type: x mandatory;
	}

	.marquee-children {
		display: inline-flex;
	}

	.marquee-children > * {
		scroll-snap-align: start;
	}
</style>
