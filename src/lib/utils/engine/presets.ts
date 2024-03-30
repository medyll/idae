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
	density: {
		none: '0',
		tight: '0.25rem',
		default: '0.5rem',
		medium: '1rem',
		kind: '1.5rem',
		unset: '1.5rem'
	},
	width: {
		tiny: '2rem',
		small: '6rem',
		medium: '8rem',
		default: '12rem',
		large: '16rem',
		auto: 'auto'
	},
	iconSize: {
		tiny: '8px',
		small: '16px',
		medium: '24px',
		default: '32px',
		large: '48px',
		big: '64px',
		full: '100%',
		auto: 'auto'
	},
	position: Object.values(Position),
	flow: ['relative', 'absolute', 'fixed']
};
