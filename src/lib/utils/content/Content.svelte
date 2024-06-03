<!--
 @component Content
	@ Adds css properties for width, height, offsetHeight, and offsetWidth to the style of the element.
	@ var(--${cssPrefix}-height)
	@ var(--${cssPrefix}-width)
	@ var(--${cssPrefix}-offset-height)
	@ var(--${cssPrefix}-offset-width)
	@ EThe content element will fire a custom 'dom:resize' event when the bindable properties change. 
-->
<script lang="ts">
	import { be } from '../engine/elem.js';
	import Slotted from '../slotted/Slotted.svelte';
	import type { BindableEvent, ContentProps } from './content-types.js';

	let {
		element,
		dimensions = $bindable({
			clientHeight: element?.clientHeight,
			clientWidth: element?.clientWidth,
			offsetHeight: element?.offsetHeight,
			offsetWidth: element?.offsetWidth
		}),
		cssVar,
		cssPrefix = 'bind',
		tag = 'div',
		style = $bindable(''),
		solid = false,
		implementation = 'inline',
		onresize = (event: BindableEvent) => {},
		children,
		...rest
	}: ContentProps = $props();

	cssVar = `--${cssPrefix}-height: ${dimensions.clientHeight}px; 
            --${cssPrefix}-width: ${dimensions.clientWidth}px; 
            --${cssPrefix}-offset-height: ${dimensions.offsetHeight}px; 
            --${cssPrefix}-offset-width: ${dimensions.offsetWidth}px;`;

	$effect(() => {
		if (element && dimensions)
			element.dispatchEvent(
				new CustomEvent('dom:resize', {
					detail: { dimensions, element }
				})
			);
	});

	$effect(() => {
		if (element && !solid && element.style.display !== 'none')
			be(element).setStyle({ display: 'contents' });
	});

	function transformToObj(dimensions: ContentProps['dimensions']) {
		let result = {} as any;
		for (let key in dimensions) {
			result[`--${cssPrefix}-${key}`] = `${dimensions[key as keyof ContentProps['dimensions']]}px`;
		}
		return result;
	}

	function applyStyle() {
		switch (implementation) {
			case 'inline':
				return `${cssVar};display:contents;${style ?? ''}`;
			case 'style':
				return `${cssVar};display:block;${style ?? ''}`;
		}
	}
</script>

<svelte:element
	this={tag}
	bind:this={element}
	bind:clientHeight={dimensions.clientHeight}
	bind:clientWidth={dimensions.clientWidth}
	bind:offsetHeight={dimensions.offsetHeight}
	bind:offsetWidth={dimensions.offsetWidth}
	style={`${cssVar};${style}`}
	{...rest}
>
	<Slotted child={children} />
</svelte:element>
