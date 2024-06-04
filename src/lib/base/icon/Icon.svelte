<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ElementProps, ExpandProps } from '$lib/types/index.js';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import type { IconAppProps } from './types.js';

	let {
		icon = 'question',
		class: className,
		style,
		element = $bindable<HTMLDivElement>(),
		fontSize = 'small',
		rotate = false,
		color,
		rotation = 0,
		ico,
		...rest
	}: ExpandProps<IconAppProps> = $props();

	const sizes: Record<ElementProps['iconSize'], string> = uiPresets.iconSize;

	let finalI = ico?.icon || (typeof icon === 'object' ? icon.icon : icon);
	let finRot = ico?.rotate || (typeof icon === 'object' ? icon.rotate : rotate);
	let finRotation = $derived(
		ico?.rotation || (typeof icon === 'object' ? icon.rotation : rotation)
	);
	let finCol = ico?.color || (typeof icon === 'object' ? icon.color : color);
	let finSize = ico?.size || fontSize;
	let iconName = $derived(finalI.includes(':') ? finalI : `mdi:${finalI}`);

	style = `display:inline-block;font-size:${sizes[finSize]};color:${finCol};${style}`;
</script>

{#key [icon, iconName]}
	<Icon
		bind:this={element}
		class="icon {className} {finRot}"
		style="{style};transform: rotate({finRotation}deg)"
		{onclick}
		icon={iconName}
	/>
{/key}

<style global lang="scss">
	@import './icon.scss';
</style>
