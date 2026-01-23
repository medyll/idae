<script lang="ts">
	import type { ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { PaperProps } from './type.js';

	let {
		class: className = '',
		style,
		element = $bindable(),
		children,
		elevation = 0,
		...rest
	}: ExpandProps<PaperProps> = $props();
</script>

<div bind:this={element} class="paper {className} elevation-{elevation}" {style} {...rest}>
	<Slotted child={children} />
</div>

<style global>
	@import './paper.tailwind.css';
	@import '../../slotui-css/paper.tailwind.css';
</style>
