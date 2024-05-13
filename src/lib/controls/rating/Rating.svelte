<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { RatingProps } from './types.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		ratingBase = 4,
		scored = 0,
		defaultIcon,
		scoredIcon,
		direction = 'horizontal',
		ratingScoredIcon,
		children,
		...rest
	}: RatingProps = $props();

	const title = `${scored} / ${ratingBase}`;
</script>

<div
	bind:this={element}
	class="rating {className}"
	style="--direction:{direction === 'horizontal' ? 'row' : 'column'};{style}"
	{title}
	{...rest}
>
	{#each [...Array(ratingBase)] as rate, idx}
		{#if idx + 1 <= scored}
			<Slotted child={ratingScoredIcon}>
				<slot name="ratingScoredIcon">
					<Icon icon={scoredIcon} />
				</slot>
			</Slotted>
		{:else}
			<Slotted child={children}>
				<slot>
					<Icon icon={defaultIcon} />
				</slot>
			</Slotted>
		{/if}
	{/each}
</div>

<style lang="scss">
	@import './rating.scss';
</style>
