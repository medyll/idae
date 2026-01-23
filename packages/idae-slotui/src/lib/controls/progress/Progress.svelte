<script lang="ts">
	import type { ExpandProps } from '$lib/types/index.js';
	import type { ProgressProps } from './types.js';

	let {
		class: className = '',
		style = '',
		element = null,
		percentBase = 100,
		value = 0,
		orientation: direction = 'horizontal',
		...rest
	}: ExpandProps<ProgressProps> = $props();

	const title = `${value} / ${percentBase}`;

	let attr = direction === 'vertical' ? 'height' : 'width';
	let attrTickness = direction === 'vertical' ? 'width' : 'height';
	const precWidth = $derived((value / percentBase) * 100);
</script>

<div bind:this={element} class="progress {className} w-large" {style} {title}>
	<div class="progress-gouge" style="{attr}:{precWidth}%;{attrTickness}:0.5rem"></div>
</div>

<style global lang="scss">
	@use './progress.scss';
</style>
