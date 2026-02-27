<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the Taskbar component.
 */
export type TaskbarProps = CommonProps & {
	/** Class name for the root component */
	class?: string;
	/** Root HTMLDivElement reference */
	element: HTMLDivElement;
	/** Left slot for the taskbar */
	taskBarLeft?: Snippet;
	/** Right slot for the taskbar */
	taskBarRight?: Snippet;
};
</script>
<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';


	let {
		element,
		style,
		class: className,
		taskBarLeft,
		taskBarRight,
		children,
		...restProps
	}: TaskbarProps = $props();
</script>

<div class="taskbar {className}" {...restProps}>
	<Slotted child={taskBarLeft} />
	<div class="taskbar-main">
		<Slotted child={children} />
	</div>
	<Slotted child={taskBarRight} />
</div>

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--taskbar-grid-gap: var(--sld-gap-tiny);
		--taskbar-background-color: rgba(255, 255, 255, 0.5);
		--taskbar-backdrop-filter: blur(20px);
		--taskbar-min-height: 48px;
		--taskbar-border-bottom: rgba(255, 255, 255, 0.2);
		--taskbar-box-shadow: var(--sld-elevation-3);
	}

	.taskbar {
		display: flex;
		align-items: center;
		grid-gap: var(--taskbar-grid-gap);
		background-size: auto;
		background-color: var(--taskbar-background-color);
		--moz-backdrop-filter: var(--taskbar-backdrop-filter);
		backdrop-filter: var(--taskbar-backdrop-filter);
		min-height: var(--taskbar-min-height);
		border-bottom: 1px solid var(--taskbar-border-bottom);
		box-shadow: var(--taskbar-box-shadow);
		box-sizing: border-box;
	}

	.taskbar-main { flex: 1; }
</style>
