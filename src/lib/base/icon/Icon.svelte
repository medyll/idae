<script lang="ts">
	import { iconFontSize, type ElementProps, type ExpandProps } from '$lib/types/index.js';
	import type { IconAppProps } from './types.js';
	import Iconify from '@iconify/svelte';

	let {
		icon = $bindable('question'),
		class: className,
		style,
		element = $bindable<HTMLDivElement>(),
		iconSize = $bindable('small'),
		rotate = false,
		color,
		rotation = 0,
		ico,
		...rest
	}: ExpandProps<IconAppProps> = $props();

	const sizes: Record<ElementProps['iconSize'], string> = iconFontSize;

	let finalI = $derived(ico?.icon ?? (typeof icon === 'object' ? icon.icon : icon));
	let finRot = ico?.rotate ?? (typeof icon === 'object' ? icon.rotate : rotate);
	let finRotation = ico?.rotation ?? (typeof icon === 'object' ? icon.rotation : rotation);
	let finCol = ico?.color ?? (typeof icon === 'object' ? icon.color : color);
	let finSize = ico?.iconSize ?? (typeof icon === 'object' ? iconSize : iconSize);
	let iconName = $derived(finalI.includes(':') ? finalI : `mdi:${finalI}`);

	let finalStyle = `display:inline-block;font-size:${sizes[finSize]};color:${finCol};transform: rotate(${finRotation}deg);${style}`;
</script>

{#key icon}
	{#key finalStyle}
		{#key iconName}
			<Iconify
				bind:this={element}
				class="icon medium {className} {finRot ? 'rotate' : ''}"
				style={finalStyle}
				icon={iconName}
				{...rest}
			/>
		{/key}
	{/key}
{/key}

<style global lang="scss">
	@import './icon.scss';
</style>
