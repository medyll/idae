<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
/**
 * Props for the Badge component.
 * Represents a badge indicator with a value, ceiling, and position.
 */
export interface BadgeProps extends CommonProps {
	/** Value to display in the badge */
	value: number;
	/** Maximum value before badge is hidden */
	ceiling: number;
	/** Reference to the badge element */
	element: HTMLDivElement;
	/**
	 * Position of the badge.
	 * @type {{ x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' }}
	 */
	position: { x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' };
}
</script>
<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		value,
		ceiling,
		element,
		position = { x: 'right', y: 'top' },
		children
	}: BadgeProps = $props();

	const xM = {
		left: 'left:0',
		right: 'right:0',
		center: 'left:50%;transformation:translate(-50%,0)'
	};
	const yM = {
		top: 'top:0',
		bottom: 'bottom:0',
		center: 'top:50%;transformation:translate(0,-50%)'
	};
</script>

{#if value > ceiling}
	<div bind:this={element} class="badge" style="{xM[position.x]};{yM[position.y]}">
		<Slotted child={children}>{value}</Slotted>
	</div>
{/if}

<style global lang="postcss">
	@reference "tailwindcss"
	@import './badge.css';
</style>
