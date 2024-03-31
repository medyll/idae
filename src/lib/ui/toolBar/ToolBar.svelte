<svelte:options accessors runes />

<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';
	import type { Snippet } from 'svelte';

	type ToolBarProps = CommonProps & {
		/** color of the toolbar */
		color: string;
		/** whether the toolbar is vertical */
		vertical: boolean;
		/**    */
		element: HTMLDivElement;
		slots: {
			separator: Snippet | undefined;
		};
	};

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		color = '#fff',
		vertical = $bindable<boolean>(false),
		slots = { separator: undefined },
		children,
		...rest
	}: ToolBarProps = $props();
</script>

<div
	bind:this={element}
	class:vertical
	class="toolbar {className}"
	style="{style};--color: {color}"
	{...rest}
>
	<Slotted slotted={children} />
	<Slotted slotted={slots.separator} />
</div>

<style lang="scss">
	@import './toolbar.scss';
</style>
