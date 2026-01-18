<script module lang="ts">
	import { densePreset, uiPresets, type ElementProps } from "$lib/types/index.js";
	import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
	import type { DemoerStoryProps } from "../demoer/types.js";

	export type DividerProps = {
		class?: string;
		style?: CSSStyleDeclaration;
		element?: HTMLDivElement | null;
		dense?: ElementProps["dense"];
		orientation?: ElementProps["orientation"];
		expansion?: "full" | "padded" | "centered";
		shadowed?: boolean;
		color?: string | null;
	};

	export const DividerDemoValues: DemoerStoryProps<DividerProps> = {
		dense: {
			type: "dense",
			default: densePreset.default,
		},
		orientation: {
			type: "direction",
		},
		expansion: {
			type: "string",
			values: ["full", "padded", "centered"],
		},
		shadowed: {
			type: "boolean",
		},
		color: {
			type: "color",
		},
	};

	export let { parameters, componentArgs } = demoerArgs(DividerDemoValues);
</script>

<script lang="ts">
		/** extends button */
		import type { ElementProps, ExpandProps } from '$lib/types/index.js';
		import { uiPresets } from '$lib/utils/engine/presets.js';

		let {
				class: className = '',
				style,
				element = null,
				dense: density = 'default',
				orientation: direction = 'horizontal',
				expansion = 'full',
				shadowed: shadow = false,
				color
		}: ExpandProps<import('./Divider.svelte').DividerProps> = $props();

		let extensionClass = {
				horizontal: {
						full: '',
						padded: 'marg-ii-12',
						centered: 'marg-ii-6'
				},
				vertical: {
						full: '',
						padded: 'marg-ii-12',
						centered: 'marg-ii-6'
				}
		};
		let addStyle: string = (style as unknown as string) ?? ('' as unknown as string);

		const shadowClass = $derived(shadow ? 'shad-3' : '');

		if (color) addStyle += `--sld-color-border:${color};`;

		// set height od divider when direction === vertical in a flex env
		if (
				direction === 'vertical' &&
				(element?.nextElementSibling ?? element?.previousElementSibling)
		) {
				let maxHeight = (
			element?.previousElementSibling ?? element?.nextElementSibling
		)?.getBoundingClientRect()?.height;

		addStyle += `height:calc(${maxHeight}px - ${getDensity(density)});`;
	}

	function getDensity(density: ElementProps['density']) {
		return uiPresets.density?.[density];
	}

	switch (direction) {
		case 'horizontal':
			addStyle += `margin-top:${getDensity(density)};margin-bottom:${getDensity(density)};`;
			break;
		case 'vertical':
			addStyle += `margin-left:${getDensity(density)};margin-right:${getDensity(density)};`;
			break;
	}
</script>

<hr
	bind:this={element}
	class="{extensionClass[direction][expansion]} {className} {shadowClass} {direction === 'vertical' ? 'w-px border-r border-[var(--divider-border-right)]' : 'border-0 border-t border-[var(--divider-border-top)] bg-[var(--divider-background-color)] block'}"
	style={addStyle}
/>


