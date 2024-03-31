<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ElementProps } from '$lib/types/index.js';
	import { uiPresets } from '$lib/utils/engine/presets.js';

	type IconProps = {
		/** className off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null | any;

		/** icon name for iconify  */
		icon: string;

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
		...restProps
	}: IconProps = $props();

	const sizes: Record<ElementProps['sizeType'], string> = uiPresets.iconSize;

	let iconName = $derived(icon.includes(':') ? icon : `mdi:${icon}`);
</script>

{#key rotation}
	<Icon
		bind:this={element}
		class="icon {className} {rotate}"
		style="display:block;font-size:{sizes[
			fontSize
		]};color:{color};{style};transform:({rotation}deg)"
		on:click
		icon={iconName}
		{...restProps}
	/>
{/key}

<style global lang="scss">
	@import './icon.scss';
</style>
