// functions/functions.svelte.ts
import type { Chord, Cadence, ChordEntry } from '../types/types';

export const chords = $state<Chord[]>([]);
export const suggestedCadences = $state<Cadence[]>([]);
export const chordEntries = $state<ChordEntry[]>([]);

export const cadencePatterns: Cadence[] = [
	{ name: 'Perfect', chords: ['V', 'I'] },
	{ name: 'Plagal', chords: ['IV', 'I'] },
	{ name: 'Deceptive', chords: ['V', 'VI'] },
	{ name: 'Half', chords: ['I', 'V'] },
	{ name: 'Italian', chords: ['IV', 'V', 'I'] },
	{ name: 'German', chords: ['II', 'V', 'I'] },
	{ name: 'Phrygian', chords: ['IV', 'V', 'III'] }
];

export const rootNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const qualities = {
	mode: ['maj', 'min'],
	augDim: ['aug', 'dim'],
	sus: ['sus4', 'sus2'],
	sept: ['7', '5']
};

export const modifiers = ['♯', '♭', '♮'];

export function updateCadences() {
	console.log('Current Chords:', $state.snapshot({ chords }));

	if (chordEntries.length === 0) {
		suggestedCadences.length = 0;
		console.log('No chords, no suggestions');
		return;
	}

	const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
	const lastChord = chordEntries[chordEntries.length - 1].chord;

	const rootIndex = rootNotes.indexOf(lastChord.root.toUpperCase());
	let lastChordRoman = rootIndex !== -1 ? romanNumerals[rootIndex] : null;

	if (lastChord.modifier === '♯') {
		lastChordRoman += '#';
	} else if (lastChord.modifier === '♭') {
		lastChordRoman += 'b';
	}

	console.log('Last Chord Roman:', lastChordRoman);

	const suggestions = cadencePatterns.filter((cadence) => {
		return cadence.chords[0] === lastChordRoman;
	});

	suggestedCadences.length = 0;
	suggestedCadences.push(...suggestions);

	console.log('Suggested Cadences:', $state.snapshot({ suggestedCadences }));
}

export function toggleModifier(chordIndex: number, modifier: string) {
	const chord = chordEntries[chordIndex].chord;
	chord.modifier = chord.modifier === modifier ? undefined : modifier;
	updateCadences();
}
