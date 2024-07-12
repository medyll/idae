<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { RatingProps } from './types.js';

	let {
		class: className = '',
		style,
		element = $bindable(),
		ratingBase = $bindable(4),
		scored = $bindable(0),
		defaultIcon = $bindable('star'),
		scoredIcon = $bindable('star-fill'),
		orientation: direction = $bindable('horizontal'),
		ratingScoredIcon,
		children,
		...rest
	}: ExpandProps<RatingProps> = $props();

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
				<Icon icon={scoredIcon} />
			</Slotted>
		{:else}
			<Slotted child={children}>
				<Icon icon={defaultIcon} />
			</Slotted>
		{/if}
	{/each}
</div>

<style lang="scss">
	@import './rating.scss';
</style>
