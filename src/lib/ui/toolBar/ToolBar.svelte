<svelte:options runes />

<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';

	type ToolBarProps = CommonProps & {
		/** color of the toolbar */
		color: string;
		/** whether the toolbar is vertical */
		vertical: boolean;
		/**    */
		element: HTMLDivElement;
		toolbarSeparator?: Snippet;
	};

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		color = '#fff',
		vertical = $bindable<boolean>(false),
		toolbarSeparator,
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
	<Slotted child={children} />
	<Slotted child={toolbarSeparator} />
</div>

<style lang="scss">
	@import './toolbar.scss';
</style>
