<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ElementProps, IconObj } from '$lib/types/index.js';
	import { uiPresets } from '$lib/utils/engine/presets.js';

	type IconProps = {
		/** className off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null | any;

		/** icon name for iconify  */
		icon?: string;
		/** icon object for iconify, replace and invalidate props.icon  */
		ico?: IconObj;

		/**
		 * icon size
		 * @type {'small' | 'medium' | 'large' | 'xlarge'}
		 */
		fontSize?: 'small' | 'medium' | 'large' | 'xlarge' | string;

		/** rotate icon */
		rotate?: boolean;

		/** icon color */
		color?: string;

		/** icon rotation */
		rotation?: number;
	};

	let {
		class: className,
		style,
		element = $bindable<HTMLDivElement>(),
		icon = 'question',
		fontSize = 'small',
		rotate = false,
		color,
		rotation = 0,
		ico
	}: IconProps = $props();

	const sizes: Record<ElementProps['sizeType'], string> = uiPresets.iconSize;

	let finalI = ico?.icon || icon;
	let finRot = ico?.rotate || rotate;
	let finRotation = $derived(ico?.rotation || rotation);
	let finCol = ico?.color || color;
	let finSize = ico?.size || fontSize;
	let iconName = $derived(finalI.includes(':') ? finalI : `mdi:${finalI}`);
</script>

{#key rotation}
	<Icon
		bind:this={element}
		class="icon {className} {finRot}"
		style="display:inline-block;font-size:{sizes[
			finSize
		]};color:{finCol};{style};transform: rotate({finRotation}deg)"
		on:click
		icon={iconName}
	/>
{/key}

<style global lang="scss">
	@import './icon.scss';
</style>
