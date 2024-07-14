<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';
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

		/** Children   for the default content */
		children?: Snippet;
	} & Partial<ButtonProps>;

	let {
		element, 
		icon,
		ratio = '1/1',
		iconFontSize = 'full',
		rotation = 0,
		width = "mini",  
		tall="auto",
		children,
		...rest
	}: IconButtonProps = $props();
</script>

<Button   square="true" variant="square" bind:this={element}  {width}  {tall}  {ratio} {...rest}>
	<Icon  style="display:block;width:100%;" {rotation} {icon} iconSize={iconFontSize} />
</Button>
