<script module lang="ts">
import { iconFontSize,   type ExpandProps } from '$lib/types/index.js'; 
import Iconify from '@iconify/svelte';
import type { ElementProps, IconObj } from "$lib/types/index.js"; 

/**
 * Properties for the IconApp component.
 */
export type IconAppProps = {
  /**
   * Icon name for Iconify.
   * @param icon
   */
  icon?: ElementProps["icon"];

  /**
   * Class name of the root component.
   * @param class
   */
  class?: string;

  /**
   * CSS style of the root component.
   * @param style
   */
  style?: string;

  /**
   * Root HTMLDivElement properties.
   * @param element
   */
  element?: HTMLDivElement | null | any;

  /**
   * Icon object for Iconify, replaces and invalidates `icon` prop.
   * @param ico
   */
  ico?: IconObj;

  /**
   * Icon size.
   * @param iconSize
   */
  iconSize?: ElementProps["iconSize"];

  /**
   * Rotate icon.
   * @param rotate
   */
  rotate?: boolean;

  /**
   * Icon color.
   * @param color
   */
  color?: string;

  /**
   * Icon rotation.
   * @param rotation
   */
  rotation?: number;

  /**
   * Display property for the icon.
   * @param display
   */
  display?: "block" | "inline-block" | "inline";
};
</script>

<script lang="ts">

	let {
		icon = $bindable('question'),
		class: className,
		style,
		element = $bindable<HTMLDivElement>(),
		iconSize = $bindable(),
		rotate = false,
		color = $bindable(),
		rotation = 0,
		ico,
		display = 'inline-block',
		...rest
	}: ExpandProps<IconAppProps> = $props();

	iconSize = iconSize || 'small';

	const sizes: Record<ElementProps['iconSize'], string> = iconFontSize;

	let finalI = $derived(ico?.icon ?? (typeof icon === 'object' ? icon.icon : icon));
	let finRot = $derived(ico?.rotate ?? (typeof icon === 'object' ? icon.rotate : rotate));
	let finRotation = $derived(
		ico?.rotation ?? (typeof icon === 'object' ? icon.rotation : rotation)
	);
	let finCol = $derived(ico?.color ?? (typeof icon === 'object' ? icon.color : color));
	let finSize = $derived(ico?.iconSize ?? (typeof icon === 'object' ? iconSize : iconSize));
	let iconName = $derived(finalI.includes(':') ? finalI : `mdi:${finalI}`);

	let finalStyle = $derived(
		`display:${display};font-size:${sizes[finSize]};color:${finCol};transform: rotate(${finRotation}deg);${style};`
	);
 
</script>

{#key [icon, iconName, color, finalStyle]}
	<Iconify
		bind:this={element}
		class="icon medium {className} {finRot ? 'rotate' : ''}"
		style={finalStyle}
		icon={iconName}
		{...rest}
	/>
{/key}

<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<style global lang="postcss">
  @reference "tailwindcss";

  :root {
    --icon-size: 1.5em;
    --icon-color: var(--sld-color-icon);
  }

  :global(.icon) {
    transition: all 0.2s;
  }

  .rotate { animation: spinner-frames 3s infinite linear; }

  @keyframes spinner-frames {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .icon {
    display: inline-block;
    width: var(--icon-size);
    height: var(--icon-size);
    color: var(--icon-color);
    vertical-align: middle;
  }
</style>
