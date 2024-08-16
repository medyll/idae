<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { ElementProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';
	import type { ButtonProps } from './types.js';
	type IconButtonProps = {
		/** Icon to be displayed */
		icon: ElementProps['icon'];
		showShip?: boolean;
		/** Font size of the icon */
		iconFontSize?: ElementProps['iconSize'];
		element?: HTMLButtonElement | null;

		/** Aspect ratio of the icon button */
		ratio?: string;

		/** Whether to show the chip or not */
		showChip?: boolean;

		/** Rotation of the icon */
		rotation?: number;

		size?: ElementProps['width'];
		/** Children   for the default content */
		children?: Snippet;
	} & Partial<ButtonProps>;

	let {
		element,
		icon,
		ratio = '1/1',
		iconFontSize = 'full',
		rotation = 0,
		size = 'mini',
		children,
		...rest
	}: IconButtonProps = $props();
</script>

<!-- <Button variant="square" bind:element width={size} tall="unset" {ratio} {...rest}>
	<Icon style="display:block; " {rotation} {icon} iconSize={iconFontSize} />
</Button> -->
