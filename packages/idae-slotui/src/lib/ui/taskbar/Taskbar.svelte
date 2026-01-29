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

<style lang="scss">
	@use './taskbar.scss';
</style>
