<script module lang="ts">
import type { CommonProps, ElementProps, ExpandProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import Slotted from '$lib/utils/slotted/Slotted.svelte';
/**
 * Props for the Chipper component.
 * Represents a chip-style badge with customizable position, color, and content.
 */
export interface ChipperProps extends CommonProps {
	/** Position of the chipper (e.g., 'bottom', 'top', etc.) */
	position?: ElementProps["position"];
	/** Theme color for the chip */
	theme?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
	/** CSS color code for the chip */
	color?: string;
	/** Text or HTML content for the chip */
	content?: string;
	/** Whether to show the chip */
	showChip?: boolean;
	/** Slot for chip content */
	chipperChip?: Snippet;
}
</script>
<script lang="ts">
		// ChipperProps now in module script

	let {
		class: className = '',
		style,
		element = $bindable<HTMLDivElement>(),
		position = 'bottom',
		theme: status = 'primary',
		color = '',
		content = '',
		showChip = true,
		chipperChip,
		children
	}: ExpandProps<ChipperProps> = $props();

	let cssColor = $derived(color ?? (status ? `var(--sld-color-${status})` : ''));
</script>

<div bind:this={element} style="{style};position:relative;" class="chipper {className} ">
	<Slotted child={children}>
		{#if content}
			<div class="chipper-content">{@html content ?? ''}</div>
		{/if}
	</Slotted>

	<chip class="chipper-chip" data-position={position} style:--css-button-chip-color={cssColor}>
		{#if showChip}
			<Slotted child={chipperChip} />
		{/if}
	</chip>
</div>

<style global>
  @import './chipper.css';
</style>
