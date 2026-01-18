/**
 * Icon component
 *
 * Renders an SVG icon using Iconify. Supports dynamic icon names, color, size, rotation, and animation.
 * Can be used for any icon in the Iconify ecosystem.
 *
 * @component
 * @example
 * <Icon icon="mdi:user" color="red" iconSize="large" />
 */
<script module lang="ts">
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

import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { DemoerStoryProps } from "../demoer/types.js";

export const iconAppDemoValues: DemoerStoryProps<IconAppProps> = {
  icon: {
    type: "icon",
    default: "user",
  },
  iconSize: {
    type: "iconSize",
  },
  color: {
    type: "color",
  },
  rotation: {
    type: "number",
    values: [0, 45, 90, 180, 270],
  },
  rotate: {
    type: "boolean",
  },
};

export let { parameters, componentArgs } = demoerArgs(iconAppDemoValues);
</script>

<script lang="ts">
	import { iconFontSize,   type ExpandProps } from '$lib/types/index.js'; 
	import Iconify from '@iconify/svelte';

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
    class="icon {className} {finRot ? 'animate-spin' : ''}"
    style={finalStyle}
    icon={iconName}
    {...rest}
  />
{/key}


