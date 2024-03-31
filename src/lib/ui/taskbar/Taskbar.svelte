<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';
	import type { Snippet } from 'svelte';

	type TaskbarProps = CommonProps & {
		/** className off the root component */
		class?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;

		/** slots for the taskbar */
		slots?: {
			taskBarLeft?: Snippet;
			taskBarRight?: Snippet;
		};
	};
	let { class: className, children, slots = {}, ...restProps }: TaskbarProps = $props();
</script>

<div class="taskbar flex-h flex-align-middle {className}" {...restProps}>
	<Slotted slotted={slots.taskBarLeft} />
	<div class="flex-main">
		<Slotted slotted={children} />
	</div>
	<Slotted slotted={slots.taskBarRight} />
</div>

<style lang="scss">
	@import './taskbar.scss';
</style>
