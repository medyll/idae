<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { PaperProps } from './type.js';

	let {
		class: className = '',
		style,
		element = $bindable(),
		children,
		elevation = 0,
		...rest
	}: PaperProps = $props();
</script>

<div bind:this={element} class="paper {className} elevation-{elevation}" {style} {...rest}>
	<Slotted child={children} />
</div>

<style lang="scss">
	@import './paper.scss';
</style>
