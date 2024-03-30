<svelte:options accessors={true} runes={true} />

<script lang="ts">
	type ChipperProps = {
		/** className off the root component */
		class?: string;
		/** css style off the root component */
		style?: string;
		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;
		/** position of the chipper
		@type {'top' | 'bottom' | 'left' | 'right'}
		*/
		position: 'top' | 'bottom' | 'left' | 'right';
		/** theme color of the chip
		@type {'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark'}
		*/
		bgTheme?: string;
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
		element = null,
		position = 'bottom',
		bgTheme = 'primary',
		color = '',
		content = '',
		showChip = true
	} = $props() as ChipperProps;

	const cssColor = $derived(color ?? (bgTheme ? `var(--sld-color-${bgTheme})` : ''));
</script>

<div bind:this={element} style="{style};position:relative;" class="chipper gap-tiny {className} ">
	<slot>
		{#if content}
			<div class="chipper-content">{@html content ?? ''}</div>
		{/if}
	</slot>
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
