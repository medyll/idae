<script lang="ts">
	import type { CommonProps, ElementProps, ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ChipperProps } from './types.js';

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

<style global lang="scss">
	@use './chipper.scss';
</style>
