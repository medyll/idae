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

		/**
		 * icon name
		 * @type {string}
		 */
		icon: string;

		/** icon family */
		iconFamily?: string;

		/**
		 * icon size
		 * @type {'small' | 'medium' | 'large' | 'xlarge'}
		 */
		fontSize?: ElementProps['sizeType'];

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
		iconFamily = 'mdi',
		fontSize = 'small',
		rotate = false,
		color,
		rotation = 0,
		...restProps
	} = $props() as IconProps;

	const sizes: Record<ElementProps['sizeType'], number> = uiPresets.iconSize;

	const iconName = $derived(icon.includes(':') ? icon : `${iconFamily}:${icon}`);
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
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';

	.icon {
		transition: all 0.25s;
	}

	.rotate {
		animation: spinner-frames 3s infinite linear;
	}
	@keyframes spinner-frames {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
