<script lang="ts">
	import { iconFontSize, type ElementProps, type ExpandProps } from '$lib/types/index.js';
	import type { IconAppProps } from './types.js';
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
		`display:block;font-size:${sizes[finSize]};color:${finCol};transform: rotate(${finRotation}deg);${style};`
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

<style   lang="scss">
	@import './icon.scss';
</style>
