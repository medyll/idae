<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';

	type Props = CommonProps & {
		value: number;
		ceiling: number;
		element: HTMLDivElement;
		/**
		 * position of the badge
		 * @type {{ x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' }}
		 */
		position: { x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' };
	};

	let { value, ceiling, element, position = { x: 'right', y: 'top' }, children } = $props<Props>();

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
		{#if children}
			{@render children()}
		{:else}
			{value}
		{/if}
	</div>
{/if}

<style lang="scss">
	@import 'badge.scss';
</style>
