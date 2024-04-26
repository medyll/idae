<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';
	import type { TaskbarProps } from './types.js';

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
	@import './taskbar.scss';
</style>
