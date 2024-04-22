<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';

	type PaperProps = {
		/** className off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;
	} & CommonProps;

	let { class: className = '', style, element = $bindable(), ...rest }: PaperProps = $props();
</script>

<div bind:this={element} class="paper {className}" {style} {...rest}>
	<slot />
</div>

<style lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	.paper {
		color: var(--sld-color-foreground);
		background-color: var(--sld-color-paper);
		border-radius: var(--sld-radius-small);
		box-shadow: var(--sld-elevation-4);
	}
</style>
