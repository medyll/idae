import { buttonVariant, densePreset, flow, iconSize, tallPreset, width } from '$lib/types/index.js';

export enum Position {
	TC = 'TC', // Top Center
	TL = 'TL', // Top Left
	TR = 'TR', // Top Right
	BC = 'BC', // Bottom Center
	BL = 'BL', // Bottom Left
	BR = 'BR', // Bottom Right
	T = 'T', // Top
	R = 'R', // Right
	B = 'B', // Bottom
	L = 'L', // Left
	C = 'C' // Center
}

export const uiPresets = {
	buttonVariant: Object.keys(buttonVariant),
	dense: Object.keys(densePreset),
	tall: Object.keys(tallPreset),
	density: {
		none: '0',
		tight: '0.25rem',
		default: '0.5rem',
		medium: '1rem',
		kind: '1.5rem',
		unset: '1.5rem'
	},
	width: Object.keys(width),
	iconSize: Object.keys(iconSize),
	position: Object.keys(Position),
	flow: Object.keys(flow)
};
