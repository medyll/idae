<script module lang="ts">
	import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
	import type { ElementProps } from '$lib/types/index.js';

	export type ProgressProps = {
		/** className off the root component */
		class?: string;
		/** css style off the root component */
		style?: string;
		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;
		/** base value for the progress */
		percentBase?: number;
		/** current value of the progress */
		value: number;
		/** can be vertical or horizontal */
		orientation?: ElementProps['orientation'];
	};

	export const ProgressDemoValues: DemoerStoryProps<ProgressProps> = {
		percentBase: {
			type: 'number',
			values: [100, 200]
		},
		value: {
			type: 'number',
			values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
		},
		orientation: {
			type: 'orientation'
		}
	};
</script>

<script lang="ts">
		import type { ExpandProps } from '$lib/types/index.js';

		let {
				class: className = '',
				style = '',
				element = null,
				percentBase = 100,
				value = 0,
				orientation: direction = 'horizontal',
				...rest
		}: ExpandProps<import('./Progress.svelte').ProgressProps> = $props();

		const title = `${value} / ${percentBase}`;

		let attr = direction === 'vertical' ? 'height' : 'width';
		let attrTickness = direction === 'vertical' ? 'width' : 'height';
		const precWidth = $derived((value / percentBase) * 100);
</script>

<div bind:this={element} class="progress {className} w-large border border-[var(--progress-border)] rounded-[var(--progress-radius)] p-px" {style} {title}>
	<div class="progress-gouge bg-[var(--progress-gouge-background)] rounded-[var(--progress-radius)] border border-[var(--progress-gouge-border)] transition-all max-w-full" style="{attr}:{precWidth}%;{attrTickness}:0.5rem"></div>
</div>


