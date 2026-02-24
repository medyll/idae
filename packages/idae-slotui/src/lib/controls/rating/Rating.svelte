<script module lang="ts">
import type { Snippet } from 'svelte';
/**
 * Props for the Rating component.
 * Represents a rating widget with customizable icons, orientation, and slot support.
 */
export type RatingProps = {
	/** Maximum rate (number of icons) */
	ratingBase?: number;
	/** Current score */
	scored: number;
	/** Default icon to be used when not using slots */
	defaultIcon?: string;
	/** Scored icon to be used when not using slots */
	scoredIcon?: string;
	/** Orientation: 'horizontal' or 'vertical' */
	orientation?: 'horizontal' | 'vertical';
	/** Additional class for the root element */
	class?: string;
	/** Inline style for the root element */
	style?: string;
	/** Reference to the root element */
	element?: HTMLElement;
	/** Slot for children content (default icon) */
	children?: Snippet;
	/** Snippet for the scored icon */
	ratingScoredIcon?: Snippet;
};
</script>

<script lang="ts">
import Icon from '$lib/base/icon/Icon.svelte';
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
				<Icon icon={scoredIcon} />
			</Slotted>
		{:else}
			<Slotted child={children}>
				<Icon icon={defaultIcon} />
			</Slotted>
		{/if}
	{/each}
</div>

<style global>
  @import './rating.css';
</style>
