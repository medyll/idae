<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the ToolBar component.
 */
export type ToolBarProps = CommonProps & {
	/** Color of the toolbar */
	color?: string;
	/** Whether the toolbar is vertical */
	vertical?: boolean;
	/** Root HTML element reference */
	element?: HTMLDivElement;
	/** Custom separator snippet */
	toolbarSeparator?: Snippet;
};
</script>
<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';


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

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--toolbar-padding: var(--sld-toolbar-padding, var(--box-density-1, var(--sld-pad-tiny)));
		--toolbar-gap: var(--sld-pad-tiny);
		--toolbar-divider-border: 1px solid red;
		--toolbar-divider-height: 1rem;
		--toolbar-vertical-divider-border: 1px solid green;
		--toolbar-vertical-divider-width: 1rem;
	}

	.toolbar {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: var(--toolbar-padding);
		gap: var(--toolbar-gap);
	}
</style>
