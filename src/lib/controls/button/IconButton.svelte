<svelte:options accessors runes />

<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';
	type IconButtonProps = CommonProps & {
		/** Icon to be displayed */
		icon: ElementProps['icon'];
		showShip?: boolean;
		/** Font size of the icon */
		iconFontSize: ElementProps['iconSize'];
		readonly element: HTMLButtonElement | null;

		/** Aspect ratio of the icon button */
		ratio: string;

		/** Whether to show the chip or not */
		showChip: boolean;

		/** Rotation of the icon */
		rotation: number;

		/** Children slot for the default content */
		children?: Snippet;
	};

	let elementRef: HTMLButtonElement;

	let {
		element = $bindable<HTMLButtonElement>(elementRef),
		style = '',
		icon,
		iconFontSize = 'small',
		ratio = '1/1',
		rotation = 0,
		children,
		...rest
	}: IconButtonProps = $props();
</script>

<Button data-iconButton {...rest} bind:element={elementRef} style="{style};aspect-ratio:{ratio};">
	<Icon {rotation} {icon} fontSize={iconFontSize} />
</Button>
