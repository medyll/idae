/* constants/constants.ts */
import type { Cadence } from '$lib/types/types';

// Definition of common musical cadences
export const cadencePatterns: Cadence[] = [
	{ name: 'Perfect', chords: ['V', 'I'] },
	{ name: 'Plagal', chords: ['IV', 'I'] },
	{ name: 'Deceptive', chords: ['V', 'VI'] },
	{ name: 'Half', chords: ['I', 'V'] },
	{ name: 'Italian', chords: ['IV', 'V', 'I'] },
	{ name: 'German', chords: ['II', 'V', 'I'] },
	{ name: 'Phrygian', chords: ['IV', 'V', 'III'] }
];

// Fundamental root notes in order
export const rootNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Different chord qualities grouped by category
export const qualities = {
	mode: ['maj', 'min'],
	augDim: ['aug', 'dim'],
	sus: ['sus4', 'sus2'],
	sept: ['7', '5']
};

// Modifier symbols (sharp, flat, natural)
export const modifiers = ['♯', '♭', '♮'];

// Armor options with alteration value and key name
export const armorOptions = [
	{ value: '', name: 'C' },
	{ value: '1♯', name: 'G' },
	{ value: '2♯', name: 'D' },
	{ value: '3♯', name: 'A' },
	{ value: '4♯', name: 'E' },
	{ value: '5♯', name: 'B' },
	{ value: '6♯', name: 'F♯' },
	{ value: '7♯', name: 'C♯' },
	{ value: '1♭', name: 'F' },
	{ value: '2♭', name: 'B♭' },
	{ value: '3♭', name: 'E♭' },
	{ value: '4♭', name: 'A♭' },
	{ value: '5♭', name: 'D♭' },
	{ value: '6♭', name: 'G♭' },
	{ value: '7♭', name: 'C♭' }
];

// Musical modes
export const modes = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
