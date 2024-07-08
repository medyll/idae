<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonProps } from './types.js';
	type IconButtonProps = CommonProps & {
		/** Icon to be displayed */
		icon: ElementProps['icon'];
		showShip?: boolean;
		/** Font size of the icon */
		iconFontSize?: ElementProps['iconSize'];
		readonly element?: HTMLButtonElement | null;

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
		style = '',
		icon,
		ratio = '1/1',
		iconFontSize = 'small',
		rotation = 0,
		tall = 'mini',
		width = 'mini',
		children,
		...rest
	}: IconButtonProps = $props();
</script>

<Button
	{tall}
	{width}
	{...rest}
	bind:element
	style="{style};aspect-ratio:{ratio};overflow:hidden;align-items:center;"
	{ratio}><Icon {rotation} {icon} iconSize={iconFontSize} /></Button
>
