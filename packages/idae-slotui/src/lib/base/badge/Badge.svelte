<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { BadgeProps } from './types.js';

	let {
		value,
		ceiling,
		element,
		position = { x: 'right', y: 'top' },
		children
	}: BadgeProps = $props();

	const xM = {
		left: 'left:0',
		right: 'right:0',
		center: 'left:50%;transformation:translate(-50%,0)'
	};
	const yM = {
		top: 'top:0',
		bottom: 'bottom:0',
		center: 'top:50%;transformation:translate(0,-50%)'
	};
</script>

{#if value > ceiling}
	<div bind:this={element} class="badge" style="{xM[position.x]};{yM[position.y]}">
		<Slotted child={children}>{value}</Slotted>
	</div>
{/if}

<style>
	@import './badge.css';
</style>
