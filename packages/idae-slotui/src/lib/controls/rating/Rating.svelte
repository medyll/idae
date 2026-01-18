<script module lang="ts">
	import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
	import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';

	export type RatingProps = {
		/** maximum rate */
		ratingBase?: number;
		/** current score */
		scored: number;
		/** default icon to be used when not using slots */
		defaultIcon?: string;
		/** scored icon to be used when not using slots */
		scoredIcon?: string;
		/** can be vertical or horizontal */
		orientation?: ElementProps['orientation'];
		/** Snippet for the scored icon */
		ratingScoredIcon?: Snippet;
	} & CommonProps;

	export const RatingDemoValues: DemoerStoryProps<RatingProps> = {
		scored: {
			type: 'number',
			values: [1, 2, 3, 4, 5]
		},
		ratingBase: {
			type: 'number',
			values: [5, 10],
			default: 10
		},
		defaultIcon: {
			type: 'icon',
			values: ['ant-design:star-outlined', 'minus']
		},
		scoredIcon: {
			type: 'icon',
			values: ['ant-design:star-filled', 'plus']
		},
		orientation: {
			type: 'orientation'
		}
	};

	export let { parameters, componentArgs } = demoerArgs(RatingDemoValues);
</script>

<script lang="ts">
		import Icon from '$lib/base/icon/Icon.svelte';
		import type { ExpandProps } from '$lib/types/index.js';
		import Slotted from '$lib/utils/slotted/Slotted.svelte';

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
		}: ExpandProps<import('./Rating.svelte').RatingProps> = $props();

		const title = `${scored} / ${ratingBase}`;
</script>

<div
	bind:this={element}
	class="rating flex gap-[var(--rating-gap)] {className}"
	style="flex-direction:{direction === 'horizontal' ? 'row' : 'column'};{style}"
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


