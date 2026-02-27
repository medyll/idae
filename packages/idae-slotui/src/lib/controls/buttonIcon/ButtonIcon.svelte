<script module lang="ts">
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { ButtonProps } from '../button/types.js';
import Button from '$lib/controls/button/Button.svelte';
import Icon from '$lib/base/icon/Icon.svelte';
/**
 * Props for the IconButton component.
 * Extends ButtonProps with icon, size, and slot support.
 */
export type ButtonIconProps = Partial<ButtonProps> & {
	/** Icon to be displayed */
	icon: ElementProps['icon'];
	/** Show a ship indicator (optional) */
	showShip?: boolean;
	/** Font size of the icon */
	iconFontSize?: ElementProps['iconSize'];
	/** Reference to the button element */
	element?: HTMLButtonElement | null;
	/** Aspect ratio of the icon button */
	ratio?: string;
	/** Whether to show the chip or not */
	showChip?: boolean;
	/** Rotation of the icon */
	rotation?: number;
	/** Width/size of the button */
	size?: ElementProps['width'];
	/** Slot for children content */
	children?: Snippet;
};
</script>
<script lang="ts">

	let {
		element,
		icon,
		ratio = '1/1',
		iconFontSize = 'full',
		rotation = 0,
		size = 'mini',
		children,
		...rest
	}: ButtonIconProps = $props();

	let finalIcon = $derived(typeof icon === 'object' ? {...icon,iconSize:iconFontSize} : {icon,iconSize:iconFontSize});
</script>

<Button variant="square" bind:element width={size} tall="unset" {ratio} {...rest}>
	<Icon style="display:inline; " {rotation} icon={finalIcon}   />
</Button>

<style global lang="postcss">
	@reference "tailwindcss";
	/* MIGRATION: uses shared `button.css` from controls/button; manual review required.
	   Keeping tailwind reference and removing direct import. */
</style>
