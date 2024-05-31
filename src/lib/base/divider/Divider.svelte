<svelte:options runes={true} />

<script lang="ts">
	/** extends button */
	import type { ElementProps } from '$lib/types/index.js';
	import { uiPresets } from '$lib/utils/engine/presets.js';

	type DividerProps = {
		/** className off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;

		/**
		 * margins applied to divider
		 * @type {'none' | 'tight' | 'default' | 'medium' | 'kind'}
		 */
		density?: 'none' | 'tight' | 'default' | 'medium' | 'kind';

		/**
		 * default direction of the divider
		 * @type {'vertical' | 'horizontal'}
		 */
		direction?: 'vertical' | 'horizontal';

		/**
		 * expansion of the divider
		 * @type {'full' | 'padded' | 'centered'}
		 */
		expansion?: 'full' | 'padded' | 'centered';

		/** give shadow to divider */
		shadow?: boolean;

		/** give color to divider */
		color?: string | null;
	};

	let {
		class: className = '',
		style = '',
		element = null,
		density = 'default',
		direction = 'horizontal',
		expansion = 'full',
		shadow = false,
		color
	}: DividerProps = $props();

	let extensionClass = {
		horizontal: {
			full: '',
			padded: 'marg-ii-12',
			centered: 'marg-ii-6'
		},
		vertical: {
			full: '',
			padded: 'marg-ii-12',
			centered: 'marg-ii-6'
		}
	};

	let addStyle: string = style ?? '';

	const shadowClass = $derived(shadow ? 'shad-3' : '');

	if (color) addStyle += `--sld-color-border:${color};`;

	// set height od divider when direction === vertical in a flex env
	if (
		direction === 'vertical' &&
		(element?.nextElementSibling ?? element?.previousElementSibling)
	) {
		let maxHeight = (
			element?.previousElementSibling ?? element?.nextElementSibling
		)?.getBoundingClientRect()?.height;

		addStyle += `height:calc(${maxHeight}px - ${getDensity(density)});`;
	}

	function getDensity(density: ElementProps['density']) {
		return uiPresets.density?.[density];
	}

	switch (direction) {
		case 'horizontal':
			addStyle += `margin-top:${getDensity(density)};margin-bottom:${getDensity(density)};`;
			break;
		case 'vertical':
			addStyle += `margin-left:${getDensity(density)};margin-right:${getDensity(density)};`;
			break;
	}
</script>

<hr
	bind:this={element}
	class="{extensionClass[direction][expansion]} {className} {shadowClass}"
	class:vertical={direction === 'vertical'}
	style={addStyle}
/>

<style lang="scss">
	@import 'divider.scss';
</style>
