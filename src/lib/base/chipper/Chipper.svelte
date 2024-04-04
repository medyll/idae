<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';

	type ChipperProps = CommonProps & {
		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;
		/** position of the chipper
		@type {'top' | 'bottom' | 'left' | 'right'}
		*/
		position: 'top' | 'bottom' | 'left' | 'right';
		/** status of the chip
		@type {'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark'}
		*/
		status?: string;
		/** css color code for the chip */
		color?: string;
		/** text or html is slot is not used */
		content?: string;
		/** show or hide the chip */
		showChip: boolean;
	};

	let {
		class: className = '',
		style = '',
		element = $bindable<HTMLDivElement>(),
		position = 'bottom',
		status = 'primary',
		color = '',
		content = '',
		showChip = true,
		children
	}: ChipperProps = $props();

	let cssColor = $derived(color ?? (status ? `var(--sld-color-${status})` : ''));
</script>

<div bind:this={element} style="{style};position:relative;" class="chipper gap-tiny {className} ">
	{#if children}
		{@render children()}
	{:else if content}
		<div class="chipper-content">{@html content ?? ''}</div>
	{/if}
	<chip class="chipper-chip" data-position={position} style:--css-button-chip-color={cssColor}>
		{#if showChip}
			<slot name="chipperChip">
				<div class="defaultChip" />
			</slot>
		{/if}
	</chip>
</div>

<style lang="scss">
	@import './chipper.scss';
</style>
