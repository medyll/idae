export const ratingDemoValues = {};

export const ratingScoredIconDemoValues = {};
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { E } from 'vitest/dist/reporters-yx5ZTtEV.js';

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
