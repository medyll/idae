<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the Paper component.
 * Represents a container with elevation and slot support.
 */
export type PaperProps = CommonProps & {
	/** CSS class for the root element */
	class?: string;
	/** Inline style for the root element */
	style?: string;
	/** Reference to the root HTMLDivElement */
	element?: HTMLDivElement | null;
	/** Elevation level (0-5) */
	elevation?: number;
	/** Slot for children content */
	children?: Snippet;
};
</script>
<script lang="ts">
		import type { ExpandProps } from '$lib/types/index.js';
		import Slotted from '$lib/utils/slotted/Slotted.svelte';
		// PaperProps now in module script

	let {
		class: className = '',
		style,
		element = $bindable(),
		children,
		elevation = 0,
		...rest
	}: ExpandProps<PaperProps> = $props();
</script>

<div bind:this={element} class="paper {className} elevation-{elevation}" {style} {...rest}>
	<Slotted child={children} />
</div>

<style global lang="postcss">
	@reference "tailwindcss";

	.paper {
		background: var(--sld-paper-bg, #fff);
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
		padding: 1rem;
	}

	.paper.flat { box-shadow: none; }
</style>
