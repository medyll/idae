<script module lang="ts">
import type { ElementProps } from '$lib/types/index.js';
/**
 * Props for the Progress component.
 * Represents a progress bar with orientation and value support.
 */
export type ProgressProps = {
	/** CSS class for the root element */
	class?: string;
	/** Inline style for the root element */
	style?: string;
	/** Reference to the root HTMLDivElement */
	element?: HTMLDivElement | null;
	/** Base value for the progress (default: 100) */
	percentBase?: number;
	/** Current value of the progress */
	value: number;
	/** Orientation: 'vertical' or 'horizontal' */
	orientation?: ElementProps['orientation'];
};
</script>
<script lang="ts">
		import type { ExpandProps } from '$lib/types/index.js';
		// ProgressProps now in module script

	let {
		class: className = '',
		style = '',
		element = null,
		percentBase = 100,
		value = 0,
		orientation: direction = 'horizontal',
		...rest
	}: ExpandProps<ProgressProps> = $props();

	const title = `${value} / ${percentBase}`;

	let attr = direction === 'vertical' ? 'height' : 'width';
	let attrTickness = direction === 'vertical' ? 'width' : 'height';
	const precWidth = $derived((value / percentBase) * 100);
</script>

<div bind:this={element} class="progress {className} w-large" {style} {title}>
	<div class="progress-gouge" style="{attr}:{precWidth}%;{attrTickness}:0.5rem"></div>
</div>

<style global>
  @import './progress.css';
</style>
