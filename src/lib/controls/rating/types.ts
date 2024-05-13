import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type RatingProps = CommonProps & {
	/** maximum rate */
	ratingBase: number;

	/** current score */
	scored: number;

	/** default icon to be used when not using slots */
	defaultIcon: string | undefined;

	/** scored icon to be used when not using slots */
	scoredIcon: string | undefined;

	/** can be vertical or horizontal */
	direction: 'vertical' | 'horizontal';
	/** Snippet for the scored icon */
	ratingScoredIcon?: Snippet;
};
